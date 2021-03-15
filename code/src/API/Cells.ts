/**
 * Namespace responsible for all API methods associated to the cells of the Data Grid.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.Cells {
    /**
     * Responsible for defining a specific cell as valid/invalid and showing an error message to the user when the content of that same cell is invalid.
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @param {string} columnIndex Index of the column that contains the cell to be validated.
     * @param {string} rowIndex Index of the row that contains the cell to be validated.
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
}
