// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Configuration.Column {
    /**
     * Defines the configuration for Action Columns
     */
    export class ColumnConfigAction extends ColumnConfig {
        public actionColumnType: DataGrid.Enum.ActionColumnType;
        public extendedClass: string;
        public url: string;

        constructor(
            config: DataGrid.Types.IColumnConfigs,
            extraConfig: DataGrid.Types.IActionColumnExtraConfigs
        ) {
            super(config);
            this.actionColumnType = extraConfig.actionColumnType;
        }
    }
}
