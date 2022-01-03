// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Configuration.Column {
    /**
     * Defines the configuration for Dropdown custom editors
     */
    export class ColumnConfigDropdown extends ColumnConfigConditionalFormat {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public dataMap: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public dataMapEditor: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public dropdownOptions: any;
        public parentBinding: string;

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        constructor(config: any, extra: any) {
            super(config, extra);
            this.dataMap = undefined;
            this.dropdownOptions = extra.datamap;
            this.parentBinding = extra.parentBinding;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public getProviderConfig(): any {
            const provider = super.getProviderConfig();
            provider.dataMap = this.dataMap;
            provider.dataMapEditor = this.dataMapEditor;

            return provider;
        }
    }
}
