// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Feature {
	export interface IGroupPanel extends Interface.IValidation, IView {
		/** Boolean that indicates whether the grid is grouped or not */
		isGridGrouped: boolean;
		/**
		 * Add a given column or columns list to the grid group panel
		 * @param binding binding of the column
		 */
		addColumnsToGroupPanel(binding: string): void;
		/**
		 * Check if the column is inside the Group Panel
		 * @param binding binding of the column
		 */
		columnInGroupPanel(binding: string): boolean;
		/**
		 * Remove a given column or columns list from the grid group panel
		 * @param binding binding of the column
		 */
		removeColumnsFromGroupPanel(binding: string): void;
		/**
		 * Sets the column aggregation function inside the Group Panel
		 * @param binding binding of the column
		 * @param aggregate aggregation function
		 */
		setAggregate(binding: string, aggregate: number): void;
	}
}
