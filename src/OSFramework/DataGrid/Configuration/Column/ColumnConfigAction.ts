// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Configuration.Column {
    /**
     * Defines the configuration for Action Columns
     */
    export class ColumnConfigAction extends ColumnConfig {
        public actionColumnElementType: DataGrid.Enum.CellTemplateElementType;
        public extendedClass: string;
        public url: string;

        constructor(
            config: DataGrid.Types.IColumnConfigs,
            extraConfig: DataGrid.Types.IActionColumnExtraConfigs
        ) {
            super(config);
            this.actionColumnElementType = extraConfig.actionColumnElementType;
            this.externalURL = extraConfig.externalURL;
        }

        public getProviderConfig(): DataGrid.Types.IColumnProviderConfigs {
            const config = super.getProviderConfig();
            if (
                this.actionColumnElementType ===
                DataGrid.Enum.CellTemplateElementType.Button
            )
                config.cssClassAll = 'has-image-or-button';

            return config;
        }
    }
}
