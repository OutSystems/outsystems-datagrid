// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Configuration.Column {
    /**
     * Defines the configuration for Calculated Columns
     */
    export class ColumnConfigAdditional extends ColumnConfig {
        public conditionalFormat: Array<OSStructure.ConditionalFormat>;
        public formula: OSStructure.Formula;

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        constructor(config: any, extraConfig: any) {
            super(config);
            this.conditionalFormat = extraConfig.conditionalFormat;
            this.formula = extraConfig.formula;
        }
    }
}
