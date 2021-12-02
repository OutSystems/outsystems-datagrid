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
     * @returns {*}  {void}
     */
    export function Clear(gridID: string): void {
        PerformanceAPI.SetMark('Sort.Clear');

        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.sort.clear();

        PerformanceAPI.SetMark('Sort.Clear-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Sort.Clear',
            'Sort.Clear',
            'Sort.Clear-end'
        );
    }

    export function ColumnSort(
        gridID: string,
        columnID: string,
        isAscending: boolean
    ): void {
        PerformanceAPI.SetMark('Sort.ColumnSort');

        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.sort.sortColumn(columnID, isAscending);

        PerformanceAPI.SetMark('Sort.ColumnSort-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Sort.ColumnSort',
            'Sort.ColumnSort',
            'Sort.ColumnSort-end'
        );
    }
}
