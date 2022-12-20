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

        /**
         * Set the configs for decimalPlaces
         *
         * @param decimalPlaces Precision for numeric values
         */
        private _setDecimalPlaces(decimalPlaces: number) {
            if (decimalPlaces > 11 || decimalPlaces < 0) {
                throw new Error(
                    `Invalid parameter decimal places configuration for column "${this.provider.header}".\nAvailable range for decimal places 0 to 11.`
                );
            } else if (decimalPlaces === undefined) {
                this.config.decimalPlaces = 2; // properties without a value are removed by default from JSON object, what makes them undefined
            } else {
                this.config.decimalPlaces = decimalPlaces;
            }

            this._setFormat();
        }

        /**
         * Makes the provider string format based on decimal places and thousands separator
         */
        private _setFormat(): void {
            // if format starts with n, the number will have thousand separator
            // if starts with f, it won't
            const format = this.config.hasThousandSeparator ? 'n' : 'f';

            this.config.format = `${format} ${this.config.decimalPlaces}`;
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
            this._setDecimalPlaces(this.config.decimalPlaces);
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
                    this._setDecimalPlaces(propertyValue);
                    this.applyConfigs();
                    break;
                case OSFramework.DataGrid.OSStructure.ColumnProperties
                    .HasThousandSeparator:
                    this.config.hasThousandSeparator = propertyValue;
                    this._setFormat();
                    this.applyConfigs();
                    break;
                default:
                    super.changeProperty(propertyName, propertyValue);
            }
        }
    }
}
