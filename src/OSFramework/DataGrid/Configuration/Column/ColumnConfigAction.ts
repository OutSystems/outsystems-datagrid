// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Configuration.Column {
    /**
     * Defines the configuration for Action Columns
     */
    export class ColumnConfigAction extends ColumnConfig {
        public cellTemplateType: DataGrid.Enum.CellTemplateType;
        public extendedClass: string;
        public url = '';

        constructor(
            config: DataGrid.Types.IColumnConfigs,
            extraConfig: DataGrid.Types.IActionColumnExtraConfigs
        ) {
            super(config);
            this.cellTemplateType = extraConfig.cellTemplateType;
            this.extendedClass = extraConfig.extendedClass;
            this.url = extraConfig.url;
        }
    }
}
