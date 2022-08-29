// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Configuration.Column {
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

        constructor(
            config: DataGrid.Types.IColumnConfigs,
            extra: DataGrid.Types.IDropdownColumnExtraConfigs
        ) {
            super(config, extra);
            this.dataMap = undefined;
            this.dropdownOptions = extra.datamap;
            this.parentBinding = extra.parentBinding;
        }

        public getProviderConfig(): DataGrid.Types.IColumnProviderConfigs {
            const provider = super.getProviderConfig();
            provider.dataMap = this.dataMap;
            provider.dataMapEditor = this.dataMapEditor;

            return provider;
        }
    }
}
