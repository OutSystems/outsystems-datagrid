namespace Column {
    /**
     * Defines the configuration for Date and Datetime custom editors
     */
    export class EditorConfigDate extends AbstractEditorConfig {
        public max: Date;
        public min: Date;
        public timeFormat: string;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public getProviderConfig(): any {
            // eslint-disable-next-line prefer-const
            let provider = {
                format: this.format,
                timeFormat: this.timeFormat,
                isRequired: this.required,
                min: this.min,
                max: this.max
            };

            //Cleanning undefined properties
            Object.keys(provider).forEach(
                (key) => provider[key] === undefined && delete provider[key]
            );

            return provider;
        }
    }
}
