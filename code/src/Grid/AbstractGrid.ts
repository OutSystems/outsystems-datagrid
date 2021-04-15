// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Grid {
    export enum GridType {
        FlexGrid = 'FlexGrid',
        PivotGrid = 'PivotGrid',
        TransposedGrid = 'TransposedGrid'
    }

    export interface IGrid extends IBuilder, IDisposable, ISearchById, IView {
        addedRows: InternalEvents.AddNewRowEvent;
        autoGenerate: boolean;
        config: IConfigurationGrid;
        dataSource: DS.IDataSource;
        features: Features.CommmonFeatures;
        gridEvents: ExternalEvents.GridEventsManager;
        isReady: boolean;
        isSingleEntity: boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        provider: any;
        rowMetadata: IRowMetadata;
        uniqueId: string;
        validatingAction: InternalEvents.ValidatingAction;
        widgetId: string;

        addColumn(col: Column.IColumn);
        changeColumnProperty(
            columnID: string,
            propertyName: string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            propertyValue: any
        ): void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        changeProperty(propertyName: string, propertyValue: any): void;
        clearAllChanges(): void;
        getChangesMade(): DS.ChangesDone;
        /**
         * Get the column on the grid by giving a columnID or a binding.
         * @param key key can be the uniqueId or a binding of a column
         * @returns Column with the same columnID or binding.
         */
        getColumn(key: string): Column.IColumn;
        /** Return an array containing all grid's column
         * @returns Array of grid's columns
         */
        getColumns(): Column.IColumn[];
        getData(): JSON[];
        /**
         * Verifies grid has the given Column
         * @param key key can be the uniqueId or a binding of a column
         */
        hasColumn(key: string): boolean;
        /**
         * Look to DOM trying to find if some column was defined for this Grid
         */
        hasColumnsDefined(): boolean;
        hasResults(): boolean;
        removeColumn(columnID: string);
        setCellError(binding: string, row: number, message: string);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setData(data: any): boolean;
    }

    export interface IGridGeneric<W> extends IGrid {
        provider: W;
    }

    export abstract class AbstractGrid<W, Z extends IConfigurationGrid>
        implements IGridGeneric<W> {
        private _addedRows: InternalEvents.AddNewRowEvent;
        private _columns: Map<string, Column.IColumn>;
        private _columnsSet: Set<Column.IColumn>;
        private _configs: Z;
        private _dataSource: DS.IDataSource;
        private _gridEvents: ExternalEvents.GridEventsManager;
        private _isReady: boolean;
        private _uniqueId: string;
        private _validatingAction: InternalEvents.ValidatingAction;
        private _widgetId: string;

        protected _features: Features.CommmonFeatures;
        protected _provider: W;

        constructor(uniqueId: string, configs: Z, dataSource: DS.IDataSource) {
            this._uniqueId = uniqueId;
            this._columns = new Map<string, Column.IColumn>();
            this._columnsSet = new Set<Column.IColumn>();
            this._configs = configs;
            this._dataSource = dataSource;
            this._addedRows = new InternalEvents.AddNewRowEvent();
            this._gridEvents = new ExternalEvents.GridEventsManager(this);
            this._isReady = false;
            this._validatingAction = new InternalEvents.ValidatingAction();

            console.log(`Constructor grid '${this.uniqueId}'`);
        }

        public get validatingAction(): InternalEvents.ValidatingAction {
            return this._validatingAction;
        }

        public get addedRows(): InternalEvents.AddNewRowEvent {
            return this._addedRows;
        }

        public get dataSource(): DS.IDataSource {
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

        public get gridEvents(): ExternalEvents.GridEventsManager {
            return this._gridEvents;
        }

        public get config(): Z {
            return this._configs;
        }

        public get provider(): W {
            return this._provider;
        }

        public get features(): Features.CommmonFeatures {
            return this._features;
        }

        protected finishBuild(): void {
            this._isReady = true;

            this.gridEvents.trigger(
                ExternalEvents.GridEventType.Initialized,
                this
            );
        }

        public addColumn(col: Column.IColumn): void {
            console.log(`Add column '${col.uniqueId}': '${col.config.header}'`);
            this._columns.set(col.config.binding, col);
            this._columns.set(col.uniqueId, col);
            this._columnsSet.add(col);
        }

        public build(): void {
            //RGRIDT-372 - let's get the ID of the parent element, which will be used by the developer
            this._widgetId = Helper.GetElementByUniqueId(this.uniqueId).closest(
                Helper.Constants.gridTag
            ).id;
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

        public abstract get rowMetadata(): IRowMetadata;

        public abstract autoGenerate: boolean;

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

        public abstract clearAllChanges(): void;

        public abstract getChangesMade(): DS.ChangesDone;

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

        public getData(): JSON[] {
            return this.dataSource.getData();
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

        private _autoGenCol(): void {
            //let's auto generate the columns
            if (this.dataSource.hasMetadata) {
                //if we have meta information about the columns, let's NOT use wijmo generator
                this.autoGenerate = false;
                const generated = Column.Generator.ColumnGenerator(
                    this,
                    this.dataSource.getMetadata(),
                    this.config.allowEdit
                );
                generated.forEach(p => this.addColumn(p));
            } else {
                //if the grid is read-only, then we'll flatten the array and use wijmo generator
                if (this.config.allowEdit) {
                    this.dataSource.flatten();
                } else {
                    //if the grid is marked as editable, and is to be auto generated, we do not support (because of the save)
                    throw new Error(
                        'You cannot use JSONSerialize and make the grid editable. Please use ArrangeData action for this scenario.'
                    );
                }
            }
        }

        private _validateBindings(): void {
            if (this.dataSource.hasMetadata) {
                this.getColumns().forEach((column) => {
                    if (column.config.validateBinding === false) return;
                    // Split the binding of the column by every dot. (e.g Sample_product.Name -> ['Sample_Product', 'Name'])
                    const bindingMatches = column.config.binding.split('.');
                    let metadata = this.dataSource.getMetadata();
                    bindingMatches.forEach((keyword) => {
                        // Check if the matching keyword is a property from metadata
                        if (metadata && !metadata.hasOwnProperty(keyword)) {
                            throw `The binding ${
                                column.config.binding
                            } doesn't match any valid column from the data you specified. ${'\n'} Expected format: "EntityName.FieldName". ${'\n'} For example: "Product_Sample.Name"`;
                        }
                        // If keyword is a property from metadata then use metadata[keyword] as the new metadata and iterate to the next keyword.
                        metadata = metadata[keyword];
                    });
                });
            }
        }

        

        // public abstract get autoGenerate(): boolean;

        // public set autoGenerate(value: boolean) {
        //     this.provider.autoGenerateColumns = value;
        // }
    }
}
