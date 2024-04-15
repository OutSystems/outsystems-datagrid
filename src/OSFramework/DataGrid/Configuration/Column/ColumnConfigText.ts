// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Configuration.Column {
	/**
	 * Defines the configuration for Text Columns
	 */
	export class ColumnConfigText extends ColumnConfigConditionalFormat {
		/** The mask applied to the input box during edition
		 * This can't conflict with format property
		 */
		public mask: string;

		constructor(config: DataGrid.Types.IColumnConfigs, extra: DataGrid.Types.ITextColumnExtraConfigs) {
			super(config, extra);
		}

		public getProviderConfig(): DataGrid.Types.IColumnProviderConfigs {
			const config = super.getProviderConfig();

			//Mask and format can't have different values
			//Assuming a mask was defined, it should override format
			if (this.mask && this.mask !== this.format) {
				delete config.format;
			}

			return config;
		}
	}
}
