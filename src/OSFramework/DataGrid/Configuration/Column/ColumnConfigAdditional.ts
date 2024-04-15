/// <reference path="./ColumnConfigConditionalFormat.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Configuration.Column {
	/**
	 * Defines the configuration for Calculated Columns
	 */
	export class ColumnConfigAdditional extends ColumnConfigConditionalFormat {
		public decimalPlaces: number;
		public formula: OSStructure.Formula;
		public hasThousandSeparator: boolean;

		constructor(config: DataGrid.Types.IColumnConfigs, extraConfig: DataGrid.Types.ICalculatedColumnExtraConfigs) {
			super(config, extraConfig);
			this.decimalPlaces = extraConfig.decimalPlaces;
			this.formula = extraConfig.formula;
			this.hasThousandSeparator = extraConfig.hasThousandSeparator;
		}
	}
}
