/**
 * Namespace responsible for all API methods associated to the styling of cells in the Data Grid.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.Styling {
    /**
     * Function that will add a specific CSS class to a cell
     *
     * @export
     * @param {string} gridID
     * @param {string} columnID
     * @param {number} rowIndex
     * @param {string} className
     */
    export function SetCellCssClass(
        gridID: string,
        columnID: string,
        rowIndex: number,
        className: string
    ): string {
        PerformanceAPI.SetMark('Styling.SetCellCssClass');

        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const binding = ColumnManager.GetColumnById(columnID).config.binding;

        let output = '';

        output = JSON.stringify(
            GridManager.GetGridById(gridID).features.cellStyle.addClass(
                binding,
                rowIndex,
                className
            )
        );

        PerformanceAPI.SetMark('Styling.SetCellCssClass-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Styling.SetCellCssClass',
            'Styling.SetCellCssClass',
            'Styling.SetCellCssClass-end'
        );

        return output;
    }
    /**
     * Function that will add a specific CSS class to the cells of a column.
     * When applyToHeader is true this will affect the header cell, otherwise will just affect the body
     *
     * @export
     * @param {string} gridID
     * @param {string} columnID
     * @param {string} cssClass
     * @param {boolean} applyToHeader
     */
    export function SetColumnCssClass(
        gridID: string,
        columnID: string,
        cssClass: string,
        applyToHeader: boolean
    ): string {
        PerformanceAPI.SetMark('Styling.SetColumnCssClass');

        if (!OSFramework.Helper.IsGridReady(gridID)) return;

        let output = '';

        output = JSON.stringify(
            GridManager.GetGridById(gridID).features.styling.addColumnCssClass(
                columnID,
                cssClass,
                applyToHeader
            )
        );

        PerformanceAPI.SetMark('Styling.SetColumnCssClass-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Styling.SetColumnCssClass',
            'Styling.SetColumnCssClass',
            'Styling.SetColumnCssClass-end'
        );

        return output;
    }
    /**
     * Function that will remove all the CSS classes that were added to a Cell.
     *
     * @export
     * @param {string} gridID
     * @param {string} columnID
     * @param {number} rowIndex
     */
    export function RemoveAllCssClassesFromCell(
        gridID: string,
        columnID: string,
        rowIndex: number
    ): string {
        PerformanceAPI.SetMark('Styling.RemoveAllCssClassesFromCell');

        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const column = ColumnManager.GetColumnById(columnID);
        let output = '';

        if (column !== undefined) {
            const binding = column.config.binding;

            output = JSON.stringify(
                GridManager.GetGridById(
                    gridID
                ).features.cellStyle.removeAllClasses(rowIndex, binding)
            );
        }
        PerformanceAPI.SetMark('Styling.RemoveAllCssClassesFromCell-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Styling.RemoveAllCssClassesFromCell',
            'Styling.RemoveAllCssClassesFromCell',
            'Styling.RemoveAllCssClassesFromCell-end'
        );

        return output;
    }
    /**
     * Function that will remove a added CSS class from a column.
     *
     * @export
     * @param {string} gridID
     * @param {string} columnID
     * @param {string} cssClass
     */
    export function RemoveColumnCssClass(
        gridID: string,
        columnID: string,
        cssClass: string
    ): void {
        PerformanceAPI.SetMark('Styling.RemoveColumnCssClass');

        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        GridManager.GetGridById(gridID).features.styling.removeColumnCssClass(
            columnID,
            cssClass
        );

        PerformanceAPI.SetMark('Styling.RemoveColumnCssClass-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Styling.RemoveColumnCssClass',
            'Styling.RemoveColumnCssClass',
            'Styling.RemoveColumnCssClass-end'
        );
    }
}
