/// <reference path="../../Types/index.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Configuration.Column {
    /**
     * Defines the configuration for Action Columns
     */
    export class ColumnConfigImage extends ColumnConfigAction {
        public actionColumnElementType =
            DataGrid.Enum.CellTemplateElementType.Image;
        public altText: string;

        constructor(
            config: DataGrid.Types.IColumnConfigs,
            extraConfig: DataGrid.Types.IImageColumnExtraConfigs
        ) {
            super(config, extraConfig);
            this.altText = extraConfig.altText;
        }
    }
}
