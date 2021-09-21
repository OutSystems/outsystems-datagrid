// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    export interface IGroupPanel extends Interface.IValidation, IView {
        /** Boolean that indicates whether the grid is grouped or not */
        isGridGrouped: boolean;
        /**
         * Check if the column is inside the Group Panel
         * @param binding binding of the column
         */
        columnInGroupPanel(binding: string): boolean;
        /**
         * Sets the column aggregation function inside the Group Panel
         * @param binding binding of the column
         * @param aggregate aggregation function
         */
        setAggregate(binding: string, aggregate: wijmo.Aggregate): void;
    }
}
