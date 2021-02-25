/**
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.Filter {
    /**
     * Get Column name from the stringified dataItem with the cell value
     * @param str string where the search is going to be executed. In this case corresponds to the stringified dataItem
     * @param text text to search on the string. In this case corresponds to the cell value
     */
    function GetColumnName(str: string, cellValue: string): string {
        const regex = new RegExp('"([^"]*)"' + cellValue, 'i');
        const columnNameMatch = JSON.stringify(str).match(regex);

        // If the columnName doesn't exist return undefined. Otherwise, check if it has an Entity and return complete column Name
        return columnNameMatch ? GetEntity(str, columnNameMatch[1]) : undefined;
    }

    /**
     * Get Entity from the stringified dataItem with the column name
     * @param str string where the search is going to be executed. In this case corresponds to the stringified dataItem
     * @param text text to search on the string. In this case corresponds to the column name
     */
    function GetEntity(str: string, columnName: string): string {
        const regex = new RegExp('"([^"]*)":{.*"' + columnName + '"', 'i');
        const entityNameMatch = JSON.stringify(str).match(regex);

        // If the data provided to the grid came from ArrangeData it will have Entity.ColumnName format.
        // If the data provided to the grid came from JSONSerialize it will have ColumnName format.
        return entityNameMatch
            ? entityNameMatch[1] + '.' + columnName
            : columnName;
    }

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
        const bindings = grid.provider.columns.map((col) => {
            if (col.visible) return col.binding;
        });

        // If the searchedValue is "Pink", trying to match will return :"pink
        const regex = new RegExp(
            '([:]s*"*)[^"]*(' + wijmo.escapeRegExp(searchedValue) + ')[^"]*',
            'i'
        );

        grid.features.pagination.moveToFirstPage();
        // Filter the collectionView
        grid.provider.collectionView.filter = function (dataItemStr) {
            const dataItemMatchArray: RegExpMatchArray = JSON.stringify(
                dataItemStr
            ).match(regex);
            const dataItemMatch = dataItemMatchArray
                ? dataItemMatchArray[0]
                : undefined;

            if (dataItemMatch !== undefined && searchedValue !== '') {
                // Get column name (Entity.ColumnName or ColumnName) from the matching text
                // but make sure matched text doesn't surpass the max length of regex
                const columnName = GetColumnName(
                    dataItemStr,
                    wijmo.escapeRegExp(dataItemMatch.toString().substr(0, 1000))
                );

                // Check if the columnName (Entity.ColumnName or ColumnName) exists on the grid
                // useful if the grid has custom columns
                return columnName && bindings.includes(columnName);
            }
            // If the search input is empty return true, otherwise return false
            return !searchedValue || false;
        };

        if (grid.features.selection.hasValidSelection() === false) {
            if (grid.hasResults()) {
                grid.features.selection.selectAndFocusFirstCell();
            }
        }
        grid.gridEvents.trigger(ExternalEvents.GridEventType.SearchEnded, grid);
        //TODO: [RGRIDT-621] Give feedback if grid is not found
    }
}
