// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Configuration.Column {
    /**
     * Defines the configuration for Numeric custom editors
     */
    export class EditorConfigNumber extends AbstractEditorConfig {
        public decimalPlaces: number;
        public hasThousandSeparator: boolean;
        public maxPerDecPlaces: number;
        public maxValue?: number;
        public minPerDecPlaces: number;
        public minValue?: number;
        public step: number;

        // eslint-disable-next-line
        constructor(
            config:
                | DataGrid.Types.INumberColumnExtraConfigs
                | DataGrid.Types.ICurrencyColumnExtraConfigs
        ) {
            super(config);

            //When both are 0, seems that we receive the default value from OS
            //Set it as undefined and the column class will calculate the correct values
            if (this.minValue === this.maxValue && this.minValue === 0) {
                this.maxValue = undefined;
                this.minValue = undefined;
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public getProviderConfig(): DataGrid.Types.INumberEditorProviderConfigs {
            // eslint-disable-next-line prefer-const
            let provider = {
                format: this.format,
                isRequired: this.required,
                min:
                    // minPerDecPlaces defines the limit of the minValue,
                    // so it takes precedence over minValue if minValue is smaller than minPerDecPlaces
                    this.minValue !== undefined &&
                    this.minValue > this.minPerDecPlaces
                        ? this.minValue
                        : this.minPerDecPlaces,
                max:
                    // maxPerDecPlaces defines the limit of the maxValue,
                    // so it takes precedence over maxValue if maxValue is bigger than maxPerDecPlaces
                    this.maxValue !== undefined &&
                    this.maxValue < this.maxPerDecPlaces
                        ? this.maxValue
                        : this.maxPerDecPlaces,
                step: this.step
            };

            //Cleanning undefined properties
            Object.keys(provider).forEach(
                (key) => provider[key] === undefined && delete provider[key]
            );

            return provider;
        }
    }
}
