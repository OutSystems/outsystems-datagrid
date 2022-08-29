// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Configuration.Column {
    /**
     * Defines the configuration for Text Columns
     */
    export class ColumnConfigCheckbox extends ColumnConfigConditionalFormat {
        constructor(
            config: DataGrid.Types.IColumnConfigs,
            extra: DataGrid.Types.ICheckboxColumnExtraConfigs
        ) {
            super(config, extra);
        }

        public getProviderConfig(): DataGrid.Types.IColumnProviderConfigs {
            const config = super.getProviderConfig();

            return config;
        }
    }
}
