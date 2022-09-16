// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.GridAPI.Search {
    /**
     * Funtion that perform a SearchData at a given GridID
     *
     * @export
     * @param {string} gridID
     * @param {string} promptMessage
     * @returns {*}  {string} Return Message Success or message of error info if it's the case.
     */
    export function SearchData(
        gridID: string,
        searchID: string,
        promptMessage: string,
        resultsHighlight: boolean
    ): void {
        Performance.SetMark('Search.search-data');

        GridManager.Events.Subscribe(
            gridID,
            OSFramework.DataGrid.Event.Grid.GridEventType.Initialized,
            (_gridId: string, gridObj: OSFramework.DataGrid.Grid.IGrid) => {
                gridObj.features.search.searchData(
                    searchID,
                    promptMessage,
                    resultsHighlight
                );
            }
        );

        Performance.SetMark('Search.search-end');
        Performance.GetMeasure(
            '@datagrid-Search.search-data',
            'Search.search-data',
            'Search.search-end'
        );
    }
}
