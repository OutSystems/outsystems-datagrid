// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Feature {
	export interface IConditionalFormat {
		/**
		 * Adds new conditional format rules to the desired binding from the aggregate rows
		 *
		 * @param binding {string} => The column binding to add the new conditional format rules
		 * @param rules {Array<OSFramework.DataGrid.OSStructure.ConditionalFormat>} => Array containing the conditional format rules
		 */
		addAggregateRules(binding: string, rules: Array<OSFramework.DataGrid.OSStructure.ConditionalFormat>): void;

		/**
		 * Adds new conditional format rules to the desired binding.
		 *
		 * @param binding {string} => The column binding to add the new conditional format rules
		 * @param rules {Array<OSFramework.DataGrid.OSStructure.ConditionalFormat>} => Array containing the conditional format rules
		 * @param refresh (optional) => True if it should clear the classes previously added
		 */
		addRules(
			binding: string,
			rules: Array<OSFramework.DataGrid.OSStructure.ConditionalFormat>,
			refresh?: boolean
		): void;

		/**
		 * Removes rules of desired binding.
		 *
		 * @param binding {string} => The column binding to remove the conditional format rules
		 */
		removeRules(binding: string);
	}
}
