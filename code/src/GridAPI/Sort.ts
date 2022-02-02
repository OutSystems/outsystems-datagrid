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

        let returnMessage = {
            isSuccess: true,
            message: 'Success',
            code: OSFramework.Enum.ErrorCodes.GRID_SUCCESS
        };

        if (!OSFramework.Helper.IsGridReady(gridID)) {
            returnMessage = {
                isSuccess: false,
                message: 'Grid not found',
                code: OSFramework.Enum.ErrorCodes.CFG_GridNotFound
            };
            return JSON.stringify(returnMessage);
        }
        try {
            GridManager.GetGridById(gridID).features.sort.clear();
        } catch (error) {
            returnMessage = {
                isSuccess: false,
                message: 'Error',
                code: OSFramework.Enum.ErrorCodes.API_FailedClearSort
            };
        }

        PerformanceAPI.SetMark('Sort.Clear-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Sort.Clear',
            'Sort.Clear',
            'Sort.Clear-end'
        );

        return JSON.stringify(returnMessage);
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

        let returnMessage = {
            isSuccess: true,
            message: 'Success',
            code: OSFramework.Enum.ErrorCodes.GRID_SUCCESS
        };

        if (!OSFramework.Helper.IsGridReady(gridID)) {
            returnMessage = {
                isSuccess: false,
                message: 'Grid not found',
                code: OSFramework.Enum.ErrorCodes.CFG_GridNotFound
            };
            return JSON.stringify(returnMessage);
        }
        try {
            GridManager.GetGridById(gridID).features.sort.sortColumn(
                columnID,
                sorting
            );
        } catch (error) {
            returnMessage = {
                isSuccess: false,
                message: 'Error',
                code: OSFramework.Enum.ErrorCodes.API_FailedClearSort
            };
        }

        PerformanceAPI.SetMark('Sort.ColumnSort-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Sort.ColumnSort',
            'Sort.ColumnSort',
            'Sort.ColumnSort-end'
        );

        return JSON.stringify(returnMessage);
    }
}
