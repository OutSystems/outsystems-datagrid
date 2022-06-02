// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    /**
     * Exposed methods for manipulating rows
     */
    export interface IRows {
        /**
         * Add a CSS class to a specific row from the grid, refreshing or not the grid
         */
        addClass(
            rowNumber: number,
            className: string,
            refresh?: boolean,
            binding?: string
        );
        /**
         * Add new rows to the grid. If there is a selection it will add as many rows as selected. If not, it will add a row at the top.
         */
        addNewRows(rowsAmount: number): void;
        /**
         * Clears all the metadata associated to the cssClasses from the row
         */
        clear(): void;
        getMetadata(rowNumber: number): Feature.Auxiliar.RowStyleInfo;
        /**
         * Get data from a specific row.
         */
        getRowData(rowNumber: number): string;
        /**
         * Clear all classes from a specific row.
         */
        removeAllClasses(rowNumber: number): void;
        /**
         * Remove a single class from a specific row, refreshing or not the grid
         */
        removeClass(
            rowNumber: number,
            className: string,
            refresh?: boolean,
            binding?: string
        );
        /**
         * Remove the rows that are selected.
         */
        removeSelectedRows(): void;
    }
}
