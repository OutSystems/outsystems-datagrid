namespace Column {
    /**
     * Defines the configuration for Dropdown custom editors
     */
    export class ColumnConfigDropdown extends ColumnConfig {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public dataMap: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public dataMapEditor: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public dropdownOptions: any;

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        constructor(config: any, extra: any) {
            super(config);
            this.dataMap = undefined;
            this.dropdownOptions = extra.datamap;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public getProviderConfig(): any {
            const provider = super.getProviderConfig();
            provider.dataMap = this.dataMap;
            provider.dataMapEditor = this.dataMapEditor;

            return provider;
        }
    }}