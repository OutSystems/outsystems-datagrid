// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Features {
    /**
     * Exposed methods for manipulating rows
     */
    export interface IRows {
        /**
         * Add a CSS class to a specific row from the grid.
         */
        addClass(rowNumber: number, className: string);
        /**
         * Add new rows to the grid. If there is a selection it will add as many rows as selected. If not, it will add a row at the top.
         */
        addNewRows(): void;
        /**
         * Clears all the metadata associated to the cssClasses from the row
         */
        clear(): void;
        /**
         * Clear all classes from a specific row.
         */
        removeAllClasses(rowNumber: number): void;
        /**
         * Remove a single class from a specific row.
         */
        removeClass(rowNumber: number, className: string);
        /**
         * Remove the rows that are selected.
         */
        removeSelectedRows(): void;
        /**
         * Set the private newItem to be used when a new row is added.
         */
        setNewItem(item: unknown): void;
    }}