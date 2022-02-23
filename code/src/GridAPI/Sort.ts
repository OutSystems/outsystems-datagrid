/**
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.Sort {
    /**
     * Function that clears sort of grid
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @returns {*}  {string} Return Message containing the resulting code from sorting columns and the error message in case of failure
     */
    export function Clear(gridID: string): string {
        PerformanceAPI.SetMark('Sort.Clear');

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
            GridManager.GetGridById(gridID).features.sort.clear();
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code = OSFramework.Enum.ErrorCodes.API_FailedClearSort;
        }

        PerformanceAPI.SetMark('Sort.Clear-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Sort.Clear',
            'Sort.Clear',
            'Sort.Clear-end'
        );

        return JSON.stringify(responseObj);
    }

    /**
     * Function that sorts a Grid column based in its ID and on a sorting
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @param {string} columnID
     * @param {OSFramework.OSStructure.Sorting} sorting
     * @return {*}  {string} Return Message containing the resulting code from sorting columns and the error message in case of failure
     */
    export function ColumnSort(
        gridID: string,
        columnID: string,
        sorting: OSFramework.OSStructure.Sorting
    ): string {
        PerformanceAPI.SetMark('Sort.ColumnSort');

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
            GridManager.GetGridById(gridID).features.sort.sortColumn(
                columnID,
                sorting
            );
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code = OSFramework.Enum.ErrorCodes.API_FailedClearSort;
        }

        PerformanceAPI.SetMark('Sort.ColumnSort-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Sort.ColumnSort',
            'Sort.ColumnSort',
            'Sort.ColumnSort-end'
        );

        return JSON.stringify(responseObj);
    }
    /**
     * Function that defines whether or not Grid will have Unsort State
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @param {boolean} hasUnsortState Set to True to add a third state to columns sorting that unsorts the column.
     * @return {*}  {string} Return Message containing the resulting code from sorting columns and the error message in case of failure
     */
    export function SetUnsortState(
        gridID: string,
        hasUnsortState: boolean
    ): string {
        PerformanceAPI.SetMark('Sort.SetUnsortState');

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
            GridManager.GetGridById(gridID).features.sort.setUnsortState(
                hasUnsortState
            );
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedSetUnsortState;
        }

        PerformanceAPI.SetMark('Sort.SetUnsortState-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Sort.SetUnsortState',
            'Sort.SetUnsortState',
            'Sort.SetUnsortState-end'
        );

        return JSON.stringify(responseObj);
    }
}
