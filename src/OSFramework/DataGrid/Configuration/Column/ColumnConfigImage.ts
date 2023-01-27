// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Configuration.Column {
    /**
     * Defines the configuration for Action Columns
     */
    export class ColumnConfigImage extends ColumnConfig {
        public cellTemplateType = DataGrid.Enum.CellTemplateType.Image;
        public extendedClass: string;
        public url = '';

        constructor(
            config: DataGrid.Types.IColumnConfigs,
            extraConfig: DataGrid.Types.IImageColumnExtraConfigs
        ) {
            super(config);
            this.extendedClass = extraConfig.extendedClass;
        }
    }
}
