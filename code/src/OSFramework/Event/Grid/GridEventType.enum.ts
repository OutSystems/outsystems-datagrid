// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event.Grid {
    /**
     * Events currently supported in the Grid element.
     *
     * @export
     * @enum {string}
     */
    export enum GridEventType {
        Initialized = 'Initialized',
        OnFiltersChange = 'OnFiltersChange',
        OnSortChange = 'OnSortChange',
        OnDataChange = 'OnDataChange',
        SearchEnded = 'SearchEnded'
    }
}
