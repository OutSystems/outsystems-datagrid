// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Enum {
    /**
     * Codes that get the associated to specific returning messages indicated wheter the action had success or not.
     */
    export enum ErrorCodes {
        GRID_SUCCESS = 200,
        // Error Codes - CONFiguration errors - Any error related with missing or wrong configuration of the application.
        CFG_GridNotFound = 'GRID-CFG-01001',
        CFG_ColumnNotFound = 'GRID-CFG-02001',

        // Error Codes - API errors - Specific errors generated when exposing the component client actions API/Framework.

        // PAGINATION
        API_FailedPaginationGetCurrentPage = 'GRID-API-01001',
        API_FailedPaginationSetCurrentPage = 'GRID-API-01002',
        // ROWS
        API_UnableToAddRow = 'GRID-API-02001',
        API_FailedAddRow = 'GRID-API-02002',
        API_UnableToRemoveRow = 'GRID-API-02003',
        API_FailedRemoveRow = 'GRID-API-02004',
        API_FailedApplyRowValidation = 'GRID-API-02005',
        API_FailedGetRowData = 'GRID-API-02006',
        API_FailedGetRowNumberByKey = 'GRID-API-02007',
        API_FailedUpdateAddedRowKey = 'GRID-API-02008',
        API_FailedUpdateStartingRowHeader = 'GRID-API-02009',
        // VIEW
        API_FailedGetViewLayout = 'GRID-API-03001',
        API_FailedSetViewLayout = 'GRID-API-03002',
        // SORT
        API_FailedClearSort = 'GRID-API-04001',
        API_FailedColumnSort = 'GRID-API-04002',
        API_FailedSetUnsortState = 'GRID-API-04003',
        // SELECTION
        API_FailedGetAllSelections = 'GRID-API-05001',
        API_FailedGetAllSelectionsData = 'GRID-API-05002',
        API_FailedGetCheckedRowsData = 'GRID-API-05003',
        API_FailedGetSelectedRowsCount = 'GRID-API-05004',
        API_FailedGetSelectedRowsData = 'GRID-API-05005',
        API_FailedHasSelectedRows = 'GRID-API-05006',
        // STYLE
        API_FailedSetCellCssClass = 'GRID-API-06001',
        API_FailedSetColumnCssClass = 'GRID-API-06002',
        API_FailedRemoveAllCssClassesFromCell = 'GRID-API-06003',
        API_FailedRemoveColumnCssClass = 'GRID-API-06004',
        API_FailedRemoveClass = 'GRID-API-06005',
        API_FailedRemoveAllClasses = 'GRID-API-06006',
        API_FailedAddClass = 'GRID-API-06007',
        // DATA
        API_FailedGetChangedLines = 'GRID-API-07001',
        API_FailedMarkChangesAsSaved = 'GRID-API-07002',
        API_FailedSetCellData = 'GRID-API-07003',
        API_FailedMarkChangesAsSavedByKey = 'GRID-API-07004',
        API_FailedClearChanges = 'GRID-API-07005',
        // VALIDATION
        API_FailedSetValidationStatus = 'GRID-API-08001',
        API_FailedSetValidationStatusByKey = 'GRID-API-08002',
        // FILTER
        API_FailedFilterCollumnNotFound = 'GRID-API-09001',
        API_FailedFilterSearch = 'GRID-API-09002',
        API_FailedFilterActivate = 'GRID-API-09003',
        API_FailedFilterClear = 'GRID-API-09004',
        API_FailedFilterDeactivate = 'GRID-API-09005',
        API_FailedFilterByCondition = 'GRID-API-09006',
        API_FailedFilterByValue = 'GRID-API-09007',
        API_FailedFilterSetColumnFilterOptions = 'GRID-API-09008',
        //COLUMNS
        API_FailedSetColumnAggregate = 'GRID-API-10001',
        API_FailedFreezeColumns = 'GRID-API-10002',
        API_FailedFreezeColumnsByActiveCell = 'GRID-API-10003',
        API_FailedHasFrozenColumns = 'GRID-API-10004',
        API_FailedUnfreezeColumns = 'GRID-API-10005',
        API_FailedAllowCellMerging = 'GRID-API-10006',
        API_FailedAddColumnToGroupPanel = 'GRID-API-10007',
        API_FailedSetColumnWordWrap = 'GRID-API-10008',
        //EXPORT
        API_FailedCustomizeExportingMessage = 'GRID-API-11001',
        //COLUMNPICKER
        API_FailedSetColumnVisibility = 'GRID-API-10001'
    }
}
