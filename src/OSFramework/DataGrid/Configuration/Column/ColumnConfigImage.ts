/// <reference path="../../Types/index.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Configuration.Column {
	/**
	 * Defines the configuration for Action Columns
	 */
	export class ColumnConfigImage extends ColumnConfig {
		public actionColumnElementType = DataGrid.Enum.CellTemplateElementType.Image;
		public altText: string;

		constructor(config: DataGrid.Types.IColumnConfigs, extraConfig: DataGrid.Types.IImageColumnExtraConfigs) {
			super(config);
			this.altText = extraConfig.altText;
		}

		public getProviderConfig(): DataGrid.Types.IColumnProviderConfigs {
			const config = super.getProviderConfig();
			config.cssClassAll = 'has-image-or-button';

			return config;
		}
	}
}
