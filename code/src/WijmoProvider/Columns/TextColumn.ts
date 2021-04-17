// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Column {
    export class TextColumn extends AbstractProviderColumn<ColumnConfig> {
        constructor(grid: OSFramework.Grid.IGrid, columnID: string, configs: JSON) {
            super(grid, columnID, new ColumnConfig(configs));
            this._columnEvents = new OSFramework.Event.ColumnEventsManager(this);
        }

        /** Returns all the events associated to the column */
        public get columnEvents(): OSFramework.Event.ColumnEventsManager {
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
