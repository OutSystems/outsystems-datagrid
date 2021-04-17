// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Column {
    export class TextColumn extends AbstractProviderColumn<ColumnConfig> {
        constructor(grid: WijmoProvider.Grid.IGrid, columnID: string, configs: JSON) {
            super(grid, columnID, new ColumnConfig(configs));
            this._columnEvents = new ExternalEvents.ColumnEventsManager(this);
        }

        /** Returns all the events associated to the column */
        public get columnEvents(): ExternalEvents.ColumnEventsManager {
            return this._columnEvents;
        }

        public get columnType(): ColumnType {
            return ColumnType.Text;
        }

        public get providerType(): wijmo.DataType {
            return wijmo.DataType.String;
        }
    }
}
