// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Column {
    export class TextColumn extends AbstractProviderColumn<OSFramework.DataGrid.Configuration.Column.ColumnConfigText> {
        constructor(
            grid: OSFramework.DataGrid.Grid.IGrid,
            columnID: string,
            configs: OSFramework.DataGrid.Types.ColumnConfigs,
            extraConfig: OSFramework.DataGrid.Types.TextColumnExtraConfigs
        ) {
            super(
                grid,
                columnID,
                new OSFramework.DataGrid.Configuration.Column.ColumnConfigText(
                    configs,
                    extraConfig
                )
            );
            this._columnEvents =
                new OSFramework.DataGrid.Event.Column.ColumnEventsManager(this);
        }

        /** Returns all the events associated to the column */
        public get columnEvents(): OSFramework.DataGrid.Event.Column.ColumnEventsManager {
            return this._columnEvents;
        }

        public get columnType(): OSFramework.DataGrid.Enum.ColumnType {
            return OSFramework.DataGrid.Enum.ColumnType.Text;
        }

        public get providerType(): wijmo.DataType {
            return wijmo.DataType.String;
        }
    }
}
