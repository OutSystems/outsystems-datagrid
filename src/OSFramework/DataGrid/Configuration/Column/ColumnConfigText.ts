// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Configuration.Column {
    /**
     * Defines the configuration for Text Columns
     */
    export class ColumnConfigText extends ColumnConfigConditionalFormat {
        /** The mask applied to the input box during edition
         * This can't conflict with format property
         */
        public mask: string;

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        constructor(config: any, extra: any) {
            super(config, extra);
            this.mask = extra.mask;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public getProviderConfig(): any {
            const config = super.getProviderConfig();

            //Mask and format can't have different values
            //Assuming a mask was defined, it should override format
            if (this.mask && this.mask !== this.format) {
                config.mask = this.mask
                delete config.format;
            }

            return config;
        }
    }
}
