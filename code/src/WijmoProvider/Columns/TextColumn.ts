// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Column {
    export class TextColumn extends AbstractProviderColumn<OSFramework.Configuration.Column.ColumnConfigText> {
        constructor(
            grid: OSFramework.Grid.IGrid,
            columnID: string,
            configs: JSON,
            extraConfig: JSON
        ) {
            super(
                grid,
                columnID,
                new OSFramework.Configuration.Column.ColumnConfigText(
                    configs,
                    extraConfig
                )
            );
            this._columnEvents =
                new OSFramework.Event.Column.ColumnEventsManager(this);
        }

        /** Returns all the events associated to the column */
        public get columnEvents(): OSFramework.Event.Column.ColumnEventsManager {
            return this._columnEvents;
        }

        public get columnType(): OSFramework.Enum.ColumnType {
            return OSFramework.Enum.ColumnType.Text;
        }

        public get providerType(): wijmo.DataType {
            return wijmo.DataType.String;
        }
    }
}
