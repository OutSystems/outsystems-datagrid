/**
 * Namespace that contains functions responsible for interactions with columns.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.ColumnManager {
    const columnMap = new Map<string, string>(); //column.uniqueId -> grid.uniqueId
    const columnArr = new Array<OSFramework.Column.IColumn>();

    /**
     * Add a given column to the grid group panel.
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {string} columnID ID of the Column block that will be programmatically added to the grid group panel.
     */
    export function AddColumnsToGroupPanel(
        gridID: string,
        ListOfColumnIDs: string
    ): string {
        PerformanceAPI.SetMark('ColumnManager.AddColumnToGroupPanel');

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
            grid.features.groupPanel.addColumnsToGroupPanel(ListOfColumnIDs);
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedAddColumnToGroupPanel;
        }

        PerformanceAPI.SetMark('ColumnManager.AddColumnToGroupPanel-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-ColumnManager.AddColumnToGroupPanel',
            'ColumnManager.AddColumnToGroupPanel',
            'ColumnManager.AddColumnToGroupPanel-end'
        );

        return JSON.stringify(responseObj);
    }

    /**
     * Creates the column for the provider with the given configurations.
     *
     * @param {string} columnID id of the column with which actions on the column can be performed.
     * @param {OSFramework.Enum.ColumnType} type type of column to be created.
     * @param {string} [configs='{}'] configurations in JSON format.
     * @param {string} [editorConfig='{}'] configurations to be used when the column is in edit mode.
     * @returns {*}  {boolean} true if the column got created.
     */
    export function CreateColumn(
        columnID: string,
        type: OSFramework.Enum.ColumnType,
        configs = '{}',
        editorConfig = '{}'
    ): boolean {
        PerformanceAPI.SetMark('ColumnManager.createColumn');

        editorConfig = editorConfig === '' ? '{}' : editorConfig;
        let output = false;
        let column: OSFramework.Column.IColumn;
        const grid = GetGridByColumnId(columnID);
        const jsonConfigs = JSON.parse(configs);
        const jsonEditorConfigs = JSON.parse(editorConfig);

        if (grid !== undefined) {
            column = WijmoProvider.Column.ColumnFactory.MakeColumn(
                grid,
                type,
                columnID,
                jsonConfigs,
                jsonEditorConfigs
            );

            columnArr.push(column);
            columnMap.set(columnID, grid.uniqueId);
            grid.addColumn(column);

            output = true;
        }

        PerformanceAPI.SetMark('ColumnManager.createColumn-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-ColumnManager.createColumn',
            'ColumnManager.createColumn',
            'ColumnManager.createColumn-end'
        );
        return output;
    }

    /**
     * Gets the grid to which the column belongs to.
     *
     * @param {string} columnID id of the column with which actions on the column can be performed.
     * @returns {*}  {ColumnMapper} this structure has the id of Grid, and the reference to the instance of the grid.
     */
    function GetGridByColumnId(columnID: string): OSFramework.Grid.IGrid {
        PerformanceAPI.SetMark('ColumnManager.getGridByColumnId');

        let grid: OSFramework.Grid.IGrid;

        //ColumnId is the UniqueId
        if (columnMap.has(columnID)) {
            grid = GridManager.GetGridById(columnMap.get(columnID), false);
            //UniqueID not found
        } else {
            // Try to find its reference on DOM
            const elem = OSFramework.Helper.GetElementByUniqueId(
                columnID,
                false
            );

            // If element is found, means that the DOM was rendered
            if (elem !== undefined) {
                //Find the closest grid
                grid = OSFramework.Helper.GetClosestGrid(elem);
            }
            //TODO: [RGRIDT-623] By looking to the DOM first, maybe this 3rd possibility can be removed from here
            // Otherwise insert in active grid
            else {
                grid = GridManager.GetActiveGrid();
            }
        }

        PerformanceAPI.SetMark('ColumnManager.getGridByColumnId-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-ColumnManager.getGridByColumnId',
            'ColumnManager.getGridByColumnId',
            'ColumnManager.getGridByColumnId-end'
        );
        return grid;
    }

    /**
     * Returns a column based on ID
     * @param columnID Column Id
     */
    export function GetColumnById(
        columnID: string
    ): OSFramework.Column.IColumn {
        // we want to return the last column in our array that matches our predicate
        return _.findLast(columnArr, (p) => p && p.equalsToID(columnID));
    }

    /**
     * Changes the property of a given column.
     *
     * @export
     * @param {string} columnID id of the column with which actions on the column can be performed.
     * @param {string} propertyName name of the property to be changed - some properties of the provider might not work out of be box.
     * @param {*} propertyValue value to which the property should be changed to.
     */
    export function ChangeProperty(
        columnID: string,
        propertyName: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
        propertyValue: any
    ): void {
        PerformanceAPI.SetMark('ColumnManager.changeProperty');

        const grid = GetGridByColumnId(columnID);

        if (grid !== undefined) {
            grid.changeColumnProperty(columnID, propertyName, propertyValue);
        }
        PerformanceAPI.SetMark('ColumnManager.changeProperty-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-ColumnManager.changeProperty',
            'ColumnManager.changeProperty',
            'ColumnManager.changeProperty-end'
        );
    }

    /**
     * Destroys the column
     *
     * @export
     * @param {string} columnID id of the column with which actions on the column can be performed.
     */
    export function DestroyColumn(columnID: string): void {
        PerformanceAPI.SetMark('ColumnManager.destroyColumn');

        const grid = GetGridByColumnId(columnID);

        grid && grid.removeColumn(columnID);
        columnMap.delete(columnID);
        columnArr.splice(
            columnArr.findIndex((p) => {
                return p && p.equalsToID(columnID);
            }),
            1
        );
        PerformanceAPI.SetMark('ColumnManager.destroyColumn-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-ColumnManager.destroyColumn',
            'ColumnManager.destroyColumn',
            'ColumnManager.destroyColumn-end'
        );
    }

    /**
     * Set column aggregate in group panel
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {string} columnID id of the column with which actions on the column can be performed.
     * @param {number} aggregate aggregate that will be applied on group panel.
     */
    export function SetColumnAggregate(
        gridID: string,
        columnID: string,
        aggregate: number
    ): string {
        PerformanceAPI.SetMark('ColumnManager.SetColumnAggregate');

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
            grid.features.groupPanel.setAggregate(columnID, aggregate);
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedSetColumnAggregate;
        }

        PerformanceAPI.SetMark('ColumnManager.SetColumnAggregate-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-ColumnManager.SetColumnAggregate',
            'ColumnManager.SetColumnAggregate',
            'ColumnManager.SetColumnAggregate-end'
        );

        return JSON.stringify(responseObj);
    }

    /**
     *  Combines consecutive cells of a given grid column that have the same value into a single cell.
     *
     * @export
     * @param {string} gridID
     * @param {string} columnID
     * @param {boolean} allowMerge
     * @return {*}  {string}
     */
    export function MergeColumnCells(
        gridID: string,
        columnID: string,
        allowMerge: boolean
    ): string {
        PerformanceAPI.SetMark('ColumnManager.AllowCellMerging');

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
            grid.features.columnMergeCells.mergeColumnCells(
                columnID,
                allowMerge
            );
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedAllowCellMerging;
        }

        PerformanceAPI.SetMark('ColumnManager.AllowCellMerging-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-ColumnManager.AllowCellMerging',
            'ColumnManager.AllowCellMerging',
            'ColumnManager.AllowCellMerging-end'
        );

        return JSON.stringify(responseObj);
    }
}
