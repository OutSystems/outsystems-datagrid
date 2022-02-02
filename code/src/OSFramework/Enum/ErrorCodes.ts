// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Enum {
    /**
     * Codes that get the associated to specific returning messages indicated wheter the action had success or not.
     */
    export enum ErrorCodes {
        GRID_SUCCESS = 200,
        // Error Codes - CONFiguration errors - Any error related with missing or wrong configuration of the application.
        CFG_GridNotFound = 'GRID-CFG-01001',

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
        // VIEW
        API_FailedGetViewLayout = 'GRID-API-03001',
        API_FailedSetViewLayout = 'GRID-API-03002',
        // SELECTION
        API_FailedGetAllSelections = 'GRID-API-05001',
        API_FailedGetAllSelectionsData = 'GRID-API-05002',
        API_FailedGetCheckedRowsData = 'GRID-API-05003',
        API_FailedGetSelectedRowsCount = 'GRID-API-05004',
        API_FailedGetSelectedRowsData = 'GRID-API-05005',
        API_FailedHasSelectedRows = 'GRID-API-05006'
    }
}
