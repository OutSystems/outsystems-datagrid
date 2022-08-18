// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Column {
    export class CalculatedColumn extends AbstractProviderColumn<OSFramework.DataGrid.Configuration.Column.ColumnConfigAdditional> {
        constructor(
            grid: OSFramework.DataGrid.Grid.IGrid,
            columnID: string,
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
            configs: any,
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
            extraConfig: any
        ) {
            super(
                grid,
                columnID,
                new OSFramework.DataGrid.Configuration.Column.ColumnConfigAdditional(
                    configs,
                    extraConfig
                )
            );
            this._columnEvents =
                new OSFramework.DataGrid.Event.Column.ColumnEventsManager(this);

            // set custom binding with this format: $ColumnHeader_timestamp
            // eg.: $Average_423432413123
            this.config.binding =
                '$' +
                this.config.header.replace(/[^a-zA-Z_0-9-]/g, '') +
                '_' +
                extraConfig.formula.function;
        }

        /** Returns all the events associated to the column */
        public get columnEvents(): OSFramework.DataGrid.Event.Column.ColumnEventsManager {
            return this._columnEvents;
        }

        public get columnType(): OSFramework.DataGrid.Enum.ColumnType {
            return OSFramework.DataGrid.Enum.ColumnType.Calculated;
        }

        public get providerType(): wijmo.DataType {
            return wijmo.DataType.String;
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public build(): any {
            super.build();
            this.grid.features.filter.deactivate(this.uniqueId);
            this.grid.features.calculatedField.addFormula(
                this.config.binding,
                this.config.header,
                this.config.formula
            );
        }
    }
}
