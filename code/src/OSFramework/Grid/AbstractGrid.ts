// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Grid {
    export abstract class AbstractGrid<
        W,
        Z extends Configuration.IConfigurationGrid
    > implements IGridGeneric<W>
    {
        private _addedRows: Event.Grid.AddNewRowEvent;
        private _columns: Map<string, Column.IColumn>;
        private _columnsGenerator: Column.IColumnGenerator;
        private _columnsKeyType: Map<string, string>;
        private _columnsSet: Set<Column.IColumn>;
        private _configs: Z;
        private _dataSource: Grid.IDataSource;
        private _gridEvents: Event.Grid.GridEventsManager;
        private _isReady: boolean;
        private _uniqueId: string;
        private _validatingAction: Event.Grid.ValidatingAction;
        private _widgetId: string;

        protected _features: Feature.ExposedFeatures;
        protected _provider: W;
        public abstract autoGenerate: boolean;

        constructor(
            uniqueId: string,
            configs: Z,
            dataSource: Grid.IDataSource,
            columnsGenerator: Column.IColumnGenerator
        ) {
            this._uniqueId = uniqueId;
            this._columnsKeyType = new Map<string, string>();
            this._columns = new Map<string, Column.IColumn>();
            this._columnsSet = new Set<Column.IColumn>();
            this._columnsGenerator = columnsGenerator;
            this._configs = configs;
            this._dataSource = dataSource;
            this._isReady = false;
            this._addedRows = new Event.Grid.AddNewRowEvent();
            this._gridEvents = new Event.Grid.GridEventsManager(this);
            this._validatingAction = new Event.Grid.ValidatingAction();

            //The purpose here is to set the datasource parent grid.
            this._dataSource.parentGrid = this;

            console.log(`Constructor grid '${this.uniqueId}'`);
        }

        public get validatingAction(): Event.Grid.ValidatingAction {
            return this._validatingAction;
        }

        public get addedRows(): Event.Grid.AddNewRowEvent {
            return this._addedRows;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        public get dataSource(): Grid.IDataSource {
            return this._dataSource;
        }

        public get uniqueId(): string {
            return this._uniqueId;
        }

        public get widgetId(): string {
            return this._widgetId;
        }

        public get isReady(): boolean {
            return this._isReady;
        }

        public get isSingleEntity(): boolean {
            return this.dataSource.isSingleEntity;
        }

        public get gridEvents(): Event.Grid.GridEventsManager {
            return this._gridEvents;
        }

        public get config(): Z {
            return this._configs;
        }

        public get provider(): W {
            return this._provider;
        }

        public get features(): Feature.ExposedFeatures {
            return this._features;
        }
        private _autoGenCol(): void {
            //let's auto generate the columns
            if (this.dataSource.hasMetadata) {
                //if we have meta information about the columns, let's NOT use wijmo generator
                this.autoGenerate = false;
                const generated = this._columnsGenerator.generate(
                    this,
                    this.dataSource.getMetadata(),
                    this.config.allowEdit
                );
                const newColumns = this._checkForNewColumns();
                // remove existing columns if new dataSource has different columns
                if (this._columns.size > 0 && newColumns) {
                    this._columns.forEach((p) => this.removeColumn(p.uniqueId));
                    generated.forEach((p) => this.addColumn(p));
                }
                // generate new columns
                if (this._columns.size === 0 && newColumns) {
                    generated.forEach((p) => this.addColumn(p));
                }
            } else {
                //if the grid is read-only, then we'll flatten the array and use wijmo generator
                if (!this.config.allowEdit) {
                    this.dataSource.flatten();
                } else {
                    //if the grid is marked as editable, and is to be auto generated, we do not support (because of the save)
                    throw new Error(
                        'You cannot use JSONSerialize and make the grid editable. Please use ArrangeData action for this scenario.'
                    );
                }
            }
        }

        private _checkForNewColumns(): boolean {
            const metadata = this.dataSource.getMetadata();
            let hasColumns = false;
            const columns = Array.from(this._columns.values()).map(
                (col) => col.config.binding
            );
            return Object.keys(metadata).some((source) => {
                const newColumns = Object.keys(metadata[source]);
                hasColumns = newColumns.every((column) => {
                    return columns.indexOf(`${source}.${column}`) !== -1;
                });

                return !hasColumns;
            });
        }

        private _createObjectFromString(obj, value: string) {
            const tree = value.split('.');
            let cur = obj;
            while (tree.length) {
                const name = tree.shift();
                cur[name] = tree.length ? cur[name] || {} : undefined;
                cur = cur[name];
            }
        }

        // Retrieve column's binding key. (e.g Sample_product.Name -> Name)
        private _getKey(col: Column.IColumn): string {
            const binding = col.config.binding;
            const splittedBinding = binding.split('.');

            return splittedBinding[splittedBinding.length - 1];
        }

        private _validateBinding(bindingToValidate: string): void {
            // Split the binding of the column by every dot. (e.g Sample_product.Name -> ['Sample_Product', 'Name'])
            const bindingMatches = bindingToValidate.split('.');

            let metadata = this.dataSource.getMetadata();

            bindingMatches.forEach((binding) => {
                // Check if the matching keyword is a property from metadata
                if (metadata && !metadata.hasOwnProperty(binding)) {
                    throw `The binding "${bindingToValidate}" doesn't match any valid column from the data you specified. ${'\n'} Expected format: "EntityName.FieldName". ${'\n'} For example: "Product_Sample.Name"`;
                }
                // If keyword is a property from metadata then use metadata[keyword] as the new metadata and iterate to the next keyword.
                metadata = metadata[binding];
            });
        }

        private _validateBindings(): void {
            if (this.dataSource.hasMetadata) {
                // validate grid keyBinding
                if (this.config.keyBinding) {
                    this._validateBinding(this.config.keyBinding);
                }

                this.getColumns().forEach((column) => {
                    if (column.config.validateBinding === false) return;
                    this._validateBinding(column.config.binding);

                    // validate dropdown dependency columns
                    if (
                        column.config.hasOwnProperty('parentBinding') &&
                        column.config['parentBinding'] !== ''
                    ) {
                        this._validateBinding(column.config['parentBinding']);
                    }
                });
            }
        }
        protected finishBuild(): void {
            this._isReady = true;

            this.gridEvents.trigger(Event.Grid.GridEventType.Initialized, this);
        }

        public addColumn(col: Column.IColumn): void {
            console.log(`Add column '${col.uniqueId}': '${col.config.header}'`);
            this._columns.set(col.config.binding, col);
            this._columns.set(col.uniqueId, col);
            this._columnsSet.add(col);
            this._columnsKeyType.set(this._getKey(col), col.columnType);
        }

        public build(): void {
            //RGRIDT-372 - let's get the ID of the parent element, which will be used by the developer
            this._widgetId = Helper.GetElementByUniqueId(this.uniqueId).closest(
                Helper.Constants.gridTag
            ).id;

            this.dataSource.build();
        }

        public dispose(): void {
            this._isReady = false;
            this._columns.forEach((col: Column.IColumn, columnID: string) => {
                this.removeColumn(columnID);
            });
        }

        public equalsToID(gridID: string): boolean {
            return gridID === this._uniqueId || gridID === this._widgetId;
        }

        public getColumn(key: string): Column.IColumn {
            if (this._columns.has(key)) {
                return this._columns.get(key);
            } else {
                return this.getColumns().find((p) => p && p.equalsToID(key));
            }
        }

        public getColumns(): Column.IColumn[] {
            return Array.from(this._columnsSet);
        }

        public getColumnsKeyType(): Map<string, string> {
            return this._columnsKeyType;
        }

        public getData(): JSON[] {
            return this.dataSource.getData();
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public getStructureFromColumnBindings(): any {
            const obj = {};
            const columns = this.getColumns();

            if (!columns.length) return;

            columns
                .map((col) => col.config.binding)
                .filter((colBinding) => !colBinding.startsWith('$')) // remove Action/Calculated columns
                .forEach((colBinding) =>
                    this._createObjectFromString(obj, colBinding)
                );
            return obj;
        }

        public hasColumn(key: string): boolean {
            //This method is accessing the map directly, O(1) constant time complexity
            //Image that this can be used inside a formatItems
            //Avoid traversing the array here, otherwise we can have a performance degradation
            return this._columns.has(key);
        }

        public hasColumnsDefined(): boolean {
            const widget = Helper.GetElementByUniqueId(this.uniqueId);
            const gridElement = widget.closest(Helper.Constants.gridTag);
            const columns = gridElement.querySelectorAll(
                Helper.Constants.columnCss
            );

            return columns.length > 0;
        }

        public hasResults(): boolean {
            return this.dataSource.hasResults();
        }

        public removeColumn(columnID: string): void {
            if (this._columns.has(columnID)) {
                const col = this._columns.get(columnID);

                col.dispose();
                this._columns.delete(columnID);
                this._columns.delete(col.config.binding);
                this._columnsSet.delete(col);

                console.log(
                    `Remove column '${columnID}': '${col.config.header}'`
                );
            } else {
                console.error(
                    `removeColumn - Column id:${columnID} doesn't exist`
                );
            }
        }

        public setData(data: string): boolean {
            this.dataSource.setData(data);

            if (this.isReady) {
                if (!this.hasColumnsDefined()) {
                    this._autoGenCol();
                } else {
                    this._validateBindings();
                }

                return true;
            }

            return false;
        }
        public abstract get rowMetadata(): Interface.IRowMetadata;

        public abstract buildFeatures(): void;

        public abstract changeColumnProperty(
            columnID: string,
            propertyName: string,
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
            propertyValue: any
        ): void;

        public abstract changeProperty(
            propertyName: string,
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
            propertyValue: any
        ): void;

        public abstract clearAllChanges(
            forceClearValidationMarks: boolean
        ): void;

        public abstract clearAllChangesByRowKeys(
            rowKeys: Array<string>,
            forceClearValidationMarks: boolean
        ): void;

        public abstract clearChanges(): void;

        public abstract getChangesMade(): OSStructure.ChangesDone;

        // public abstract getData(): JSON[];

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public abstract getViewLayout(): any;

        public abstract setCellError(
            binding: string,
            row: number,
            message: string
        ): void;

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        // public abstract setData(data: any): boolean;

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public abstract setViewLayout(state: any): void;
    }
}
