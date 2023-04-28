// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Event.Grid {
    /**
     * Events currently supported in the Grid element.
     *
     * @export
     * @enum {string}
     */
    export enum GridEventType {
        Initialized = 'Initialized',
        OnCellClick = 'OnCellClick',
        OnColumnPickerChange = 'OnColumnPickerChange',
        OnFiltersChange = 'OnFiltersChange',
        OnSortChange = 'OnSortChange',
        OnDataChange = 'OnDataChange',
        OnCheckedRowsChange = 'OnCheckedRowsChange',
        SearchEnded = 'SearchEnded'
    }
}
