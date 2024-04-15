/// <reference path="./ColumnConfig.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Configuration.Column {
	/**
	 * Defines the configuration for Calculated Columns
	 */
	export class ColumnConfigConditionalFormat extends ColumnConfig {
		public conditionalFormat: Array<OSStructure.ConditionalFormat>;

		constructor(config: DataGrid.Types.IColumnConfigs, extraConfig: DataGrid.Types.ICommonExtraConfigs) {
			super(config);
			this.conditionalFormat = extraConfig.conditionalFormat;
		}
	}
}
