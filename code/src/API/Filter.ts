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
        if (!Helper.IsGridReady(gridID)) return;
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
        if (!Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);
        const rx = new RegExp(searchedValue, 'i');

        // always move to first page when a search is done
        grid.features.pagination.moveToFirstPage();

        grid.provider.collectionView.filter = function (x) {
            return !searchedValue || JSON.stringify(x).match(rx) !== null;
        };

        if (grid.features.selection.hasValidSelection() === false) {
            if (grid.hasResults()) {
                grid.features.selection.selectAndFocusFirstCell();
            }
        }

        grid.gridEvents.trigger(ExternalEvents.GridEventType.SearchEnded, grid);
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
    export function ActivateFilter(gridID: string, columnID: string): void {
        if (!Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.filter.activate(columnID);
    }

    /**
     * Function that deactivates filter of a given column
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @param {string} columnID ID of the column that will have filter deactivated.
     * @returns {*}  {void}
     */
    export function DeactivateFilter(gridID: string, columnID: string): void {
        if (!Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);
        grid.features.filter.deactivate(columnID);
    }
}
