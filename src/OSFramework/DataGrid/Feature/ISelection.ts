// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    /**
     * Exposed methods of a selection feature
     */
    export interface ISelection extends Interface.IProviderConfig<number> {
        /**
         * Checks if row Selectors are enabled
         */
        hasSelectors: boolean;

        /**
         * Clear all selections
         */
        clear(): void;
        /**
         * Verify if a given range/cell is contained inside same of the grid selections
         * @param rng Starting row Index (top column), or provider CellRange
         * @param col1 Starting col (left column)
         * @param row2 Ending row (bottm row)
         * @param col2 Ending column (right column)
         */
        contains(
            rng: unknown | number,
            col1?: number,
            row2?: number,
            col2?: number
        ): boolean;
        /**
         * Makes all grid selections have the same structure (columns)
         * @returns A array containing what is selected, ordered by
         * @example Excel/Google spreadsheet don't accepts copying data in different structures, to avoid errors we decided to transform selections, getting the left-most column, and the right-most column and apply the same structure to all the selected ranges
         */
        equalizeSelection(): OSStructure.CellRange[];

        /**
         * Return Grid's active cell
         */
        getActiveCell(): OSStructure.CellRange;

        /**
         * Returns all selections (rows and ranges)
         */
        getAllSelections(): OSStructure.ReturnMessage;
        /**
         * Returns the Data of the selections
         */
        getAllSelectionsData(): OSStructure.ReturnMessage;

        /**
         * Returns the Data of the checked rows
         */
        getCheckedRowsData(): OSStructure.ReturnMessage;

        /**
         * Returns the Indexes of the selected rows
         */
        getSelectedRows(): number[];
        /**
         * Returns how many rows are selected by row number or checkbox selection
         */
        getSelectedRowsCount(): OSStructure.ReturnMessage;
        /**
         * Returns how many rows are selected by cell range selection
         */
        getSelectedRowsCountByCellRange(): number;
        /**
         * Returns the Data of the selected rows
         */
        getSelectedRowsData(): OSStructure.ReturnMessage;

        /**
         * Checks if there is any checked row on the grid
         */
        hasCheckedRows(): boolean;

        /**
         * Checks if there is a row selected on the grid
         */
        hasSelectedRows(): OSStructure.ReturnMessage;

        /**
         * Checks if there is anything selected in the grid
         */
        hasValidSelection(): boolean;

        /**
         * Select and focus the first cell from a specific row. If the rowIndex is not specified, then selects and focus first cell from first row.
         * @param rowIndex index of the row where the first cell should be selected. If empty, the default value is the first row.
         */
        selectAndFocusFirstCell(rowIndex?: number): void;
    }
}
