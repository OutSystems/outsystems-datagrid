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

        public build(): void {
            //
        }

        public dispose(): void {
            if (this._searchData !== undefined) {
                this._searchData.dispose();
            }
        }

        public get hasText(): boolean {
            return this._searchData.text.length > 0;
        }

        /**
         * Function that will enable the search feature on Grid
         *
         * @param gridId
         */
        public searchData(
            searchID: string,
            promptMessage: string,
            highlightResults: boolean
        ): void {
            this._searchData = new wijmo.grid.search.FlexGridSearch(
                '#' + searchID,
                {
                    placeholder: promptMessage,
                    grid: this._grid.provider,
                    cssMatch: highlightResults ? 'wj-state-match' : ''
                }
            );

            // Trigger the searchDone platform event to enable / disable the results message
            this._grid.provider.collectionView.collectionChanged.addHandler(
                () => {
                    // we only want to trigger if search bar is filled.
                    if (this.hasText) {
                        this._grid.gridEvents.trigger(
                            OSFramework.DataGrid.Event.Grid.GridEventType
                                .SearchEnded,
                            this._grid
                        );
                    }
                }
            );
        }
    }
}
