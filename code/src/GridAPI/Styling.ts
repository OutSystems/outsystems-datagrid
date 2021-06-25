/**
 * Namespace responsible for all API methods associated to the styling of cells in the Data Grid.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.Styling {
    export function SetCellCssClass(
        gridID: string,
        columnID: string,
        rowIndex: number,
        className: string
    ): void {
        GridManager.GetGridById(gridID).features.cellStyle.addClass(
            columnID,
            rowIndex,
            className
        );
    }

    export function SetColumnCssClass(
        gridID: string,
        columnID: string,
        rowIndex: number,
        applyToHeader : boolean
    ): void {
        //
    }

    export function RemoveCellCssClass(
        gridID: string,
        columnID: string,
        rowIndex: number,
        className: string
    ): void {
        //
    }

    export function RemoveColumnCssClass(
        gridID: string,
        columnID: string,
        rowIndex: number
    ): void {
        //
    }
}
