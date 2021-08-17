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
     *
     *
     * @export
     * @param {string} gridID
     * @param {string} searchedValue
     * @returns {*}  {void}
     */
    export function Search(gridID: string, searchedValue: string): void {
        Performance.SetMark('Filter.search');

        if (!OSFramework.Helper.IsGridReady(gridID)) return;
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

        Performance.SetMark('Filter.search-end');
        Performance.GetMeasure(
            '@datagrid-Filter.search',
            'Filter.search',
            'Filter.search-end'
        );
        //TODO: [RGRIDT-621] Give feedback if grid is not found
    }

    /**
     * Function that activates filter of a given column
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @param {string} columnID ID of the column that will have filter activated.
     * @returns {*}  {void}
     */
    export function Activate(gridID: string, columnID: string): void {
        Performance.SetMark('Filter.activate');
        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.filter.activate(columnID);

        Performance.SetMark('Filter.activate-end');
        Performance.GetMeasure(
            '@datagrid-Filter.activate',
            'Filter.activate',
            'Filter.activate-end'
        );
    }

    /**
     * Function that clears filter of a given column
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @param {string} columnID ID of the column that will have filter cleared.
     * @returns {*}  {void}
     */
    export function Clear(gridID: string, columnID: string): void {
        Performance.SetMark('Filter.clear');
        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.filter.clear(columnID);

        Performance.SetMark('Filter.clear-end');
        Performance.GetMeasure(
            '@datagrid-Filter.clear',
            'Filter.clear',
            'Filter.clear-end'
        );
    }
    /**
     * Function that deactivates filter of a given column
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @param {string} columnID ID of the column that will have filter deactivated.
     * @returns {*}  {void}
     */
    export function Deactivate(gridID: string, columnID: string): void {
        Performance.SetMark('Filter.deactivate');

        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);
        grid.features.filter.deactivate(columnID);

        Performance.SetMark('Filter.deactivate-end');
        Performance.GetMeasure(
            '@datagrid-Filter.deactivate',
            'Filter.deactivate',
            'Filter.deactivate-end'
        );
    }
}
