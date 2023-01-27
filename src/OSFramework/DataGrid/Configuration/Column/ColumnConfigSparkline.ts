// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Configuration.Column {
    /**
     * Defines the configuration for Action Columns
     */
    export class ColumnConfigSparkline extends ColumnConfig {
        public cellTemplateType = DataGrid.Enum.CellTemplateType.Sparkline;
        public type: number;
        public markers: number;
        public label: string;
        public extendedClass: string;

        constructor(
            config: DataGrid.Types.IColumnConfigs,
            extraConfig: DataGrid.Types.ISparklineColumnExtraConfigs
        ) {
            super(config);

            this.type = extraConfig.type;
            this.markers = extraConfig.markers;
            this.label = extraConfig.label;
            this.extendedClass = extraConfig.extendedClass;
        }
    }
}
