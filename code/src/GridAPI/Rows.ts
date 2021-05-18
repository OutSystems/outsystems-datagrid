/**
 * Namespace responsible for all API methods associated to the rows of the Data Grid.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.Rows {
    /**
     * Functon that will add a CSS class to a specific row from the grid.
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {number} rowNumber Number of the row in which the class is going to be added.
     * @param {string} className CSS class to add to the row.
     */
    export function AddClass(
        gridID: string,
        rowNumber: number,
        className: string
    ): void {
        const grid = GridManager.GetGridById(gridID);

        if (grid !== undefined) {
            grid.features.rows.addClass(rowNumber, className, true);
        }
    }

    /**
     * Function that will add new rows to the grid
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @returns {*}  {string} Resulting code and message in JSON format
     */
    export function AddRows(gridID: string): string {
        const grid = GridManager.GetGridById(gridID);
        let output = '';

        if (grid !== undefined) {
            output = JSON.stringify(grid.features.rows.addNewRows());
        }

        return output;
    }

    /**
     * Remove all CSS classes from a specific row on the grid.
     *
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {number} rowNumber Number of the row in which all CSS classes are going to be removed.
     */
    export function RemoveAllClasses(gridID: string, rowNumber: number): void {
        const grid = GridManager.GetGridById(gridID);

        if (grid !== undefined) {
            grid.features.rows.removeAllClasses(rowNumber);
        }
    }

    /**
     * Remove a CSS class from a specific row on the grid.
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {number} rowNumber Number of the row in which the class is going to be removed.
     * @param {string} className CSS class to remove from the row.
     */
    export function RemoveClass(
        gridID: string,
        rowNumber: number,
        className: string
    ): void {
        const grid = GridManager.GetGridById(gridID);

        if (grid !== undefined) {
            grid.features.rows.removeClass(rowNumber, className, true);
        }
    }

    /**
     * Function that will remove the selected rows from the grid.
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @returns {*}  {string} Resulting code and message in JSON format
     */
    export function RemoveRows(gridID: string): string {
        const grid = GridManager.GetGridById(gridID);
        let output = '';

        if (grid !== undefined) {
            output = JSON.stringify(grid.features.rows.removeSelectedRows());
        }

        return output;
    }
}
