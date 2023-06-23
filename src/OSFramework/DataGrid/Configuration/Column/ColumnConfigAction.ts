// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Configuration.Column {
    /**
     * Defines the configuration for Action Columns
     */
    export class ColumnConfigAction extends ColumnConfig {
        public actionColumnElementType: DataGrid.Enum.ActionColumnElementType;
        public extendedClass: string;
        public externalUrl: string;

        constructor(
            config: DataGrid.Types.IColumnConfigs,
            extraConfig: DataGrid.Types.IActionColumnExtraConfigs
        ) {
            super(config);
            this.actionColumnElementType = extraConfig.actionColumnElementType;
            this.externalUrl = extraConfig.externalURL;
        }
    }
}
