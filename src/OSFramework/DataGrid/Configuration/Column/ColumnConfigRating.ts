// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Configuration.Column {
    /**
     * Defines the configuration for Action Columns
     */
    export class ColumnConfigRating extends ColumnConfig {
        public cellTemplateType = DataGrid.Enum.CellTemplateType.Rating;
        public extendedClass: string;
        public label: string;
        public maxRating: number;

        constructor(
            config: DataGrid.Types.IColumnConfigs,
            extraConfig: DataGrid.Types.IRatingColumnExtraConfigs
        ) {
            super(config);
            this.label = extraConfig.label;
            this.maxRating = extraConfig.maxRating;
            this.extendedClass = extraConfig.extendedClass;
        }
    }
}
