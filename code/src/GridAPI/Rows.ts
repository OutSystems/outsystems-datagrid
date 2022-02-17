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
    ): string {
        PerformanceAPI.SetMark('Rows.AddClass');
        const responseObj = {
            isSuccess: true,
            message: OSFramework.Enum.ErrorMessages.SuccessMessage,
            code: OSFramework.Enum.ErrorCodes.GRID_SUCCESS
        };

        if (!OSFramework.Helper.IsGridReady(gridID)) {
            responseObj.isSuccess = false;
            responseObj.message = OSFramework.Enum.ErrorMessages.Grid_NotFound;
            responseObj.code = OSFramework.Enum.ErrorCodes.CFG_GridNotFound;
            return JSON.stringify(responseObj);
        }
        try {
            GridManager.GetGridById(gridID).features.rows.addClass(
                rowNumber,
                className,
                true
            );
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code = OSFramework.Enum.ErrorCodes.API_FailedAddClass;
        }

        PerformanceAPI.SetMark('Rows.AddClass-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.AddClass',
            'Rows.AddClass',
            'Rows.AddClass-end'
        );

        return JSON.stringify(responseObj);
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
        const responseObj = {
            isSuccess: true,
            message: OSFramework.Enum.ErrorMessages.SuccessMessage,
            code: OSFramework.Enum.ErrorCodes.GRID_SUCCESS
        };

        if (!OSFramework.Helper.IsGridReady(gridID)) {
            responseObj.isSuccess = false;
            responseObj.message = OSFramework.Enum.ErrorMessages.Grid_NotFound;
            responseObj.code = OSFramework.Enum.ErrorCodes.CFG_GridNotFound;
            return JSON.stringify(responseObj);
        }

        try {
            GridManager.GetGridById(gridID).features.rows.addNewRows();
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code = OSFramework.Enum.ErrorCodes.API_FailedAddRow;
        }

        PerformanceAPI.SetMark('Rows.AddRows-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.AddRows',
            'Rows.AddRows',
            'Rows.AddRows-end'
        );
        return JSON.stringify(responseObj);
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

        const responseObj = {
            isSuccess: true,
            message: OSFramework.Enum.ErrorMessages.SuccessMessage,
            code: OSFramework.Enum.ErrorCodes.GRID_SUCCESS,
            value: ''
        };

        if (!OSFramework.Helper.IsGridReady(gridID)) {
            responseObj.isSuccess = false;
            responseObj.message = OSFramework.Enum.ErrorMessages.Grid_NotFound;
            responseObj.code = OSFramework.Enum.ErrorCodes.CFG_GridNotFound;
            return JSON.stringify(responseObj);
        }
        try {
            responseObj.value = JSON.stringify(
                GridManager.GetGridById(gridID).features.rows.getRowData(
                    rowNumber
                )
            );
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code = OSFramework.Enum.ErrorCodes.API_FailedGetRowData;
        }

        PerformanceAPI.SetMark('Rows.GetRowData-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.GetRowData',
            'Rows.GetRowData',
            'Rows.GetRowData-end'
        );

        return JSON.stringify(responseObj);
    }

    /**
     * Function that will get row number
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {string} key Text set on keyBinding.
     * @returns {*}  {string} Resulting code and message in JSON format
     */
    export function GetRowNumberByKey(gridID: string, key: string): string {
        PerformanceAPI.SetMark('Rows.GetRowNumberByKey');

        const responseObj = {
            isSuccess: true,
            message: OSFramework.Enum.ErrorMessages.SuccessMessage,
            code: OSFramework.Enum.ErrorCodes.GRID_SUCCESS,
            value: ''
        };

        if (!OSFramework.Helper.IsGridReady(gridID)) {
            responseObj.isSuccess = false;
            responseObj.message = OSFramework.Enum.ErrorMessages.Grid_NotFound;
            responseObj.code = OSFramework.Enum.ErrorCodes.CFG_GridNotFound;
            return JSON.stringify(responseObj);
        }
        try {
            responseObj.value = JSON.stringify(
                GridManager.GetGridById(gridID).dataSource.getRowNumberByKey(
                    key
                )
            );
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedGetRowNumberByKey;
        }

        PerformanceAPI.SetMark('Rows.GetRowNumberByKey-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.GetRowNumberByKey',
            'Rows.GetRowNumberByKey',
            'Rows.GetRowNumberByKey-end'
        );

        return JSON.stringify(responseObj);
    }

    /**
     * Remove all CSS classes from a specific row on the grid.
     *
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {number} rowNumber Number of the row in which all CSS classes are going to be removed.
     */
    export function RemoveAllClasses(
        gridID: string,
        rowNumber: number
    ): string {
        PerformanceAPI.SetMark('Rows.RemoveAllClasses');
        const responseObj = {
            isSuccess: true,
            message: OSFramework.Enum.ErrorMessages.SuccessMessage,
            code: OSFramework.Enum.ErrorCodes.GRID_SUCCESS
        };

        if (!OSFramework.Helper.IsGridReady(gridID)) {
            responseObj.isSuccess = false;
            responseObj.message = OSFramework.Enum.ErrorMessages.Grid_NotFound;
            responseObj.code = OSFramework.Enum.ErrorCodes.CFG_GridNotFound;
            return JSON.stringify(responseObj);
        }

        try {
            const grid = GridManager.GetGridById(gridID);
            grid.features.rows.removeAllClasses(rowNumber);
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedRemoveAllClasses;
        }

        PerformanceAPI.SetMark('Rows.RemoveAllClasses-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.RemoveAllClasses',
            'Rows.RemoveAllClasses',
            'Rows.RemoveAllClasses-end'
        );

        return JSON.stringify(responseObj);
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
    ): string {
        PerformanceAPI.SetMark('Rows.RemoveClass');
        const responseObj = {
            isSuccess: true,
            message: OSFramework.Enum.ErrorMessages.SuccessMessage,
            code: OSFramework.Enum.ErrorCodes.GRID_SUCCESS
        };

        if (!OSFramework.Helper.IsGridReady(gridID)) {
            responseObj.isSuccess = false;
            responseObj.message = OSFramework.Enum.ErrorMessages.Grid_NotFound;
            responseObj.code = OSFramework.Enum.ErrorCodes.CFG_GridNotFound;
            return JSON.stringify(responseObj);
        }

        try {
            GridManager.GetGridById(gridID).features.rows.removeClass(
                rowNumber,
                className,
                true
            );
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedRemoveClass;
        }

        PerformanceAPI.SetMark('Rows.RemoveClass-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.RemoveClass',
            'Rows.RemoveClass',
            'Rows.RemoveClass-end'
        );

        return JSON.stringify(responseObj);
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
     * Function that will ipdate the key binding of an added line on a given grid. The id of the row with the CurrentRowId will be updated with the NewKey value.
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {number} startIndex New row start index.
     */
    export function UpdateAddedRowKey(
        gridID: string,
        currentRowId: string,
        newKey: string
    ): string {
        PerformanceAPI.SetMark('Rows.UpdateAddedRowKey');

        const responseObj = {
            isSuccess: true,
            message: OSFramework.Enum.ErrorMessages.SuccessMessage,
            code: OSFramework.Enum.ErrorCodes.GRID_SUCCESS,
            value: ''
        };

        if (!OSFramework.Helper.IsGridReady(gridID)) {
            responseObj.isSuccess = false;
            responseObj.message = OSFramework.Enum.ErrorMessages.Grid_NotFound;
            responseObj.code = OSFramework.Enum.ErrorCodes.CFG_GridNotFound;
            return JSON.stringify(responseObj);
        }
        try {
            responseObj.value = JSON.stringify(
                GridManager.GetGridById(gridID).dataSource.updateAddedRowKey(
                    currentRowId,
                    newKey
                )
            );
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedUpdateAddedRowKey;
        }

        PerformanceAPI.SetMark('Rows.UpdateAddedRowKey-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.UpdateAddedRowKey',
            'Rows.UpdateAddedRowKey',
            'Rows.UpdateAddedRowKey-end'
        );

        return JSON.stringify(responseObj);
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
    ): string {
        PerformanceAPI.SetMark('Rows.UpdateStartingRowHeader');

        const responseObj = {
            isSuccess: true,
            message: OSFramework.Enum.ErrorMessages.SuccessMessage,
            code: OSFramework.Enum.ErrorCodes.GRID_SUCCESS
        };

        if (!OSFramework.Helper.IsGridReady(gridID)) {
            responseObj.isSuccess = false;
            responseObj.message = OSFramework.Enum.ErrorMessages.Grid_NotFound;
            responseObj.code = OSFramework.Enum.ErrorCodes.CFG_GridNotFound;
            return JSON.stringify(responseObj);
        }

        try {
            GridManager.GetGridById(
                gridID
            ).features.autoRowNumber.setStartIndex(startIndex);
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedUpdateStartingRowHeader;
        }

        PerformanceAPI.SetMark('Rows.UpdateStartingRowHeader-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.UpdateStartingRowHeader',
            'Rows.UpdateStartingRowHeader',
            'Rows.UpdateStartingRowHeader-end'
        );

        return JSON.stringify(responseObj);
    }

    /**
     * Function that will set the row validation using the key
     *
     * @export
     *
     * @param {string} gridID ID of the Grid.
     * @param {string} rowKey Key of the row that contains the cell to be validated.
     * @param {string} columnID ID of the Column block in which the action of validation should be triggered.
     * @param {boolean} isValid State to which the cell should get validated (valid/invalid).
     * @param {string} errorMessage Message that the cell should show on a tooltip in case of an invalid state.
     */
    export function SetValidationStatusByKey(
        gridID: string,
        rowKey: string,
        columnID: string,
        isValid: boolean,
        errorMessage: string
    ): string {
        const responseObj = {
            isSuccess: true,
            message: OSFramework.Enum.ErrorMessages.SuccessMessage,
            code: OSFramework.Enum.ErrorCodes.GRID_SUCCESS
        };

        if (!OSFramework.Helper.IsGridReady(gridID)) {
            responseObj.isSuccess = false;
            responseObj.message = OSFramework.Enum.ErrorMessages.Grid_NotFound;
            responseObj.code = OSFramework.Enum.ErrorCodes.CFG_GridNotFound;
            return JSON.stringify(responseObj);
        }

        try {
            GridManager.GetGridById(
                gridID
            ).features.validationMark.setCellStatusByKey(
                rowKey,
                columnID,
                isValid,
                errorMessage
            );
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedSetValidationStatusByKey;
        }

        return JSON.stringify(responseObj);
    }
}
