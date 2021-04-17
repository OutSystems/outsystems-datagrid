// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Grid {
    export abstract class AbstractGrid<W, Z extends Configuration.IConfigurationGrid>
        implements IGridGeneric<W> {
        private _addedRows: OSFramework.Event.Grid.AddNewRowEvent;
        private _columns: Map<string, OSFramework.Column.IColumn>;
        private _columnsSet: Set<OSFramework.Column.IColumn>;
        private _configs: Z;
        private _gridEvents: OSFramework.Event.Grid.GridEventsManager;
        private _isReady: boolean;
        private _uniqueId: string;
        private _validatingAction: OSFramework.Event.Grid.ValidatingAction;
        private _widgetId: string;

        protected _features: OSFramework.Feature.CommmonFeatures;
        protected _provider: W;

        constructor(uniqueId: string, configs: Z) {
            this._uniqueId = uniqueId;
            this._columns = new Map<string, OSFramework.Column.IColumn>();
            this._columnsSet = new Set<OSFramework.Column.IColumn>();
            this._configs = configs;
            this._isReady = false;
            this._addedRows = new OSFramework.Event.Grid.AddNewRowEvent();
            this._gridEvents = new OSFramework.Event.Grid.GridEventsManager(this);
            this._validatingAction = new OSFramework.Event.Grid.ValidatingAction();

            console.log(`Constructor grid '${this.uniqueId}'`);
        }

        public get validatingAction(): OSFramework.Event.Grid.ValidatingAction {
            return this._validatingAction;
        }

        public get addedRows(): OSFramework.Event.Grid.AddNewRowEvent {
            return this._addedRows;
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

        public get gridEvents(): OSFramework.Event.Grid.GridEventsManager {
            return this._gridEvents;
        }

        public get config(): Z {
            return this._configs;
        }

        public get provider(): W {
            return this._provider;
        }

        public get features(): WijmoProvider.Feature.CommmonFeatures {
            return this._features;
        }

        protected finishBuild(): void {
            this._isReady = true;

            this.gridEvents.trigger(
                OSFramework.Event.Grid.GridEventType.Initialized,
                this
            );
        }

        public addColumn(col: OSFramework.Column.IColumn): void {
            console.log(`Add column '${col.uniqueId}': '${col.config.header}'`);
            this._columns.set(col.config.binding, col);
            this._columns.set(col.uniqueId, col);
            this._columnsSet.add(col);
        }

        public build(): void {
            //RGRIDT-372 - let's get the ID of the parent element, which will be used by the developer
            this._widgetId = OSFramework.Helper.GetElementByUniqueId(this.uniqueId).closest(
                OSFramework.Helper.Constants.gridTag
            ).id;
        }

        public dispose(): void {
            this._isReady = false;
            this._columns.forEach((col: OSFramework.Column.IColumn, columnID: string) => {
                this.removeColumn(columnID);
            });
        }

        public equalsToID(gridID: string): boolean {
            return gridID === this._uniqueId || gridID === this._widgetId;
        }

        public getColumn(key: string): OSFramework.Column.IColumn {
            if (this._columns.has(key)) {
                return this._columns.get(key);
            } else {
                return this.getColumns().find((p) => p && p.equalsToID(key));
            }
        }

        public getColumns(): OSFramework.Column.IColumn[] {
            return Array.from(this._columnsSet);
        }

        public hasColumn(key: string): boolean {
            //This method is accessing the map directly, O(1) constant time complexity
            //Image that this can be used inside a formatItems
            //Avoid traversing the array here, otherwise we can have a performance degradation
            return this._columns.has(key);
        }

        public hasColumnsDefined(): boolean {
            const widget = OSFramework.Helper.GetElementByUniqueId(this.uniqueId);
            const gridElement = widget.closest(OSFramework.Helper.Constants.gridTag);
            const columns = gridElement.querySelectorAll(
                OSFramework.Helper.Constants.columnCss
            );

            return columns.length > 0;
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

        public abstract get rowMetadata(): Interface.IRowMetadata;

        public abstract get autoGenerate(): boolean;

        public abstract get isSingleEntity(): boolean;

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

        public abstract getChangesMade(): changesDone;

        public abstract getData(): JSON[];

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public abstract getViewLayout(): any;

        public abstract hasResults(): boolean;

        public abstract setCellError(
            binding: string,
            row: number,
            message: string
        ): void;

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public abstract setData(data: any): boolean;

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public abstract setViewLayout(state: any): void;
    }
}
