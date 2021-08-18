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
        PerformanceAPI.SetMark('Rows.AddClass');

        const grid = GridManager.GetGridById(gridID);

        if (grid !== undefined) {
            grid.features.rows.addClass(rowNumber, className, true);
        }
        PerformanceAPI.SetMark('Rows.AddClass-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.AddClass',
            'Rows.AddClass',
            'Rows.AddClass-end'
        );
    }

    /**
     * Function that will add new rows to the grid
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @returns {*}  {string} Resulting code and message in JSON format
     */
    export function AddRows(gridID: string): string {
        PerformanceAPI.SetMark('Rows.AddRows');

        const grid = GridManager.GetGridById(gridID);
        let output = '';

        if (grid !== undefined) {
            output = JSON.stringify(grid.features.rows.addNewRows());
        }

        PerformanceAPI.SetMark('Rows.AddRows-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.AddRows',
            'Rows.AddRows',
            'Rows.AddRows-end'
        );
        return output;
    }

    /**
     * Function that will get data from a specific row
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {number} rowNumber Number of the row in data will be retrieved.
     * @returns {*}  {string} Resulting code and message in JSON format
     */
    export function GetRowData(gridID: string, rowNumber: number): string {
        PerformanceAPI.SetMark('Rows.GetRowData');

        const grid = GridManager.GetGridById(gridID);
        let output = '';

        if (grid !== undefined) {
            output = JSON.stringify(grid.features.rows.getRowData(rowNumber));
        }

        PerformanceAPI.SetMark('Rows.GetRowData-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.GetRowData',
            'Rows.GetRowData',
            'Rows.GetRowData-end'
        );
        return output;
    }

    /**
     * Remove all CSS classes from a specific row on the grid.
     *
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {number} rowNumber Number of the row in which all CSS classes are going to be removed.
     */
    export function RemoveAllClasses(gridID: string, rowNumber: number): void {
        PerformanceAPI.SetMark('Rows.RemoveAllClasses');

        const grid = GridManager.GetGridById(gridID);

        if (grid !== undefined) {
            grid.features.rows.removeAllClasses(rowNumber);
        }
        PerformanceAPI.SetMark('Rows.RemoveAllClasses-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.RemoveAllClasses',
            'Rows.RemoveAllClasses',
            'Rows.RemoveAllClasses-end'
        );
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
        PerformanceAPI.SetMark('Rows.RemoveClass');

        const grid = GridManager.GetGridById(gridID);

        if (grid !== undefined) {
            grid.features.rows.removeClass(rowNumber, className, true);
        }
        PerformanceAPI.SetMark('Rows.RemoveClass-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.RemoveClass',
            'Rows.RemoveClass',
            'Rows.RemoveClass-end'
        );
    }

    /**
     * Function that will remove the selected rows from the grid.
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @returns {*}  {string} Resulting code and message in JSON format
     */
    export function RemoveRows(gridID: string): string {
        PerformanceAPI.SetMark('Rows.RemoveRows');

        const grid = GridManager.GetGridById(gridID);
        let output = '';

        if (grid !== undefined) {
            output = JSON.stringify(grid.features.rows.removeSelectedRows());
        }

        PerformanceAPI.SetMark('Rows.RemoveRows-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.RemoveRows',
            'Rows.RemoveRows',
            'Rows.RemoveRows-end'
        );
        return output;
    }

    /**
     * Function that will set start index of row.
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {number} startIndex New row start index.
     */
    export function UpdateStartingRowHeader(
        gridID: string,
        startIndex: number
    ): void {
        PerformanceAPI.SetMark('Rows.UpdateStartingRowHeader');
        const grid = GridManager.GetGridById(gridID);

        if (grid !== undefined) {
            grid.features.autoRowNumber.setStartIndex(startIndex);
        }

        PerformanceAPI.SetMark('Rows.UpdateStartingRowHeader-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.UpdateStartingRowHeader',
            'Rows.UpdateStartingRowHeader',
            'Rows.UpdateStartingRowHeader-end'
        );
    }
}
