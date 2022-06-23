namespace OutSystems.GridAPI.Rows {
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
        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode: OSFramework.Enum.ErrorCodes.API_FailedAddClass,
            callback: () => {
                GridManager.GetGridById(gridID).features.rows.addClass(
                    rowNumber,
                    className,
                    true
                );
            }
        });

        PerformanceAPI.SetMark('Rows.AddClass-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.AddClass',
            'Rows.AddClass',
            'Rows.AddClass-end'
        );

        return result;
    }

    /**
     * Function that will add new rows to the grid
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @returns {*}  {string} Resulting code and message in JSON format
     */
    export function AddRows(gridID: string, numberOfRows = 1): string {
        PerformanceAPI.SetMark('Rows.AddRows');
        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode: OSFramework.Enum.ErrorCodes.API_FailedAddRow,
            callback: () => {
                GridManager.GetGridById(gridID).features.rows.addNewRows(
                    numberOfRows
                );
            }
        });

        PerformanceAPI.SetMark('Rows.AddRows-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.AddRows',
            'Rows.AddRows',
            'Rows.AddRows-end'
        );
        return result;
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
        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode: OSFramework.Enum.ErrorCodes.API_FailedGetRowData,
            callback: () => {
                return JSON.stringify(
                    GridManager.GetGridById(gridID).features.rows.getRowData(
                        rowNumber
                    )
                );
            },
            hasValue: true
        });

        PerformanceAPI.SetMark('Rows.GetRowData-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.GetRowData',
            'Rows.GetRowData',
            'Rows.GetRowData-end'
        );

        return result;
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
        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode: OSFramework.Enum.ErrorCodes.API_FailedGetRowNumberByKey,
            callback: () => {
                return JSON.stringify(
                    GridManager.GetGridById(
                        gridID
                    ).dataSource.getRowNumberByKey(key)
                );
            },
            hasValue: true
        });

        PerformanceAPI.SetMark('Rows.GetRowNumberByKey-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.GetRowNumberByKey',
            'Rows.GetRowNumberByKey',
            'Rows.GetRowNumberByKey-end'
        );

        return result;
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
        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode: OSFramework.Enum.ErrorCodes.API_FailedRemoveAllClasses,
            callback: () => {
                GridManager.GetGridById(gridID).features.rows.removeAllClasses(
                    rowNumber
                );
            }
        });

        PerformanceAPI.SetMark('Rows.RemoveAllClasses-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.RemoveAllClasses',
            'Rows.RemoveAllClasses',
            'Rows.RemoveAllClasses-end'
        );

        return result;
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
        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode: OSFramework.Enum.ErrorCodes.API_FailedRemoveClass,
            callback: () => {
                GridManager.GetGridById(gridID).features.rows.removeClass(
                    rowNumber,
                    className,
                    true
                );
            }
        });

        PerformanceAPI.SetMark('Rows.RemoveClass-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.RemoveClass',
            'Rows.RemoveClass',
            'Rows.RemoveClass-end'
        );
        return result;
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

        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode: OSFramework.Enum.ErrorCodes.API_FailedUpdateAddedRowKey,
            callback: () => {
                return JSON.stringify(
                    GridManager.GetGridById(
                        gridID
                    ).dataSource.updateAddedRowKey(currentRowId, newKey)
                );
            },
            hasValue: true
        });

        PerformanceAPI.SetMark('Rows.UpdateAddedRowKey-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.UpdateAddedRowKey',
            'Rows.UpdateAddedRowKey',
            'Rows.UpdateAddedRowKey-end'
        );

        return result;
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

        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode:
                OSFramework.Enum.ErrorCodes.API_FailedUpdateStartingRowHeader,
            callback: () => {
                GridManager.GetGridById(
                    gridID
                ).features.autoRowNumber.setStartIndex(startIndex);
            }
        });

        PerformanceAPI.SetMark('Rows.UpdateStartingRowHeader-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.UpdateStartingRowHeader',
            'Rows.UpdateStartingRowHeader',
            'Rows.UpdateStartingRowHeader-end'
        );

        return result;
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
        PerformanceAPI.SetMark('Rows.SetValidationStatusByKey');
        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode:
                OSFramework.Enum.ErrorCodes.API_FailedSetValidationStatusByKey,
            callback: () => {
                GridManager.GetGridById(
                    gridID
                ).features.validationMark.setCellStatusByKey(
                    rowKey,
                    columnID,
                    isValid,
                    errorMessage
                );
            }
        });

        PerformanceAPI.SetMark('Rows.SetValidationStatusByKey-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.SetValidationStatusByKey',
            'Rows.SetValidationStatusByKey',
            'Rows.SetValidationStatusByKey-end'
        );
        return result;
    }

    /**
     * Function that toggle row dragging.
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {boolean} allowRowDragging Allow the rows to be dragged.
     */
    export function ToggleRowDragging(
        gridID: string,
        allowRowDragging: boolean
    ): string {
        PerformanceAPI.SetMark('Rows.ToggleRowDragging');

        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode: OSFramework.Enum.ErrorCodes.API_FailedToggleRowDragging,
            callback: () => {
                GridManager.GetGridById(
                    gridID
                ).features.gridReorder.toggleRowDragging(allowRowDragging);
            }
        });

        PerformanceAPI.SetMark('Rows.ToggleRowDragging-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Rows.ToggleRowDragging',
            'Rows.ToggleRowDragging',
            'Rows.ToggleRowDragging-end'
        );

        return result;
    }
}

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
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.Rows.AddClass()'`
        );
        return OutSystems.GridAPI.Rows.AddClass(gridID, rowNumber, className);
    }

    /**
     * Function that will add new rows to the grid
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @returns {*}  {string} Resulting code and message in JSON format
     */
    export function AddRows(gridID: string, numberOfRows = 1): string {
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.Rows.AddRows()'`
        );
        return OutSystems.GridAPI.Rows.AddRows(gridID, numberOfRows);
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
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.Rows.GetRowData()'`
        );
        return OutSystems.GridAPI.Rows.GetRowData(gridID, rowNumber);
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
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.Rows.GetRowNumberByKey()'`
        );
        return OutSystems.GridAPI.Rows.GetRowNumberByKey(gridID, key);
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
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.Rows.RemoveAllClasses()'`
        );
        return OutSystems.GridAPI.Rows.RemoveAllClasses(gridID, rowNumber);
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
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.Rows.RemoveClass()'`
        );
        return OutSystems.GridAPI.Rows.RemoveClass(
            gridID,
            rowNumber,
            className
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
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.Rows.RemoveRows()'`
        );
        return OutSystems.GridAPI.Rows.RemoveRows(gridID);
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
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.Rows.UpdateAddedRowKey()'`
        );
        return OutSystems.GridAPI.Rows.UpdateAddedRowKey(
            gridID,
            currentRowId,
            newKey
        );
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
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.Rows.UpdateStartingRowHeader()'`
        );
        return OutSystems.GridAPI.Rows.UpdateStartingRowHeader(
            gridID,
            startIndex
        );
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
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.Rows.SetValidationStatusByKey()'`
        );
        return OutSystems.GridAPI.Rows.SetValidationStatusByKey(
            gridID,
            rowKey,
            columnID,
            isValid,
            errorMessage
        );
    }

    /**
     * Function that toggle row dragging.
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {boolean} allowRowDragging Allow the rows to be dragged.
     */
    export function ToggleRowDragging(
        gridID: string,
        allowRowDragging: boolean
    ): string {
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.Rows.ToggleRowDragging()'`
        );
        return OutSystems.GridAPI.Rows.ToggleRowDragging(
            gridID,
            allowRowDragging
        );
    }
}
