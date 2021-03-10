// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Grid {
    export type changesDone = {
        addedLinesJSON: string;
        editedLinesJSON: string;
        hasChanges: boolean;
        removedLinesJSON: string;
    };

    export enum GridType {
        FlexGrid = 'FlexGrid',
        PivotGrid = 'PivotGrid',
        TransposedGrid = 'TransposedGrid'
    }

    export interface IGrid extends IBuilder, IDisposable, ISearchById, IView {
        addedRows: InternalEvents.AddNewRowEvent;
        autoGenerate: boolean;
        columns: Map<string, Column.IColumn>; //Column.IColumn[];
        config: IConfigurationGrid;
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
        getChangesMade(): changesDone;
        getData(): JSON[];
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
        private _configs: Z;
        private _gridEvents: ExternalEvents.GridEventsManager;
        private _isReady: boolean;
        private _uniqueId: string;
        private _validatingAction: InternalEvents.ValidatingAction;
        private _widgetId: string;

        protected _features: Features.CommmonFeatures;
        protected _provider: W;

        constructor(uniqueId: string, configs: Z) {
            this._uniqueId = uniqueId;
            this._columns = new Map<string, Column.IColumn>();
            this._configs = configs;
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

        public get uniqueId(): string {
            return this._uniqueId;
        }

        public get widgetId(): string {
            return this._widgetId;
        }

        public get columns(): Map<string, Column.IColumn> {
            return this._columns;
        }

        public get isReady(): boolean {
            return this._isReady;
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

        public hasColumnsDefined(): boolean {
            const widget = Helper.GetElementByUniqueId(this.uniqueId);
            const gridElement = widget.closest(Helper.Constants.gridTag);
            const columns = gridElement.querySelectorAll(
                Helper.Constants.columnCss
            );

            return columns.length > 0;
        }

        public removeColumn(columnID: string): void {
            if (this._columns.has(columnID)) {
                const col = this._columns.get(columnID);

                col.dispose();
                this._columns.delete(columnID);
                this._columns.delete(col.config.binding);

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
        public abstract getViewConfig(): any;

        public abstract hasResults(): boolean;

        public abstract setCellError(
            binding: string,
            row: number,
            message: string
        ): void;

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public abstract setData(data: any): boolean;

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public abstract setViewConfig(state: any): void;
    }
}
