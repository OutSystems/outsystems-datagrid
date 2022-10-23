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

        // by default, we want numbers to have thousand separator
        private _setEditorFormat(decimalPlaces): void {
            this.config.format = `n ${decimalPlaces}`;
        }

        /**
         * Makes the provider string format based on decimal places
         *
         * @param decimalPlaces Precision for numeric values
         * @param args Used for extension by inherited classes
         */
        protected _setFormat(decimalPlaces: number): void {
            if (decimalPlaces > 11 || decimalPlaces < 0) {
                throw new Error(
                    `Invalid parameter decimal places configuration for column "${this.provider.header}".\nAvailable range for decimal places 0 to 11.`
                );
            } else if (decimalPlaces === undefined) {
                this.config.decimalPlaces = 0; // properties without a value are removed by default from JSON object, what makes them undefined
            } else {
                this.config.decimalPlaces =
                    decimalPlaces >= 0
                        ? decimalPlaces
                        : wijmo.culture.Globalize.numberFormat.currency
                              .decimals;
            }

            this._setEditorFormat(decimalPlaces);
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
            this._setFormat(this.config.decimalPlaces);
            super.build();
            this.grid.features.filter.deactivate(this.uniqueId);
            this.grid.features.calculatedField.addFormula(
                this.config.binding,
                this.config.header,
                this.config.formula
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
        public changeProperty(propertyName: string, propertyValue: any): void {
            switch (propertyName) {
                case OSFramework.DataGrid.OSStructure.ColumnProperties
                    .DecimalPlaces:
                    this._setFormat(propertyValue);
                    this.applyConfigs();
                    break;
                default:
                    super.changeProperty(propertyName, propertyValue);
            }
        }
    }
}
