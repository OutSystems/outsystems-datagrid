// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Configuration.Column {
    /**
     * Defines the configuration for Numeric custom editors
     */
    export class EditorConfigNumber extends AbstractEditorConfig {
        public decimalPlaces: number;
        public hasThousandSeparator: boolean;
        public maxValue?: number;
        public minValue?: number;
        public step: number;

        // eslint-disable-next-line
        constructor(config: any) {
            super(config);

            //When both are 0, seems that we receive the default value from OS
            //Set it as undefined and the column class will calculate the correct values
            if (this.minValue === this.maxValue && this.minValue === 0) {
                this.maxValue = undefined;
                this.minValue = undefined;
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public getProviderConfig(): any {
            // eslint-disable-next-line prefer-const
            let provider = {
                format: this.format,
                isRequired: this.required,
                min: this.minValue,
                max: this.maxValue,
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
