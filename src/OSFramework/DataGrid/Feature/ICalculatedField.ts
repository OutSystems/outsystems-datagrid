// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Feature {
	export interface ICalculatedField {
		// eslint-disable-next-line @typescript-eslint/ban-types
		calculatedFields: {};
		/**
		 * Adds new calculated field formula the desired binding.
		 */
		addFormula(binding: string, header: string, rules: OSFramework.DataGrid.OSStructure.Formula): void;

		/**
		 * Removes rules of desired binding.
		 */
		removeFormula(binding: string);
	}
}
