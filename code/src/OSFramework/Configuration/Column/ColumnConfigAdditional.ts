namespace OSFramework.Configuration.Column {
    /**
     * Defines the configuration for Calculated Columns
     */
    export class ColumnConfigAdditional extends ColumnConfig {
        public formula: OSFramework.OSStructure.Formula;

        constructor(config: any, extraConfig: any) {
            super(config);
            this.formula = extraConfig.formula;
        }
    }
}
