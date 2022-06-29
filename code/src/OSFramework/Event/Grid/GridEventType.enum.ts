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
        OnColumnPickerChange = 'OnColumnPickerChange',
        OnDataChange = 'OnDataChange',
        OnFiltersChange = 'OnFiltersChange',
        OnSortChange = 'OnSortChange',
        SearchEnded = 'SearchEnded'
    }
}
