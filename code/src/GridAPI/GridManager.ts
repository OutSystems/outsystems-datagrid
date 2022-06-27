/**
 *  Namespace that contains functions responsible for interactions with the grid.
 */
// eslint-disable-next-line
namespace GridAPI.GridManager {
    const gridMap = new Map<string, OSFramework.Grid.IGrid>(); //grid.uniqueId -> Grid obj
    let activeGrid: OSFramework.Grid.IGrid = undefined;

    /**
     * Function that will change the data source in the respective grid.
     *
     * @param {OSFramework.Grid.IGrid} grid Grid where the change will occur.
     * @param {string} data Data to be set in the data grid in JSON format. If the action ArrangeData is used, metadata will also be present and used to generate the columns of the grid.
     * @returns {*}  {boolean} true if the data was changed in the grid.
     */
    function setDataInGrid(
        grid: OSFramework.Grid.IGrid,
        data: string
    ): boolean {
        PerformanceAPI.SetMark('GridManager.setDataInGrid');

        let output = false;
        if (grid !== undefined) {
            if (grid.isReady && data !== '' && data !== '{}') {
                grid.setData(data);
            }
            output = true;
        }

        PerformanceAPI.SetMark('GridManager.setDataInGrid-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-GridManager.setDataInGrid',
            'GridManager.setDataInGrid',
            'GridManager.setDataInGrid-end'
        );
        return output;
    }

    /**
     * Function that creates an instance of grid object with the configurations passed.
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {string} configs configurations for the grid in JSON format.
     * @returns {*}  {Grid.IGrid} instance of the grid.
     */
    export function CreateGrid(
        gridID: string,
        configs: string
    ): OSFramework.Grid.IGrid {
        PerformanceAPI.SetMark('GridManager.CreateGrid');

        const _grid = WijmoProvider.Grid.GridFactory.MakeGrid(
            OSFramework.Enum.GridType.FlexGrid,
            gridID,
            JSON.parse(configs)
        );

        if (gridMap.has(gridID)) {
            throw new Error(
                `There is already a grid registered under id:${gridID}`
            );
        }

        gridMap.set(gridID, _grid);
        activeGrid = _grid;

        Events.CheckPendingEvents(gridID);

        PerformanceAPI.SetMark('GridManager.CreateGrid-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-GridManager.CreateGrid',
            'GridManager.CreateGrid',
            'GridManager.CreateGrid-end'
        );
        return _grid;
    }

    /**
     * Function that gets the instance of grid, by a given ID.
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {boolean} raiseError Will raise errors when there is no object with this uniqueId
     * @returns {*}  {Grid.IGrid} instance of the grid.
     */
    export function GetGridById(
        gridID: string,
        raiseError = true
    ): OSFramework.Grid.IGrid {
        PerformanceAPI.SetMark('GridManager.GetGridById');

        let grid: OSFramework.Grid.IGrid;

        //gridID is the UniqueId
        if (gridMap.has(gridID)) {
            grid = gridMap.get(gridID);
        } else {
            //Search for last inserted grid containing widgetId
            grid = _.findLast(
                Array.from(gridMap.values()),
                (p) => p && p.equalsToID(gridID)
            );
        }

        if (grid === undefined && raiseError) {
            throw new Error(`Grid id:${gridID} not found`);
        }

        PerformanceAPI.SetMark('GridManager.GetGridById-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-GridManager.GetGridById',
            'GridManager.GetGridById',
            'GridManager.GetGridById-end'
        );
        return grid;
    }

    /**
     * Function that returns all Ids of the grids in the page.
     *
     * @export
     * @returns {*}  {Map<string, OSFramework.Grid.IGrid>}
     */
    export function GetAllGridIdsInPage(): Array<string> {
        return Array.from(gridMap.keys());
    }

    /**
     * Function that gets the instance of the current active grid. The active grid, is always the last (existing) grid that was created in the page.
     *
     * @export
     * @returns {*}  {Grid.IGrid} instance of the active grid.
     */
    export function GetActiveGrid(): OSFramework.Grid.IGrid {
        return activeGrid;
    }

    /**
     * Function that obtains all the changed lines (added, edited, removed) by the user.
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @returns {*}  {string} Changed lines in JSON format.
     */
    export function GetChangesInGrid(gridID: string): string {
        PerformanceAPI.SetMark('GridManager.GetChangesInGrid');
        const responseObj = new OSFramework.OSStructure.ReturnMessage();

        if (!OSFramework.Helper.IsGridReady(gridID)) {
            responseObj.isSuccess = false;
            responseObj.message = OSFramework.Enum.ErrorMessages.Grid_NotFound;
            responseObj.code = OSFramework.Enum.ErrorCodes.CFG_GridNotFound;
            return JSON.stringify(responseObj);
        }

        try {
            responseObj.value = JSON.stringify(
                GetGridById(gridID).getChangesMade()
            );
            responseObj.isSuccess = true;
            responseObj.message = OSFramework.Enum.ErrorMessages.SuccessMessage;
            responseObj.code = OSFramework.Enum.ErrorCodes.GRID_SUCCESS;
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedGetChangedLines;
        }

        PerformanceAPI.SetMark('GridManager.GetChangesInGrid-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-GridManager.GetChangesInGrid',
            'GridManager.GetChangesInGrid',
            'GridManager.GetChangesInGrid-end'
        );
        return JSON.stringify(responseObj);
    }

    /**
     * Function that initializes the provider grid in the page.
     * The current provider grid is wijmo.
     * @export
     * @param {string} gridID ID of the Grid that is to be initialized.
     * @param {string} [data='{}']  Data to be set in the data grid in JSON format. If the action ArrangeData is used, metadata will also be present and used to generate the columns of the grid.
     * @returns {*}  {boolean} true if the grid was initialized.
     */
    export function InitializeGrid(gridID: string, data = '{}'): boolean {
        PerformanceAPI.SetMark('GridManager.InitializeGrid');

        let output = false;
        const grid = GetGridById(gridID);

        grid.build();

        output = setDataInGrid(grid, data);

        PerformanceAPI.SetMark('GridManager.InitializeGrid-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-GridManager.InitializeGrid',
            'GridManager.InitializeGrid',
            'GridManager.InitializeGrid-end'
        );
        return output;
    }

    /**
     * Function that will mark all changes as saved.
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {boolean} [forceCleanInvalids=false] determines whether or not we should clean the validation marks.
     */
    export function MarkChangesAsSaved(
        gridID: string,
        forceCleanInvalids = false
    ): string {
        const responseObj = {
            isSuccess: true,
            message: OSFramework.Enum.ErrorMessages.SuccessMessage,
            code: OSFramework.Enum.ErrorCodes.GRID_SUCCESS
        };

        PerformanceAPI.SetMark('GridManager.MarkChangesAsSaved');

        if (!OSFramework.Helper.IsGridReady(gridID)) {
            responseObj.isSuccess = false;
            responseObj.message = OSFramework.Enum.ErrorMessages.Grid_NotFound;
            responseObj.code = OSFramework.Enum.ErrorCodes.CFG_GridNotFound;
            return JSON.stringify(responseObj);
        }

        try {
            GetGridById(gridID).clearAllChanges(forceCleanInvalids);
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedMarkChangesAsSaved;
        }

        PerformanceAPI.SetMark('GridManager.MarkChangesAsSaved-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-GridManager.MarkChangesAsSaved',
            'GridManager.MarkChangesAsSaved',
            'GridManager.MarkChangesAsSaved-end'
        );

        return JSON.stringify(responseObj);
    }
    /**
     * Mark a group of Data Grid lines with given keys (from the KeyBinding field) as saved in the database.
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {string} rowKeys List of row identifiers on the KeyBinding field.
     * @param {boolean} [forceCleanInvalids=false] determines whether or not we should clean the validation marks.
     * @return {*}  {string}
     */
    export function MarkChangesAsSavedByKey(
        gridID: string,
        rowKeys: string,
        forceCleanInvalids = false
    ): string {
        const responseObj = {
            isSuccess: true,
            message: OSFramework.Enum.ErrorMessages.SuccessMessage,
            code: OSFramework.Enum.ErrorCodes.GRID_SUCCESS
        };

        PerformanceAPI.SetMark('GridManager.MarkChangesAsSavedByKey');

        if (!OSFramework.Helper.IsGridReady(gridID)) {
            responseObj.isSuccess = false;
            responseObj.message = OSFramework.Enum.ErrorMessages.Grid_NotFound;
            responseObj.code = OSFramework.Enum.ErrorCodes.CFG_GridNotFound;
            return JSON.stringify(responseObj);
        }

        try {
            GetGridById(gridID).clearAllChangesByRowKeys(
                JSON.parse(rowKeys),
                forceCleanInvalids
            );
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedMarkChangesAsSavedByKey;
        }

        PerformanceAPI.SetMark('GridManager.MarkChangesAsSavedByKey-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-GridManager.MarkChangesAsSavedByKey',
            'GridManager.MarkChangesAsSavedByKey',
            'GridManager.MarkChangesAsSavedByKey-end'
        );

        return JSON.stringify(responseObj);
    }

    /**
     * Function that will change the data source in the respective grid.
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {string} data Data to be set in the data grid in JSON format. If the action ArrangeData is used, metadata will also be present and used to generate the columns of the grid.
     * @returns {*}  {boolean} true if the data was changed in the grid.
     */
    export function SetGridData(gridID: string, data: string): boolean {
        PerformanceAPI.SetMark('GridManager.SetGridData');

        const grid = GetGridById(gridID);
        const output = setDataInGrid(grid, data);

        PerformanceAPI.SetMark('GridManager.SetGridData-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-GridManager.SetGridData',
            'GridManager.SetGridData',
            'GridManager.SetGridData-end'
        );
        return output;
    }

    /**
     * Function that will destroy the grid from the page.
     *
     * @export
     * @param {string} gridID ID of the Grid to be destroyed.
     */
    export function RemoveGrid(gridID: string): void {
        PerformanceAPI.SetMark('GridManager.RemoveGrid');

        const grid = GetGridById(gridID);

        gridMap.delete(grid.uniqueId);

        //Update activeGrid with the most recent one
        if (activeGrid.uniqueId === grid.uniqueId) {
            activeGrid = Array.from(gridMap.values()).pop();
        }

        grid.dispose();

        PerformanceAPI.SetMark('GridManager.RemoveGrid-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-GridManager.RemoveGrid',
            'GridManager.RemoveGrid',
            'GridManager.RemoveGrid-end'
        );
    }

    /**
     * Function that will change the property of a given grid.
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {string} propertyName name of the property to be changed - some properties of the provider might not work out of be box.
     * @param {*} propertyValue value to which the property should be changed to.
     */
    export function ChangeProperty(
        gridID: string,
        propertyName: string,
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        propertyValue: any
    ): void {
        PerformanceAPI.SetMark('GridManager.ChangeProperty');

        const grid = GetGridById(gridID);

        grid.changeProperty(propertyName, propertyValue);

        PerformanceAPI.SetMark('GridManager.ChangeProperty-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-GridManager.ChangeProperty',
            'GridManager.ChangeProperty',
            'GridManager.ChangeProperty-end'
        );
    }

    /**
     * Function that clear all changes in grid
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     */
    export function ClearChanges(gridID: string): string {
        PerformanceAPI.SetMark('GridManager.ClearChanges');
        const responseObj = new OSFramework.OSStructure.ReturnMessage();

        if (!OSFramework.Helper.IsGridReady(gridID)) {
            responseObj.isSuccess = false;
            responseObj.message = OSFramework.Enum.ErrorMessages.Grid_NotFound;
            responseObj.code = OSFramework.Enum.ErrorCodes.CFG_GridNotFound;
            return JSON.stringify(responseObj);
        }

        try {
            GetGridById(gridID).clearChanges();
            responseObj.isSuccess = true;
            responseObj.message = OSFramework.Enum.ErrorMessages.SuccessMessage;
            responseObj.code = OSFramework.Enum.ErrorCodes.GRID_SUCCESS;
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedClearChanges;
        }

        PerformanceAPI.SetMark('GridManager.ClearChanges-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-GridManager.ClearChanges',
            'GridManager.ClearChanges',
            'GridManager.ClearChanges-end'
        );
        return JSON.stringify(responseObj);
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     */
    export function DestroyGrid(gridID: string): void {
        PerformanceAPI.SetMark('GridManager.DestroyGrid');

        const grid = GetGridById(gridID);

        gridMap.delete(grid.uniqueId);

        //Update activeGrid with the most pecent one
        if (activeGrid.uniqueId === grid.uniqueId) {
            activeGrid = Array.from(gridMap.values()).pop();
        }

        grid.dispose();

        PerformanceAPI.SetMark('GridManager.DestroyGrid-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-GridManager.DestroyGrid',
            'GridManager.DestroyGrid',
            'GridManager.DestroyGrid-end'
        );
    }

    /**
     * Function responsible for setting up the the date format to be used in all grids.
     *
     * @export
     * @param {string} date example of date.
     */
    export function SetDateSample(date: string): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        GridAPI.dateFormat = date
            .replace('13', 'dd')
            .replace('10', 'MM')
            .replace('1900', 'yyyy');
    }
}
