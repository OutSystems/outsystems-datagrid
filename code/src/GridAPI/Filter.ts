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
        if (!OSFramework.Helper.IsGridReady(gridID)) return;
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
        PerformanceAPI.SetMark('Filter.search');

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

            //The method below can be removed after the implementation of wijmo.grid.search
            grid.dataSource.search(searchedValue);

            if (grid.features.selection.hasValidSelection() === false) {
                if (grid.hasResults()) {
                    grid.features.selection.selectAndFocusFirstCell();
                }
            }

            grid.gridEvents.trigger(
                OSFramework.Event.Grid.GridEventType.SearchEnded,
                grid
            );
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedFilterSearch;
        }

        PerformanceAPI.SetMark('Filter.search-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Filter.search',
            'Filter.search',
            'Filter.search-end'
        );

        return JSON.stringify(responseObj);
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
        PerformanceAPI.SetMark('Filter.activate');

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

            grid.features.filter.activate(columnID);
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedFilterActivate;
        }

        PerformanceAPI.SetMark('Filter.activate-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Filter.activate',
            'Filter.activate',
            'Filter.activate-end'
        );

        return JSON.stringify(responseObj);
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
        PerformanceAPI.SetMark('Filter.clear');

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

            grid.features.filter.clear(columnID);
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedFilterClear;
        }

        PerformanceAPI.SetMark('Filter.clear-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Filter.clear',
            'Filter.clear',
            'Filter.clear-end'
        );

        return JSON.stringify(responseObj);
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
        PerformanceAPI.SetMark('Filter.deactivate');

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

            grid.features.filter.deactivate(columnID);
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedFilterDeactivate;
        }

        PerformanceAPI.SetMark('Filter.deactivate-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Filter.deactivate',
            'Filter.deactivate',
            'Filter.deactivate-end'
        );

        return JSON.stringify(responseObj);
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
        PerformanceAPI.SetMark('Filter.ByCondition');

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

            grid.features.filter.byCondition(columnID, JSON.parse(values));
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedFilterByCondition;
        }

        PerformanceAPI.SetMark('Filter.ByCondition-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Filter.ByCondition',
            'Filter.ByCondition',
            'Filter.ByCondition-end'
        );

        return JSON.stringify(responseObj);
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
        PerformanceAPI.SetMark('Filter.ByValue');

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

            grid.features.filter.byValue(columnID, JSON.parse(values));
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedFilterByValue;
        }

        PerformanceAPI.SetMark('Filter.ByValue-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Filter.ByValue',
            'Filter.ByValue',
            'Filter.ByValue-end'
        );

        return JSON.stringify(responseObj);
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
        PerformanceAPI.SetMark('Filter.SetColumnFilterOptions');

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

            grid.features.filter.setColumnFilterOptions(
                columnID,
                JSON.parse(options),
                maxVisibleOptions
            );
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedFilterSetColumnFilterOptions;
        }

        PerformanceAPI.SetMark('Filter.SetColumnFilterOptions-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Filter.SetColumnFilterOptions',
            'Filter.SetColumnFilterOptions',
            'Filter.SetColumnFilterOptions-end'
        );

        return JSON.stringify(responseObj);
    }
}
