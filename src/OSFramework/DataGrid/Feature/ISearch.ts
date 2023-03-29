// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Feature {
    /**
     * Expose method for enabling the Search feature on Grid
     */
    export interface ISearch {
        hasText: boolean;
        searchData(
            searchId: string,
            promptMessage: string,
            highlightResults: boolean
        ): void;
    }
}
