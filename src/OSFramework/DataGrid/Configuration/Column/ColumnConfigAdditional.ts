/// <reference path="./ColumnConfigConditionalFormat.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Configuration.Column {
    /**
     * Defines the configuration for Calculated Columns
     */
    export class ColumnConfigAdditional extends ColumnConfigConditionalFormat {
        public formula: OSStructure.Formula;

        constructor(
            config: DataGrid.Types.IColumnConfigs,
            extraConfig: DataGrid.Types.ICalculatedColumnExtraConfigs
        ) {
            super(config, extraConfig);
            this.formula = extraConfig.formula;
        }
    }
}
