namespace OutSystems.GridAPI.GridManager {
    const gridMap = new Map<string, OSFramework.DataGrid.Grid.IGrid>(); //grid.uniqueId -> Grid obj
    let activeGrid: OSFramework.DataGrid.Grid.IGrid = undefined;

    /**
     * Function that will change the data source in the respective grid.
     *
     * @param {OSFramework.DataGrid.Grid.IGrid} grid Grid where the change will occur.
     * @param {string} data Data to be set in the data grid in JSON format. If the action ArrangeData is used, metadata will also be present and used to generate the columns of the grid.
     * @returns {*}  {boolean} true if the data was changed in the grid.
     */
    const setDataInGrid = OutSystems.GridAPI.Auxiliary.MeasurePerformance(
        'GridManager.setDataInGrid',
        (grid: OSFramework.DataGrid.Grid.IGrid, data: string): boolean => {
            let output = false;
            if (grid !== undefined) {
                if (grid.isReady && data !== '' && data !== '{}') {
                    grid.setData(data);
                }
                output = true;
            }

            return output;
        }
    );

    /**
     * Function that creates an instance of grid object with the configurations passed.
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {string} configs configurations for the grid in JSON format.
     * @returns {*}  {Grid.IGrid} instance of the grid.
     */
    export const CreateGrid = OutSystems.GridAPI.Auxiliary.MeasurePerformance(
        'GridManager.CreateGrid',
        (gridID: string, configs: string): OSFramework.DataGrid.Grid.IGrid => {
            const _grid = Providers.DataGrid.Wijmo.Grid.GridFactory.MakeGrid(
                OSFramework.DataGrid.Enum.GridType.FlexGrid,
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

            return _grid;
        }
    );

    /**
     * Function that gets the instance of grid, by a given ID.
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {boolean} raiseError Will raise errors when there is no object with this uniqueId
     * @returns {*}  {Grid.IGrid} instance of the grid.
     */
    export const GetGridById = OutSystems.GridAPI.Auxiliary.MeasurePerformance(
        'GridManager.GetGridById',
        (
            gridID: string,
            raiseError = true
        ): OSFramework.DataGrid.Grid.IGrid => {
            let grid: OSFramework.DataGrid.Grid.IGrid;

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

            return grid;
        }
    );

    /**
     * Function that returns all Ids of the grids in the page.
     *
     * @export
     * @returns {*}  {Map<string, OSFramework.DataGrid.Grid.IGrid>}
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
    export function GetActiveGrid(): OSFramework.DataGrid.Grid.IGrid {
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
        Performance.SetMark('GridManager.GetChangesInGrid');
        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode:
                OSFramework.DataGrid.Enum.ErrorCodes.API_FailedGetChangedLines,
            callback: () => {
                return JSON.stringify(GetGridById(gridID).getChangesMade());
            },
            hasValue: true
        });

        Performance.SetMark('GridManager.GetChangesInGrid-end');
        Performance.GetMeasure(
            '@datagrid-GridManager.GetChangesInGrid',
            'GridManager.GetChangesInGrid',
            'GridManager.GetChangesInGrid-end'
        );
        return result;
    }

    /**
     * Function that initializes the provider grid in the page.
     * The current provider grid is wijmo.
     * @export
     * @param {string} gridID ID of the Grid that is to be initialized.
     * @param {string} [data='{}']  Data to be set in the data grid in JSON format. If the action ArrangeData is used, metadata will also be present and used to generate the columns of the grid.
     * @returns {*}  {boolean} true if the grid was initialized.
     */
    export const InitializeGrid =
        OutSystems.GridAPI.Auxiliary.MeasurePerformance(
            'GridManager.InitializeGrid',
            (gridID: string, data = '{}'): boolean => {
                let output = false;
                const grid = GetGridById(gridID);
                grid.build();
                output = setDataInGrid(grid, data);

                return output;
            }
        );

    /**
     * Function that will mark all changes as saved.
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {boolean} [forceCleanInvalids=false] determines whether or not we should clean the validation marks.
     */
    export const MarkChangesAsSaved =
        OutSystems.GridAPI.Auxiliary.MeasurePerformance(
            'GridManager.MarkChangesAsSaved',
            (gridID: string, forceCleanInvalids = false): string => {
                const result = Auxiliary.CreateApiResponse({
                    gridID,
                    errorCode:
                        OSFramework.DataGrid.Enum.ErrorCodes
                            .API_FailedMarkChangesAsSaved,
                    callback: () => {
                        GetGridById(gridID).clearAllChanges(forceCleanInvalids);
                    }
                });

                return result;
            }
        );
    /**
     * Mark a group of Data Grid lines with given keys (from the KeyBinding field) as saved in the database.
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {string} rowKeys List of row identifiers on the KeyBinding field.
     * @param {boolean} [forceCleanInvalids=false] determines whether or not we should clean the validation marks.
     * @return {*}  {string}
     */
    export const MarkChangesAsSavedByKey =
        OutSystems.GridAPI.Auxiliary.MeasurePerformance(
            'GridManager.MarkChangesAsSavedByKey',
            (
                gridID: string,
                rowKeys: string,
                forceCleanInvalids = false
            ): string => {
                const result = Auxiliary.CreateApiResponse({
                    gridID,
                    errorCode:
                        OSFramework.DataGrid.Enum.ErrorCodes
                            .API_FailedMarkChangesAsSavedByKey,
                    callback: () => {
                        GetGridById(gridID).clearAllChangesByRowKeys(
                            JSON.parse(rowKeys),
                            forceCleanInvalids
                        );
                    }
                });

                return result;
            }
        );

    /**
     * Function that will change the data source in the respective grid.
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {string} data Data to be set in the data grid in JSON format. If the action ArrangeData is used, metadata will also be present and used to generate the columns of the grid.
     * @returns {*}  {boolean} true if the data was changed in the grid.
     */
    export const SetGridData = OutSystems.GridAPI.Auxiliary.MeasurePerformance(
        'GridManager.SetGridData',
        (gridID: string, data: string): boolean => {
            const grid = GetGridById(gridID);
            const output = setDataInGrid(grid, data);

            return output;
        }
    );

    /**
     * Function that will destroy the grid from the page.
     *
     * @export
     * @param {string} gridID ID of the Grid to be destroyed.
     */
    export const RemoveGrid = OutSystems.GridAPI.Auxiliary.MeasurePerformance(
        'GridManager.RemoveGrid',
        (gridID: string): void => {
            const grid = GetGridById(gridID);

            gridMap.delete(grid.uniqueId);

            //Update activeGrid with the most recent one
            if (activeGrid.uniqueId === grid.uniqueId) {
                activeGrid = Array.from(gridMap.values()).pop();
            }

            grid.dispose();
        }
    );

    /**
     * Function that will change the property of a given grid.
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @param {string} propertyName name of the property to be changed - some properties of the provider might not work out of be box.
     * @param {*} propertyValue value to which the property should be changed to.
     */
    export const ChangeProperty =
        OutSystems.GridAPI.Auxiliary.MeasurePerformance(
            'GridManager.ChangeProperty',
            (
                gridID: string,
                propertyName: string,
                // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
                propertyValue: any
            ): void => {
                const grid = GetGridById(gridID);
                grid.changeProperty(propertyName, propertyValue);
            }
        );

    /**
     * Function that clear all changes in grid
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     */
    export const ClearChanges = OutSystems.GridAPI.Auxiliary.MeasurePerformance(
        'GridManager.ClearChanges',
        (gridID: string): string => {
            const result = Auxiliary.CreateApiResponse({
                gridID,
                errorCode:
                    OSFramework.DataGrid.Enum.ErrorCodes.API_FailedClearChanges,
                callback: () => {
                    GetGridById(gridID).clearChanges();
                }
            });

            return result;
        }
    );

    /**
     *
     *
     * @export
     * @param {string} gridID
     */
    export const DestroyGrid = OutSystems.GridAPI.Auxiliary.MeasurePerformance(
        'GridManager.DestroyGrid',
        (gridID: string): void => {
            const grid = GetGridById(gridID);

            gridMap.delete(grid.uniqueId);

            //Update activeGrid with the most pecent one
            if (activeGrid.uniqueId === grid.uniqueId) {
                activeGrid = Array.from(gridMap.values()).pop();
            }

            grid.dispose();
        }
    );

    /**
     * Function responsible for setting up the the date format to be used in all grids.
     *
     * @export
     * @param {string} date example of date.
     */
    export function SetDateSample(date: string): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        OutSystems.GridAPI.dateFormat = date
            .replace('13', 'dd')
            .replace('10', 'MM')
            .replace('1900', 'yyyy');
    }
}

/**
 *  Namespace that contains functions responsible for interactions with the grid.
 */
// eslint-disable-next-line
namespace GridAPI.GridManager {
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
    ): OSFramework.DataGrid.Grid.IGrid {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.GridManager.CreateGrid()'`
        );
        return OutSystems.GridAPI.GridManager.CreateGrid(gridID, configs);
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
    ): OSFramework.DataGrid.Grid.IGrid {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.GridManager.GetGridById()'`
        );
        return OutSystems.GridAPI.GridManager.GetGridById(gridID, raiseError);
    }

    /**
     * Function that returns all Ids of the grids in the page.
     *
     * @export
     * @returns {*}  {Map<string, OSFramework.DataGrid.Grid.IGrid>}
     */
    export function GetAllGridIdsInPage(): Array<string> {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.GridManager.GetAllGridIdsInPage()'`
        );
        return OutSystems.GridAPI.GridManager.GetAllGridIdsInPage();
    }

    /**
     * Function that gets the instance of the current active grid. The active grid, is always the last (existing) grid that was created in the page.
     *
     * @export
     * @returns {*}  {Grid.IGrid} instance of the active grid.
     */
    export function GetActiveGrid(): OSFramework.DataGrid.Grid.IGrid {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.GridManager.GetActiveGrid()'`
        );
        return OutSystems.GridAPI.GridManager.GetActiveGrid();
    }

    /**
     * Function that obtains all the changed lines (added, edited, removed) by the user.
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     * @returns {*}  {string} Changed lines in JSON format.
     */
    export function GetChangesInGrid(gridID: string): string {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.GridManager.GetChangesInGrid()'`
        );
        return OutSystems.GridAPI.GridManager.GetChangesInGrid(gridID);
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
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.GridManager.InitializeGrid()'`
        );
        return OutSystems.GridAPI.GridManager.InitializeGrid(gridID, data);
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
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.GridManager.MarkChangesAsSaved()'`
        );
        return OutSystems.GridAPI.GridManager.MarkChangesAsSaved(
            gridID,
            forceCleanInvalids
        );
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
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.GridManager.MarkChangesAsSavedByKey()'`
        );
        return OutSystems.GridAPI.GridManager.MarkChangesAsSavedByKey(
            gridID,
            rowKeys,
            forceCleanInvalids
        );
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
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.GridManager.SetGridData()'`
        );
        return OutSystems.GridAPI.GridManager.SetGridData(gridID, data);
    }

    /**
     * Function that will destroy the grid from the page.
     *
     * @export
     * @param {string} gridID ID of the Grid to be destroyed.
     */
    export function RemoveGrid(gridID: string): void {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.GridManager.RemoveGrid()'`
        );
        return OutSystems.GridAPI.GridManager.RemoveGrid(gridID);
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
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.GridManager.ChangeProperty()'`
        );
        return OutSystems.GridAPI.GridManager.ChangeProperty(
            gridID,
            propertyName,
            propertyValue
        );
    }

    /**
     * Function that clear all changes in grid
     *
     * @export
     * @param {string} gridID ID of the Grid where the change will occur.
     */
    export function ClearChanges(gridID: string): string {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.GridManager.ClearChanges()'`
        );
        return OutSystems.GridAPI.GridManager.ClearChanges(gridID);
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     */
    export function DestroyGrid(gridID: string): void {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.GridManager.DestroyGrid()'`
        );
        return OutSystems.GridAPI.GridManager.DestroyGrid(gridID);
    }

    /**
     * Function responsible for setting up the the date format to be used in all grids.
     *
     * @export
     * @param {string} date example of date.
     */
    export function SetDateSample(date: string): void {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.GridManager.SetDateSample()'`
        );
        return OutSystems.GridAPI.GridManager.SetDateSample(date);
    }
}
