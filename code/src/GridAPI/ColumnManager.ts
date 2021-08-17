/**
 * Namespace that contains functions responsible for interactions with columns.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.ColumnManager {
    const columnMap = new Map<string, string>(); //column.uniqueId -> grid.uniqueId
    const columnArr = new Array<OSFramework.Column.IColumn>();

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
        Performance.SetMark('ColumnManager.createColumn');

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

        Performance.SetMark('ColumnManager.createColumn-end');
        Performance.GetMeasure(
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
        Performance.SetMark('ColumnManager.getGridByColumnId');

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

        Performance.SetMark('ColumnManager.getGridByColumnId-end');
        Performance.GetMeasure(
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
        return columnArr.find((p) => p && p.equalsToID(columnID));
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
        Performance.SetMark('ColumnManager.changeProperty');

        const grid = GetGridByColumnId(columnID);

        if (grid !== undefined) {
            grid.changeColumnProperty(columnID, propertyName, propertyValue);
        }
        Performance.SetMark('ColumnManager.changeProperty-end');
        Performance.GetMeasure(
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
        Performance.SetMark('ColumnManager.destroyColumn');

        const grid = GetGridByColumnId(columnID);

        grid && grid.removeColumn(columnID);
        columnMap.delete(columnID);
        columnArr.splice(
            columnArr.findIndex((p) => {
                return p && p.equalsToID(columnID);
            }),
            1
        );
        Performance.SetMark('ColumnManager.destroyColumn-end');
        Performance.GetMeasure(
            '@datagrid-ColumnManager.destroyColumn',
            'ColumnManager.destroyColumn',
            'ColumnManager.destroyColumn-end'
        );
    }
}
