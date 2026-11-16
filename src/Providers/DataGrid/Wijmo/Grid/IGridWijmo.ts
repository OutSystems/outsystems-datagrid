// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Grid {
	export interface IGridWijmo extends OSFramework.DataGrid.Grid.IGridGeneric<wijmo.grid.FlexGrid> {
		/**
		 * Resolves the OSFramework column for a given Wijmo provider column, matching by the stable
		 * `name` identifier (which holds the OSFramework uniqueId), falling back to `binding`.
		 * @param providerColumn Wijmo column (e.g. from `s.getColumn(e.col)`).
		 * @returns Matching OSFramework column, or undefined when none matches or it is a Group column.
		 */
		getColumnByProvider(providerColumn: wijmo.grid.Column): OSFramework.DataGrid.Column.IColumn | undefined;
	}
}
