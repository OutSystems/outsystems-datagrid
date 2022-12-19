namespace OutSystems.GridAPI.Sort {
    /**
     * Function that clears sort of grid
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @returns {*}  {string} Return Message containing the resulting code from sorting columns and the error message in case of failure
     */
    export function Clear(gridID: string): string {
        PerformanceAPI.SetMark('Sort.Clear');
        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode: OSFramework.Enum.ErrorCodes.API_FailedClearSort,
            callback: () => {
                GridManager.GetGridById(gridID).features.sort.clear();
            }
        });

        PerformanceAPI.SetMark('Sort.Clear-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Sort.Clear',
            'Sort.Clear',
            'Sort.Clear-end'
        );

        return result;
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
        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode: OSFramework.Enum.ErrorCodes.API_FailedColumnSort,
            callback: () => {
                GridManager.GetGridById(gridID).features.sort.sortColumn(
                    columnID,
                    sorting
                );
            }
        });

        PerformanceAPI.SetMark('Sort.ColumnSort-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Sort.ColumnSort',
            'Sort.ColumnSort',
            'Sort.ColumnSort-end'
        );

        return result;
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
        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode: OSFramework.Enum.ErrorCodes.API_FailedSetUnsortState,
            callback: () => {
                GridManager.GetGridById(gridID).features.sort.setUnsortState(
                    hasUnsortState
                );
            }
        });

        PerformanceAPI.SetMark('Sort.SetUnsortState-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Sort.SetUnsortState',
            'Sort.SetUnsortState',
            'Sort.SetUnsortState-end'
        );

        return result;
    }
}

/**
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.Sort {
    export function Clear(gridID: string): string {
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.Sort.Clear()'`
        );
        return OutSystems.GridAPI.Sort.Clear(gridID);
    }

    export function ColumnSort(
        gridID: string,
        columnID: string,
        sorting: OSFramework.OSStructure.Sorting
    ): string {
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.Sort.ColumnSort()'`
        );
        return OutSystems.GridAPI.Sort.ColumnSort(gridID, columnID, sorting);
    }

    export function SetUnsortState(
        gridID: string,
        hasUnsortState: boolean
    ): string {
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.Sort.SetUnsortState()'`
        );
        return OutSystems.GridAPI.Sort.SetUnsortState(gridID, hasUnsortState);
    }
}
