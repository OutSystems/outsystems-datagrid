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
        GridManager.GetGridById(gridID).features.validationMark.setStatus(
            rowIndex,
            columnID,
            isValid,
            errorMessage
        );
    }

    /**
     * Responsible for running the actions responsible for row validation per each column.
     * Those actions might be included in the OnCellValueChange handler or in case the isMandatory column configuration is set.
     *
     * @param {string} gridID ID of the Grid.
     * @param {number} rowIndex Index of the row that contains the cells to be validated.
     */
    export function ValidateRow(gridID: string, rowIndex: number): void {
        GridManager.GetGridById(gridID).features.validationMark.validateRow(
            rowIndex
        );
    }
}
