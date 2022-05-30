// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Column {
    /**
     * Defines limites (positive and negative) based on decimal places
     */
    const MaxNonDecimalValues = [
        9007199254740991, // 0 decimal places
        562949953421311, // 1 decimal places
        70368744177663, // 2 decimal places
        8796093022207, // 3 decimal places
        549755813887, // 4 decimal places
        68719476735, // 5 decimal places
        8589934591, // 6 decimal places
        536870911, // 7 decimal places
        67108863, // 8 decimal places
        8388607, // 9 decimal places
        524287, // 10 decimal places
        65535 // 11 decimal places
    ];

    export class NumberColumn<
        T extends OSFramework.Configuration.Column.EditorConfigNumber
    > extends AbstractProviderColumnEditor<
        OSFramework.Configuration.Column.ColumnConfig,
        T
    > {
        constructor(
            grid: OSFramework.Grid.IGrid,
            columnID: string,
            configs: JSON,
            editorConfig: T
        ) {
            super(
                grid,
                columnID,
                new OSFramework.Configuration.Column.ColumnConfig(configs),
                editorConfig
            );
            this._columnEvents =
                new OSFramework.Event.Column.ColumnEventsManager(this);
        }

        /** Returns all the events associated to the column */
        public get columnEvents(): OSFramework.Event.Column.ColumnEventsManager {
            return this._columnEvents;
        }

        public get columnType(): OSFramework.Enum.ColumnType {
            return OSFramework.Enum.ColumnType.Number;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public get editorProviderType(): any {
            return wijmo.input.InputNumber;
        }

        public get providerType(): wijmo.DataType {
            return wijmo.DataType.Number;
        }

        // by default, we want numbers to have thousand separator
        private _setEditorFormat(hasThousandSeparator = true): void {
            // if format starts with n, the number will have thousand separator
            // if starts with f, it won't
            const format = hasThousandSeparator ? 'n' : 'f';

            this.config.format = `${format} ${this.editorConfig.decimalPlaces}`;
            this.editorConfig.format = this.config.format;
        }

        /**
         * Configure the column's editor to validate maximum values
         *
         * @param maxValue Maximum allowed value for column. When undefined the configuration will be based on decimal places
         */
        private _setMaxValue(maxValue?: number) {
            const decimalPlaces = this.editorConfig.decimalPlaces;
            const maxPerDecPlaces = MaxNonDecimalValues[decimalPlaces];

            this.editorConfig.maxValue = maxValue || maxPerDecPlaces;
        }

        /**
         * Configure the column's editor to validate minimum values
         *
         * @param minValue Minimum allowed value for column. When undefined the configuration will be based on decimal places
         */
        private _setMinValue(minValue?: number) {
            const decimalPlaces = this.editorConfig.decimalPlaces;
            const minPerDecPlaces = -MaxNonDecimalValues[decimalPlaces];

            this.editorConfig.minValue = minValue || minPerDecPlaces;
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
                this.editorConfig.decimalPlaces = 0; // properties without a value are removed by default from JSON object, what makes them undefined
            } else {
                this.editorConfig.decimalPlaces =
                    decimalPlaces >= 0
                        ? decimalPlaces
                        : wijmo.culture.Globalize.numberFormat.currency
                              .decimals;
            }

            this._setMaxValue();
            this._setMinValue();
            this._setEditorFormat(this.editorConfig.hasThousandSeparator);
        }

        public build(): void {
            this._setFormat(this.editorConfig.decimalPlaces);

            super.build();
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
        public changeProperty(propertyName: string, propertyValue: any): void {
            switch (propertyName) {
                case 'decimalPlaces':
                    this._setFormat(propertyValue);
                    this.applyConfigs();
                    break;
                case 'hasThousandSeparator':
                    this.editorConfig.hasThousandSeparator = propertyValue;
                    this._setEditorFormat(propertyValue);
                    this.applyConfigs();
                    break;
                case 'minValue':
                    this._setMinValue(propertyValue);
                    this.applyConfigs();
                    break;
                case 'maxValue':
                    this._setMaxValue(propertyValue);
                    this.applyConfigs();
                    break;
                default:
                    super.changeProperty(propertyName, propertyValue);
            }
        }
    }
}
