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
            const column = ColumnManager.GetColumnById(columnID);

            if (column !== undefined) {
                const binding = column.config.binding;

                GridManager.GetGridById(gridID).features.cellStyle.addClass(
                    binding,
                    rowIndex,
                    className,
                    true
                );
            } else {
                responseObj.isSuccess = false;
                responseObj.message =
                    OSFramework.Enum.ErrorMessages.InvalidColumnIdentifier;
                responseObj.code =
                    OSFramework.Enum.ErrorCodes.API_FailedSetCellCssClass;
            }
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedSetCellCssClass;
        }

        PerformanceAPI.SetMark('Styling.SetCellCssClass-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Styling.SetCellCssClass',
            'Styling.SetCellCssClass',
            'Styling.SetCellCssClass-end'
        );

        return JSON.stringify(responseObj);
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
            GridManager.GetGridById(gridID).features.styling.addColumnCssClass(
                columnID,
                cssClass,
                applyToHeader
            );
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedSetColumnCssClass;
        }

        PerformanceAPI.SetMark('Styling.SetColumnCssClass-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Styling.SetColumnCssClass',
            'Styling.SetColumnCssClass',
            'Styling.SetColumnCssClass-end'
        );

        return JSON.stringify(responseObj);
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
            const column = ColumnManager.GetColumnById(columnID);

            if (column !== undefined) {
                const binding = column.config.binding;

                GridManager.GetGridById(
                    gridID
                ).features.cellStyle.removeAllClasses(rowIndex, binding, true);
            } else {
                responseObj.isSuccess = false;
                responseObj.message =
                    OSFramework.Enum.ErrorMessages.InvalidColumnIdentifier;
                responseObj.code =
                    OSFramework.Enum.ErrorCodes.API_FailedRemoveAllCssClassesFromCell;
            }
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedRemoveAllCssClassesFromCell;
        }

        PerformanceAPI.SetMark('Styling.RemoveAllCssClassesFromCell-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Styling.RemoveAllCssClassesFromCell',
            'Styling.RemoveAllCssClassesFromCell',
            'Styling.RemoveAllCssClassesFromCell-end'
        );

        return JSON.stringify(responseObj);
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
    ): string {
        PerformanceAPI.SetMark('Styling.RemoveColumnCssClass');
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
            ).features.styling.removeColumnCssClass(columnID, cssClass);
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedRemoveColumnCssClass;
        }

        PerformanceAPI.SetMark('Styling.RemoveColumnCssClass-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Styling.RemoveColumnCssClass',
            'Styling.RemoveColumnCssClass',
            'Styling.RemoveColumnCssClass-end'
        );

        return JSON.stringify(responseObj);
    }

    /**
     * Set column word wrap
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {string} columnID Id of the column with which the word wrap config should be applied.
     * @param {boolean} wordWrapValue If true word wrap will be setted, if false it will be unset.
     *
     */
    export function SetColumnWordWrap(
        gridID: string,
        columnID: string,
        wordWrapValue: boolean
    ): string {
        PerformanceAPI.SetMark('ColumnManager.SetColumnWordWrap');

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
            GridManager.GetGridById(gridID).features.styling.setColumnWordWrap(
                columnID,
                wordWrapValue
            );
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedSetColumnWordWrap;
        }

        PerformanceAPI.SetMark('ColumnManager.SetColumnWordWrap-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-ColumnManager.SetColumnWordWrap',
            'ColumnManager.SetColumnWordWrap',
            'ColumnManager.SetColumnWordWrap-end'
        );

        return JSON.stringify(responseObj);
    }
}
