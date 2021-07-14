// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Column {
    export class CalculatedColumn extends AbstractProviderColumn<OSFramework.Configuration.Column.ColumnConfigAdditional> {
        constructor(
            grid: OSFramework.Grid.IGrid,
            columnID: string,
            configs: any,
            extraConfig: any
        ) {
            super(
                grid,
                columnID,
                new OSFramework.Configuration.Column.ColumnConfigAdditional(
                    configs,
                    extraConfig
                )
            );
            this._columnEvents =
                new OSFramework.Event.Column.ColumnEventsManager(this);

            // set custom binding with this format: $ColumnHeader_timestamp
            // eg.: $Average_423432413123
            this.config.binding =
                '$' +
                this.config.header.replace(/[^a-zA-Z]+/g, '') +
                '_' +
                extraConfig.formula.function;
        }

        /** Returns all the events associated to the column */
        public get columnEvents(): OSFramework.Event.Column.ColumnEventsManager {
            return this._columnEvents;
        }

        public get columnType(): OSFramework.Enum.ColumnType {
            return OSFramework.Enum.ColumnType.Calculated;
        }

        public get providerType(): wijmo.DataType {
            return wijmo.DataType.String;
        }
    }
}
