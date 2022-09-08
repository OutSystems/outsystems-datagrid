// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
    export class Search
        implements
            OSFramework.DataGrid.Feature.ISearch,
            OSFramework.DataGrid.Interface.IBuilder,
            OSFramework.DataGrid.Interface.IDisposable
    {
        private _searchData: wijmo.grid.search.FlexGridSearch;

        constructor(private _grid: Grid.IGridWijmo) {}

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        public build(): void {}

        public dispose(): void {
            if (this._searchData !== undefined) {
                this._searchData.dispose();
            }
        }

        /**
         * Function that will enable the search feature on Grid
         *
         * @param gridId
         */
        public searchData(searchID: string, promptMessage: string): void {
            this._searchData = new wijmo.grid.search.FlexGridSearch(
                '#' + searchID,
                {
                    placeholder: promptMessage,
                    grid: this._grid.provider
                }
            );
        }
    }
}
