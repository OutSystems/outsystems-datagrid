namespace OutSystems.GridAPI.ColumnManager {
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
        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode:
                OSFramework.Enum.ErrorCodes.API_FailedAddColumnToGroupPanel,
            callback: () => {
                GridManager.GetGridById(
                    gridID
                ).features.groupPanel.addColumnsToGroupPanel(ListOfColumnIDs);
            }
        });

        PerformanceAPI.SetMark('ColumnManager.AddColumnToGroupPanel-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-ColumnManager.AddColumnToGroupPanel',
            'ColumnManager.AddColumnToGroupPanel',
            'ColumnManager.AddColumnToGroupPanel-end'
        );

        return JSON.stringify(result);
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
        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode: OSFramework.Enum.ErrorCodes.API_FailedSetColumnAggregate,
            callback: () => {
                GridManager.GetGridById(
                    gridID
                ).features.groupPanel.setAggregate(columnID, aggregate);
            }
        });

        PerformanceAPI.SetMark('ColumnManager.SetColumnAggregate-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-ColumnManager.SetColumnAggregate',
            'ColumnManager.SetColumnAggregate',
            'ColumnManager.SetColumnAggregate-end'
        );

        return result;
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
        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode: OSFramework.Enum.ErrorCodes.API_FailedAllowCellMerging,
            callback: () => {
                GridManager.GetGridById(
                    gridID
                ).features.columnMergeCells.mergeColumnCells(
                    columnID,
                    allowMerge
                );
            }
        });

        PerformanceAPI.SetMark('ColumnManager.AllowCellMerging-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-ColumnManager.AllowCellMerging',
            'ColumnManager.AllowCellMerging',
            'ColumnManager.AllowCellMerging-end'
        );

        return result;
    }

    /**
     *  Changes column header
     *
     * @export
     * @param {string} gridID
     * @param {string} columnID
     * @param {string} header
     * @return {*}  {string}
     */
    export function SetColumnHeader(
        gridID: string,
        columnID: string,
        header: string
    ): string {
        PerformanceAPI.SetMark('ColumnManager.SetColumnHeader');
        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode: OSFramework.Enum.ErrorCodes.API_FailedSetColumnHeader,
            callback: () => {
                GridManager.GetGridById(gridID).features.column.setColumnHeader(
                    columnID,
                    header
                );
            }
        });

        PerformanceAPI.SetMark('ColumnManager.SetColumnHeader-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-ColumnManager.SetColumnHeader',
            'ColumnManager.SetColumnHeader',
            'ColumnManager.SetColumnHeader-end'
        );

        return result;
    }
}

/**
 * Namespace that contains functions responsible for interactions with columns.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.ColumnManager {
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
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.ColumnManager.AddColumnsToGroupPanel()'`
        );
        return OutSystems.GridAPI.ColumnManager.AddColumnsToGroupPanel(
            gridID,
            ListOfColumnIDs
        );
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
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.ColumnManager.CreateColumn()'`
        );
        return OutSystems.GridAPI.ColumnManager.CreateColumn(
            columnID,
            type,
            configs,
            editorConfig
        );
    }

    /**
     * Returns a column based on ID
     * @param columnID Column Id
     */
    export function GetColumnById(
        columnID: string
    ): OSFramework.Column.IColumn {
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.ColumnManager.GetColumnById()'`
        );
        return OutSystems.GridAPI.ColumnManager.GetColumnById(columnID);
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
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.ColumnManager.ChangeProperty()'`
        );
        return OutSystems.GridAPI.ColumnManager.ChangeProperty(
            columnID,
            propertyName,
            propertyValue
        );
    }

    /**
     * Destroys the column
     *
     * @export
     * @param {string} columnID id of the column with which actions on the column can be performed.
     */
    export function DestroyColumn(columnID: string): void {
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.ColumnManager.DestroyColumn()'`
        );
        return OutSystems.GridAPI.ColumnManager.DestroyColumn(columnID);
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
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.ColumnManager.SetColumnAggregate()'`
        );
        return OutSystems.GridAPI.ColumnManager.SetColumnAggregate(
            gridID,
            columnID,
            aggregate
        );
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
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.ColumnManager.MergeColumnCells()'`
        );
        return OutSystems.GridAPI.ColumnManager.MergeColumnCells(
            gridID,
            columnID,
            allowMerge
        );
    }

    /**
     *  Changes column header
     *
     * @export
     * @param {string} gridID
     * @param {string} columnID
     * @param {string} header
     * @return {*}  {string}
     */
    export function SetColumnHeader(
        gridID: string,
        columnID: string,
        header: string
    ): string {
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.ColumnManager.SetColumnHeader()'`
        );
        return OutSystems.GridAPI.ColumnManager.SetColumnHeader(
            gridID,
            columnID,
            header
        );
    }
}
