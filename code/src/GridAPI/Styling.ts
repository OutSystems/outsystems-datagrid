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
        const binding = ColumnManager.GetColumnById(columnID).config.binding;
        GridManager.GetGridById(gridID).features.cellStyle.addClass(
            binding,
            rowIndex,
            className
        );
    }

    export function SetColumnCssClass(
        gridID: string,
        columnID: string,
        cssClass: string,
        applyToHeader: boolean
    ): void {
        if (applyToHeader) {
            GridManager.GetGridById(gridID).features.styling.addCssClassAll(
                columnID,
                cssClass
            );
        } else {
            GridManager.GetGridById(gridID).features.styling.addCssClass(
                columnID,
                cssClass
            );
        }
    }

    export function RemoveAllCssClassesFromCell(
        gridID: string,
        columnID: string,
        rowIndex: number
    ): void {
        const binding = ColumnManager.GetColumnById(columnID).config.binding;
        GridManager.GetGridById(gridID).features.cellStyle.removeClass(
            rowIndex,
            binding
        );
    }

    export function RemoveColumnCssClass(
        gridID: string,
        columnID: string,
        cssClass: string
    ): void {
        GridManager.GetGridById(gridID).features.styling.removeCssClassAll(
            columnID,
            cssClass
        );
        GridManager.GetGridById(gridID).features.styling.removeCssClass(
            columnID,
            cssClass
        );
    }
}
