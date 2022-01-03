// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Configuration.Column {
    /**
     * Defines the configuration for Text Columns
     */
    export class ColumnConfigCheckbox extends ColumnConfigConditionalFormat {
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        constructor(config: any, extra: any) {
            super(config, extra);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public getProviderConfig(): any {
            const config = super.getProviderConfig();

            return config;
        }
    }
}
