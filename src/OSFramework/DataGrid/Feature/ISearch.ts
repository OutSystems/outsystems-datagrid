// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Feature {
    /**
     * Expose method for enabling the Search feature on Grid
     */
    export interface ISearch {
        searchData(searchId: string, promptMessage: string): void;
    }
}
