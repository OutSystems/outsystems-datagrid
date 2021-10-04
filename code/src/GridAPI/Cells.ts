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
    ): void {
        PerformanceAPI.SetMark('Cells.setValidationStatus');
        GridManager.GetGridById(gridID).features.validationMark.setCellStatus(
            rowIndex,
            columnID,
            isValid,
            errorMessage
        );
        PerformanceAPI.SetMark('Cells.setValidationStatus');

        PerformanceAPI.SetMark('Cells.setValidationStatus-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Cells.setValidationStatus',
            'Cells.setValidationStatus',
            'Cells.setValidationStatus-end'
        );
    }

    /**
     * Responsible for running the actions that are in charge of the validation for a cell.
     *
     * @param {string} gridID ID of the Grid.
     * @param {number} rowIndex Index of the row that contains the cells to be validated.
     * @param {string} columnID ID of the Column block in which the action of validation should be triggered.
     */
    export function ValidateCell(
        gridID: string,
        rowIndex: number,
        columnID: string
    ): void {
        PerformanceAPI.SetMark('Cells.validateCell');

        const column = ColumnManager.GetColumnById(columnID);
        if (column === undefined) return;
        GridManager.GetGridById(gridID).features.validationMark.validateCell(
            rowIndex,
            column
        );
        PerformanceAPI.SetMark('Cells.validateCell-end');
        PerformanceAPI.GetMeasure(
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
    export function ValidateRow(gridID: string, rowIndex: number): void {
        PerformanceAPI.SetMark('Cells.validateRow');

        GridManager.GetGridById(gridID).features.validationMark.validateRow(
            rowIndex
        );
        PerformanceAPI.SetMark('Cells.validateRow-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Cells.validateRow',
            'Cells.validateRow',
            'Cells.validateRow-end'
        );
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
     */
    export function SetCellData(
        gridID: string,
        rowIndex: number,
        columnID: string,
        // eslint-disable-next-line
        value: any,
        showDirtyMark = true
    ): void {
        PerformanceAPI.SetMark('Cells.setCellData');

        if (OSFramework.Helper.IsGridReady(gridID) === false) return;
        const grid = GridManager.GetGridById(gridID);
        const column = ColumnManager.GetColumnById(columnID);
        if (column === undefined) return;

        if (showDirtyMark) {
            grid.features.dirtyMark.saveOriginalValue(
                rowIndex,
                column.providerIndex
            );
        }

        grid.features.cellData.setCellData(rowIndex, column, value);
        grid.features.validationMark.validateCell(rowIndex, column);
        PerformanceAPI.SetMark('Cells.setCellData-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Cells.setCellData',
            'Cells.setCellData',
            'Cells.setCellData-end'
        );
    }
}
