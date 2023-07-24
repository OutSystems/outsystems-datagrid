namespace OutSystems.GridAPI.Filter {
    /**
     * Function that returns a boolean if the grid has data visible
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @returns {*}  {boolean} true if there are visible results.
     */
    export function HasResults(gridID: string): boolean {
        if (!OSFramework.DataGrid.Helper.IsGridReady(gridID)) return false;
        const grid = GridManager.GetGridById(gridID);
        return grid.hasResults();
    }

    /**
     * Funtion that perform a Search at a given GridID by a given value
     *
     * @export
     * @param {string} gridID
     * @param {string} searchedValue
     * @returns {*}  {string} Return Message Success or message of error info if it's the case.
     */
    export function Search(gridID: string, searchedValue: string): string {
        Performance.SetMark('Filter.search');

        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode:
                OSFramework.DataGrid.Enum.ErrorCodes.API_FailedFilterSearch,
            callback: () => {
                const grid = GridManager.GetGridById(gridID);

                //The method below can be removed after the implementation of wijmo.grid.search
                grid.dataSource.search(searchedValue);

                if (grid.features.selection.hasValidSelection() === false) {
                    if (grid.hasResults()) {
                        grid.features.selection.selectAndFocusFirstCell();
                    }
                }

                grid.gridEvents.trigger(
                    OSFramework.DataGrid.Event.Grid.GridEventType.SearchEnded,
                    grid
                );
            }
        });

        Performance.SetMark('Filter.search-end');
        Performance.GetMeasure(
            '@datagrid-Filter.search',
            'Filter.search',
            'Filter.search-end'
        );

        return result;
    }

    /**
     * Function that activates filter of a given column
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @param {string} columnID ID of the column that will have filter activated.
     * @returns {*}  {string} Return Message Success or message of error info if it's the case.
     */
    export function Activate(gridID: string, columnID: string): string {
        Performance.SetMark('Filter.activate');
        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode:
                OSFramework.DataGrid.Enum.ErrorCodes.API_FailedFilterActivate,
            callback: () => {
                GridManager.GetGridById(gridID).features.filter.activate(
                    columnID
                );
            }
        });

        Performance.SetMark('Filter.activate-end');
        Performance.GetMeasure(
            '@datagrid-Filter.activate',
            'Filter.activate',
            'Filter.activate-end'
        );

        return result;
    }

    /**
     * Function that clears filter of a given column
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @param {string} columnID ID of the column that will have filter cleared.
     * @param {boolean} [triggerOnFiltersChange=true] Flag to indicate if the OnFiltersChange event is to be triggered or not.
     * @returns {*}  {string} Return Message Success or message of error info if it's the case.
     */
    export function Clear(
        gridID: string,
        columnID: string,
        triggerOnFiltersChange = true
    ): string {
        Performance.SetMark('Filter.clear');
        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode:
                OSFramework.DataGrid.Enum.ErrorCodes.API_FailedFilterClear,
            callback: () => {
                GridManager.GetGridById(gridID).features.filter.clear(
                    columnID,
                    triggerOnFiltersChange
                );
            }
        });

        Performance.SetMark('Filter.clear-end');
        Performance.GetMeasure(
            '@datagrid-Filter.clear',
            'Filter.clear',
            'Filter.clear-end'
        );

        return result;
    }
    /**
     * Function that deactivates filter of a given column
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @param {string} columnID ID of the column that will have filter deactivated.
     * @returns {*}  {string} Return Message Success or message of error info if it's the case.
     */
    export function Deactivate(gridID: string, columnID: string): string {
        Performance.SetMark('Filter.deactivate');
        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode:
                OSFramework.DataGrid.Enum.ErrorCodes.API_FailedFilterDeactivate,
            callback: () => {
                GridManager.GetGridById(gridID).features.filter.deactivate(
                    columnID
                );
            }
        });

        Performance.SetMark('Filter.deactivate-end');
        Performance.GetMeasure(
            '@datagrid-Filter.deactivate',
            'Filter.deactivate',
            'Filter.deactivate-end'
        );

        return result;
    }

    /**
     * Function that filters a column by condition
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @param {string} columnID ID of the column that will be filtered.
     * @param {string} values Values on which the column will be filtered by.
     * @returns {*}  {string} Return Message Success or message of error info if it's the case.
     */
    export function ByCondition(
        gridID: string,
        columnID: string,
        values: string
    ): string {
        Performance.SetMark('Filter.ByCondition');
        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode:
                OSFramework.DataGrid.Enum.ErrorCodes
                    .API_FailedFilterByCondition,
            callback: () => {
                GridManager.GetGridById(gridID).features.filter.byCondition(
                    columnID,
                    JSON.parse(values)
                );
            }
        });

        Performance.SetMark('Filter.ByCondition-end');
        Performance.GetMeasure(
            '@datagrid-Filter.ByCondition',
            'Filter.ByCondition',
            'Filter.ByCondition-end'
        );

        return result;
    }

    /**
     * Function that filters a column by value
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @param {string} columnID ID of the column that will be filtered.
     * @param {string} values Values on which the column will be filtered by.
     * @returns {*}  {string} Return Message Success or message of error info if it's the case.
     */
    export function ByValue(
        gridID: string,
        columnID: string,
        values: string
    ): string {
        Performance.SetMark('Filter.ByValue');
        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode:
                OSFramework.DataGrid.Enum.ErrorCodes.API_FailedFilterByValue,
            callback: () => {
                GridManager.GetGridById(gridID).features.filter.byValue(
                    columnID,
                    JSON.parse(values)
                );
            }
        });

        Performance.SetMark('Filter.ByValue-end');
        Performance.GetMeasure(
            '@datagrid-Filter.ByValue',
            'Filter.ByValue',
            'Filter.ByValue-end'
        );

        return result;
    }

    /**
     * Function that sets column filter options only used when Grid is on ServerSidePagination Mode!
     *
     * @export
     * @param {string} gridID ID of the Grid block.
     * @param {string} columnID ID of the column block where the filter options will be set.
     * @param {string} options  Values that will be used on filter by value list.
     * @param {number} maxVisibleOptions Maximum number of elements on the filter list of display values.
     * @returns {*}  {string} Return Message Success or message of error info if it's the case.
     */
    export function SetColumnFilterOptions(
        gridID: string,
        columnID: string,
        options: string,
        maxVisibleOptions?: number
    ): string {
        Performance.SetMark('Filter.SetColumnFilterOptions');
        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode:
                OSFramework.DataGrid.Enum.ErrorCodes
                    .API_FailedFilterSetColumnFilterOptions,
            callback: () => {
                GridManager.GetGridById(
                    gridID
                ).features.filter.setColumnFilterOptions(
                    columnID,
                    JSON.parse(options),
                    maxVisibleOptions
                );
            }
        });

        Performance.SetMark('Filter.SetColumnFilterOptions-end');
        Performance.GetMeasure(
            '@datagrid-Filter.SetColumnFilterOptions',
            'Filter.SetColumnFilterOptions',
            'Filter.SetColumnFilterOptions-end'
        );

        return result;
    }
}

/**
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.Filter {
    /**
     * Function that returns a boolean if the grid has data visible
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @returns {*}  {boolean} true if there are visible results.
     */
    export function HasResults(gridID: string): boolean {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Filter.HasResults()'`
        );
        return OutSystems.GridAPI.Filter.HasResults(gridID);
    }

    /**
     * Funtion that perform a Search at a given GridID by a given value
     *
     * @export
     * @param {string} gridID
     * @param {string} searchedValue
     * @returns {*}  {string} Return Message Success or message of error info if it's the case.
     */
    export function Search(gridID: string, searchedValue: string): string {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Filter.Search()'`
        );
        return OutSystems.GridAPI.Filter.Search(gridID, searchedValue);
    }

    /**
     * Function that activates filter of a given column
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @param {string} columnID ID of the column that will have filter activated.
     * @returns {*}  {string} Return Message Success or message of error info if it's the case.
     */
    export function Activate(gridID: string, columnID: string): string {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Filter.Activate()'`
        );
        return OutSystems.GridAPI.Filter.Activate(gridID, columnID);
    }

    /**
     * Function that clears filter of a given column
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @param {string} columnID ID of the column that will have filter cleared.
     * @returns {*}  {string} Return Message Success or message of error info if it's the case.
     */
    export function Clear(gridID: string, columnID: string): string {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Filter.Clear()'`
        );
        return OutSystems.GridAPI.Filter.Clear(gridID, columnID);
    }
    /**
     * Function that deactivates filter of a given column
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @param {string} columnID ID of the column that will have filter deactivated.
     * @returns {*}  {string} Return Message Success or message of error info if it's the case.
     */
    export function Deactivate(gridID: string, columnID: string): string {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Filter.Deactivate()'`
        );
        return OutSystems.GridAPI.Filter.Deactivate(gridID, columnID);
    }

    /**
     * Function that filters a column by condition
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @param {string} columnID ID of the column that will be filtered.
     * @param {string} values Values on which the column will be filtered by.
     * @returns {*}  {string} Return Message Success or message of error info if it's the case.
     */
    export function ByCondition(
        gridID: string,
        columnID: string,
        values: string
    ): string {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Filter.ByCondition()'`
        );
        return OutSystems.GridAPI.Filter.ByCondition(gridID, columnID, values);
    }

    /**
     * Function that filters a column by value
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @param {string} columnID ID of the column that will be filtered.
     * @param {string} values Values on which the column will be filtered by.
     * @returns {*}  {string} Return Message Success or message of error info if it's the case.
     */
    export function ByValue(
        gridID: string,
        columnID: string,
        values: string
    ): string {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Filter.ByValue()'`
        );
        return OutSystems.GridAPI.Filter.ByValue(gridID, columnID, values);
    }

    /**
     * Function that sets column filter options only used when Grid is on ServerSidePagination Mode!
     *
     * @export
     * @param {string} gridID ID of the Grid block.
     * @param {string} columnID ID of the column block where the filter options will be set.
     * @param {string} options  Values that will be used on filter by value list.
     * @param {number} maxVisibleOptions Maximum number of elements on the filter list of display values.
     * @returns {*}  {string} Return Message Success or message of error info if it's the case.
     */
    export function SetColumnFilterOptions(
        gridID: string,
        columnID: string,
        options: string,
        maxVisibleOptions?: number
    ): string {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Filter.SetColumnFilterOptions()'`
        );
        return OutSystems.GridAPI.Filter.SetColumnFilterOptions(
            gridID,
            columnID,
            options,
            maxVisibleOptions
        );
    }
}
