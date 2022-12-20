namespace OutSystems.GridAPI.Cells {
    /**
     * Responsible for defining a specific cell as valid/invalid and showing an error message to the user when the content of that same cell is invalid.
     *
     * @export
     * @param {string} gridID ID of the Grid.
     * @param {number} rowIndex Index of the row that contains the cell to be validated.
     * @param {string} columnID ID of the Column block in which the action of validation should be triggered.
     * @param {boolean} isValid State to which the cell should get validated (valid/invalid).
     * @param {string} errorMessage Message that the cell should show on a tooltip in case of an invalid state.
     */
    export function SetValidationStatus(
        gridID: string,
        rowIndex: number,
        columnID: string,
        isValid: boolean,
        errorMessage: string
    ): string {
        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode:
                OSFramework.DataGrid.Enum.ErrorCodes
                    .API_FailedSetValidationStatus,
            callback: () => {
                GridManager.GetGridById(
                    gridID
                ).features.validationMark.setCellStatus(
                    rowIndex,
                    columnID,
                    isValid,
                    errorMessage
                );
            }
        });

        Performance.SetMark('Cells.setValidationStatus');
        Performance.SetMark('Cells.setValidationStatus-end');
        Performance.GetMeasure(
            '@datagrid-Cells.setValidationStatus',
            'Cells.setValidationStatus',
            'Cells.setValidationStatus-end'
        );

        return result;
    }

    /**
     * Responsible for running the actions that are in charge of the validation for a cell.
     *
     * @param {string} gridID ID of the Grid.
     * @param {number} rowIndex Index of the row that contains the cells to be validated.
     * @param {string} columnID ID of the Column block in which the action of validation should be triggered.
     * @param {boolean} [triggerOnCellValueChange=true] Boolean that represents if we want to trigger the on value change event or not
     */
    export function ValidateCell(
        gridID: string,
        rowIndex: number,
        columnID: string,
        triggerOnCellValueChange = true
    ): void {
        Performance.SetMark('Cells.validateCell');

        const grid = GridManager.GetGridById(gridID);
        const column = grid.getColumn(columnID);
        if (column === undefined) return;
        grid.features.validationMark.validateCell(
            rowIndex,
            column,
            triggerOnCellValueChange
        );
        Performance.SetMark('Cells.validateCell-end');
        Performance.GetMeasure(
            '@datagrid-Cells.validateCell',
            'Cells.validateCell',
            'Cells.validateCell-end'
        );
    }

    /**
     * Responsible for running the actions that are in charge of the validation per each column.
     * Those actions might be included in the OnCellValueChange handler or in case the isMandatory column configuration is set.
     *
     * @param {string} gridID ID of the Grid.
     * @param {number} rowIndex Index of the row that contains the cells to be validated.
     */
    export function ValidateRow(gridID: string, rowIndex: number): string {
        Performance.SetMark('Cells.validateRow');

        let output = '';

        output = JSON.stringify(
            GridManager.GetGridById(gridID).features.validationMark.validateRow(
                rowIndex
            )
        );

        Performance.SetMark('Cells.validateRow-end');
        Performance.GetMeasure(
            '@datagrid-Cells.validateRow',
            'Cells.validateRow',
            'Cells.validateRow-end'
        );

        return output;
    }
    /**
     * Responsible for updating a specific cell -
     * This is needed in a case we wnat to update another column cell, for example when a cell content is denpendent on another.
     *
     * @param {string} gridID ID of the Grid.
     * @param {number} rowIndex Index of the row that contains the cells to be validated.
     * @param {string} columnID ID of the Column block in which the cell should be updated.
     * @param {*} value New value to settled on the cell.
     * @param {boolean} [showDirtyMark=true] Boolean that represents if the action should also show a dirty mark.
     * @param {boolean} [triggerOnCellValueChange=true] Boolean that represents if we want to trigger the on value change event or not
     */
    export function SetCellData(
        gridID: string,
        rowIndex: number,
        columnID: string,
        // eslint-disable-next-line
        value: any,
        showDirtyMark = true,
        triggerOnCellValueChange = true
    ): string {
        const responseObj = {
            isSuccess: true,
            message: OSFramework.DataGrid.Enum.ErrorMessages.SuccessMessage,
            code: OSFramework.DataGrid.Enum.ErrorCodes.GRID_SUCCESS
        };

        Performance.SetMark('Cells.setCellData');
        if (!OSFramework.DataGrid.Helper.IsGridReady(gridID)) {
            responseObj.isSuccess = false;
            responseObj.message =
                OSFramework.DataGrid.Enum.ErrorMessages.Grid_NotFound;
            responseObj.code =
                OSFramework.DataGrid.Enum.ErrorCodes.CFG_GridNotFound;
            return JSON.stringify(responseObj);
        }

        const grid = GridManager.GetGridById(gridID);
        const column = grid.getColumn(columnID);

        if (column === undefined) {
            responseObj.isSuccess = false;
            responseObj.message =
                OSFramework.DataGrid.Enum.ErrorMessages.Column_NotFound;
            responseObj.code =
                OSFramework.DataGrid.Enum.ErrorCodes.CFG_ColumnNotFound;
            return JSON.stringify(responseObj);
        }

        try {
            if (showDirtyMark) {
                grid.features.dirtyMark.saveOriginalValue(
                    rowIndex,
                    column.providerIndex
                );
            }
            grid.features.cellData.setCellData(rowIndex, column, value);
            grid.features.validationMark.validateCell(
                rowIndex,
                column,
                triggerOnCellValueChange
            );
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.DataGrid.Enum.ErrorCodes.API_FailedSetCellData;
        }

        Performance.SetMark('Cells.setCellData-end');
        Performance.GetMeasure(
            '@datagrid-Cells.setCellData',
            'Cells.setCellData',
            'Cells.setCellData-end'
        );
        return JSON.stringify(responseObj);
    }
}

/**
 * Namespace responsible for all API methods associated to the cells of the Data Grid.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.Cells {
    /**
     * Responsible for defining a specific cell as valid/invalid and showing an error message to the user when the content of that same cell is invalid.
     *
     * @export
     * @param {string} gridID ID of the Grid.
     * @param {number} rowIndex Index of the row that contains the cell to be validated.
     * @param {string} columnID ID of the Column block in which the action of validation should be triggered.
     * @param {boolean} isValid State to which the cell should get validated (valid/invalid).
     * @param {string} errorMessage Message that the cell should show on a tooltip in case of an invalid state.
     */
    export function SetValidationStatus(
        gridID: string,
        rowIndex: number,
        columnID: string,
        isValid: boolean,
        errorMessage: string
    ): string {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Cells.SetValidationStatus()'`
        );
        return OutSystems.GridAPI.Cells.SetValidationStatus(
            gridID,
            rowIndex,
            columnID,
            isValid,
            errorMessage
        );
    }

    /**
     * Responsible for running the actions that are in charge of the validation for a cell.
     *
     * @param {string} gridID ID of the Grid.
     * @param {number} rowIndex Index of the row that contains the cells to be validated.
     * @param {string} columnID ID of the Column block in which the action of validation should be triggered.
     * @param {boolean} [triggerOnCellValueChange=true] Boolean that represents if we want to trigger the on value change event or not
     */
    export function ValidateCell(
        gridID: string,
        rowIndex: number,
        columnID: string,
        triggerOnCellValueChange = true
    ): void {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Cells.ValidateCell()'`
        );
        return OutSystems.GridAPI.Cells.ValidateCell(
            gridID,
            rowIndex,
            columnID,
            triggerOnCellValueChange
        );
    }

    /**
     * Responsible for running the actions that are in charge of the validation per each column.
     * Those actions might be included in the OnCellValueChange handler or in case the isMandatory column configuration is set.
     *
     * @param {string} gridID ID of the Grid.
     * @param {number} rowIndex Index of the row that contains the cells to be validated.
     */
    export function ValidateRow(gridID: string, rowIndex: number): string {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Cells.ValidateRow()'`
        );
        return OutSystems.GridAPI.Cells.ValidateRow(gridID, rowIndex);
    }
    /**
     * Responsible for updating a specific cell -
     * This is needed in a case we wnat to update another column cell, for example when a cell content is denpendent on another.
     *
     * @param {string} gridID ID of the Grid.
     * @param {number} rowIndex Index of the row that contains the cells to be validated.
     * @param {string} columnID ID of the Column block in which the cell should be updated.
     * @param {*} value New value to settled on the cell.
     * @param {boolean} [showDirtyMark=true] Boolean that represents if the action should also show a dirty mark.
     * @param {boolean} [triggerOnCellValueChange=true] Boolean that represents if we want to trigger the on value change event or not
     */
    export function SetCellData(
        gridID: string,
        rowIndex: number,
        columnID: string,
        // eslint-disable-next-line
        value: any,
        showDirtyMark = true,
        triggerOnCellValueChange = true
    ): string {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Cells.SetCellData()'`
        );
        return OutSystems.GridAPI.Cells.SetCellData(
            gridID,
            rowIndex,
            columnID,
            value,
            showDirtyMark,
            triggerOnCellValueChange
        );
    }
}
