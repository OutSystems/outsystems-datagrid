/**
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.Pagination {
    /**
     *
     *
     * @export
     * @param {string} gridID
     * @param {number} n
     * @returns {*}  {void}
     */
    export function ChangePageSize(gridID: string, n: number): void {
        PerformanceAPI.SetMark('Pagination.ChangePageSize');

        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.pagination.changePageSize(n);

        PerformanceAPI.SetMark('Pagination.ChangePageSize-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Pagination.ChangePageSize',
            'Pagination.ChangePageSize',
            'Pagination.ChangePageSize-end'
        );
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     * @param {string} phID
     * @param {number} buttonQuantity
     */
    export function CreatePageButtons(
        gridID: string,
        phID: string,
        buttonQuantity: number
    ): void {
        GridManager.Events.Subscribe(
            gridID,
            OSFramework.Event.Grid.GridEventType.Initialized,
            (gridId: string, gridObj: OSFramework.Grid.IGrid) => {
                PerformanceAPI.SetMark('Pagination.CreatePageButtons');
                gridObj.features.pagination.createPageButtons(
                    phID,
                    buttonQuantity
                );

                PerformanceAPI.SetMark('Pagination.CreatePageButtons-end');
                PerformanceAPI.GetMeasure(
                    '@datagrid-Pagination.CreatePageButtons',
                    'Pagination.CreatePageButtons',
                    'Pagination.CreatePageButtons-end'
                );
            }
        );
    }

    /**
     * Gets the current page Index of the DataGrid.
     *
     * @export
     * @param {string} gridID Id of the Grid from which to obtain the pagination Index
     * @return {*}  {string} Stringified JSON structure containing Index of the current page, error message and code, and success boolean
     */
    export function GetCurrentPage(gridID: string): string {
        PerformanceAPI.SetMark('Pagination.GetCurrentPage');
        let returnMessage = new OSFramework.OSStructure.ReturnMessage();

        if (!OSFramework.Helper.IsGridReady(gridID)) {
            returnMessage = {
                value: -1,
                isSuccess: false,
                message: OSFramework.Enum.ErrorMessages.Grid_NotFound,
                code: OSFramework.Enum.ErrorCodes.CFG_GridNotFound
            };
            return JSON.stringify(returnMessage);
        }

        const grid = GridManager.GetGridById(gridID);

        let value = grid.features.pagination.pageIndex;
        let isSuccess = true;
        let message: string;
        let code: OSFramework.Enum.ErrorCodes;

        // we don't want to return page index if there is server side pagination
        if (grid.config.serverSidePagination) {
            value = 0;
            isSuccess = false;
            message =
                'It seems that you have server side pagination turned on. Switch it off and try again';
            code =
                OSFramework.Enum.ErrorCodes.API_FailedPaginationGetCurrentPage;
        }

        returnMessage = {
            value,
            isSuccess,
            message,
            code
        };

        PerformanceAPI.SetMark('Pagination.GetCurrentPage-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Pagination.GetCurrentPage',
            'Pagination.GetCurrentPage',
            'Pagination.GetCurrentPage-end'
        );

        return JSON.stringify(returnMessage);
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     * @returns {*}  {void}
     */
    export function MoveToFirstPage(gridID: string): void {
        PerformanceAPI.SetMark('Pagination.MoveToFirstPage');

        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.pagination.moveToFirstPage();

        PerformanceAPI.SetMark('Pagination.MoveToFirstPage-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Pagination.MoveToFirstPage',
            'Pagination.MoveToFirstPage',
            'Pagination.MoveToFirstPage-end'
        );
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     * @returns {*}  {void}
     */
    export function MoveToLastPage(gridID: string): void {
        PerformanceAPI.SetMark('Pagination.MoveToLastPage');

        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.pagination.moveToLastPage();

        PerformanceAPI.SetMark('Pagination.MoveToLastPage-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Pagination.MoveToLastPage',
            'Pagination.MoveToLastPage',
            'Pagination.MoveToLastPage-end'
        );
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     * @returns {*}  {void}
     */
    export function MoveToNextPage(gridID: string): void {
        PerformanceAPI.SetMark('Pagination.MoveToNextPage');

        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.pagination.moveToNextPage();

        PerformanceAPI.SetMark('Pagination.MoveToNextPage-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Pagination.MoveToNextPage',
            'Pagination.MoveToNextPage',
            'Pagination.MoveToNextPage-end'
        );
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     * @param {number} n
     * @returns {*}  {string} Stringified JSON structure containing error message and code, and success boolean
     */
    export function MoveToPage(gridID: string, n: number): string {
        PerformanceAPI.SetMark('Pagination.MoveToPage');
        let returnMessage = new OSFramework.OSStructure.ReturnMessage();

        if (!OSFramework.Helper.IsGridReady(gridID)) {
            returnMessage = {
                isSuccess: false,
                message: OSFramework.Enum.ErrorMessages.Grid_NotFound,
                code: OSFramework.Enum.ErrorCodes.CFG_GridNotFound
            };
            return JSON.stringify(returnMessage);
        }

        const grid = GridManager.GetGridById(gridID);
        let isSuccess = true;
        let message: string;
        let code: OSFramework.Enum.ErrorCodes;

        // we don't want to set page index if there is server side pagination
        if (grid.config.serverSidePagination) {
            isSuccess = false;
            message =
                'It seems that you have server side pagination turned on. Switch it off and try again';
            code =
                OSFramework.Enum.ErrorCodes.API_FailedPaginationSetCurrentPage;
        }

        isSuccess = grid.features.pagination.moveToPage(n);

        returnMessage = {
            isSuccess,
            message,
            code
        };

        PerformanceAPI.SetMark('Pagination.MoveToPage-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Pagination.MoveToPage',
            'Pagination.MoveToPage',
            'Pagination.MoveToPage-end'
        );

        return JSON.stringify(returnMessage);
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     * @returns {*}  {void}
     */
    export function MoveToPreviousPage(gridID: string): void {
        PerformanceAPI.SetMark('Pagination.MoveToPreviousPage');

        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.pagination.moveToPreviousPage();

        PerformanceAPI.SetMark('Pagination.MoveToPreviousPage-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Pagination.MoveToPreviousPage',
            'Pagination.MoveToPreviousPage',
            'Pagination.MoveToPreviousPage-end'
        );
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     * @param {string} phID
     */
    export function RegisterCurrentPageLabel(
        gridID: string,
        phID: string
    ): void {
        GridManager.Events.Subscribe(
            gridID,
            OSFramework.Event.Grid.GridEventType.Initialized,
            (gridId: string, gridObj: OSFramework.Grid.IGrid) => {
                PerformanceAPI.SetMark('Pagination.RegisterCurrentPageLabel');
                gridObj.features.pagination.registerLabel(
                    OSFramework.Enum.PageLabel.PageIndex,
                    phID
                );

                PerformanceAPI.SetMark(
                    'Pagination.RegisterCurrentPageLabel-end'
                );
                PerformanceAPI.GetMeasure(
                    '@datagrid-Pagination.RegisterCurrentPageLabel',
                    'Pagination.RegisterCurrentPageLabel',
                    'Pagination.RegisterCurrentPageLabel-end'
                );
            }
        );
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     * @param {string} phID
     */
    export function RegisterPageCountLabel(gridID: string, phID: string): void {
        GridManager.Events.Subscribe(
            gridID,
            OSFramework.Event.Grid.GridEventType.Initialized,
            (gridId: string, gridObj: OSFramework.Grid.IGrid) => {
                PerformanceAPI.SetMark('Pagination.RegisterPageCountLabel');
                gridObj.features.pagination.registerLabel(
                    OSFramework.Enum.PageLabel.PageCount,
                    phID
                );

                PerformanceAPI.SetMark('Pagination.RegisterPageCountLabel-end');
                PerformanceAPI.GetMeasure(
                    '@datagrid-Pagination.RegisterPageCountLabel',
                    'Pagination.RegisterPageCountLabel',
                    'Pagination.RegisterPageCountLabel-end'
                );
            }
        );
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     * @param {string} phID
     */
    export function RegisterPageSizeLabel(gridID: string, phID: string): void {
        GridManager.Events.Subscribe(
            gridID,
            OSFramework.Event.Grid.GridEventType.Initialized,
            (gridId: string, gridObj: OSFramework.Grid.IGrid) => {
                PerformanceAPI.SetMark('Pagination.RegisterPageSizeLabel');
                gridObj.features.pagination.registerLabel(
                    OSFramework.Enum.PageLabel.PageSize,
                    phID
                );

                PerformanceAPI.SetMark('Pagination.RegisterPageSizeLabel-end');
                PerformanceAPI.GetMeasure(
                    '@datagrid-Pagination.RegisterPageSizeLabel',
                    'Pagination.RegisterPageSizeLabel',
                    'Pagination.RegisterPageSizeLabel-end'
                );
            }
        );
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     * @param {string} phID
     */
    export function RegisterRowEndLabel(gridID: string, phID: string): void {
        GridManager.Events.Subscribe(
            gridID,
            OSFramework.Event.Grid.GridEventType.Initialized,
            (gridId: string, gridObj: OSFramework.Grid.IGrid) => {
                PerformanceAPI.SetMark('Pagination.RegisterRowEndLabel');
                gridObj.features.pagination.registerLabel(
                    OSFramework.Enum.PageLabel.RowEnd,
                    phID
                );

                PerformanceAPI.SetMark('Pagination.RegisterRowEndLabel-end');
                PerformanceAPI.GetMeasure(
                    '@datagrid-Pagination.RegisterRowEndLabel',
                    'Pagination.RegisterRowEndLabel',
                    'Pagination.RegisterRowEndLabel-end'
                );
            }
        );
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     * @param {string} phID
     */
    export function RegisterRowStartLabel(gridID: string, phID: string): void {
        GridManager.Events.Subscribe(
            gridID,
            OSFramework.Event.Grid.GridEventType.Initialized,
            (gridId: string, gridObj: OSFramework.Grid.IGrid) => {
                PerformanceAPI.SetMark('Pagination.RegisterRowStartLabel');
                gridObj.features.pagination.registerLabel(
                    OSFramework.Enum.PageLabel.RowStart,
                    phID
                );

                PerformanceAPI.SetMark('Pagination.RegisterRowStartLabel-end');
                PerformanceAPI.GetMeasure(
                    '@datagrid-Pagination.RegisterRowStartLabel',
                    'Pagination.RegisterRowStartLabel',
                    'Pagination.RegisterRowStartLabel-end'
                );
            }
        );
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     * @param {string} phID
     */
    export function RegisterRowTotalLabel(gridID: string, phID: string): void {
        GridManager.Events.Subscribe(
            gridID,
            OSFramework.Event.Grid.GridEventType.Initialized,
            (gridId: string, gridObj: OSFramework.Grid.IGrid) => {
                PerformanceAPI.SetMark('Pagination.RegisterRowTotalLabel');
                gridObj.features.pagination.registerLabel(
                    OSFramework.Enum.PageLabel.RowTotal,
                    phID
                );

                PerformanceAPI.SetMark('Pagination.RegisterRowTotalLabel-end');
                PerformanceAPI.GetMeasure(
                    '@datagrid-Pagination.RegisterRowTotalLabel',
                    'Pagination.RegisterRowTotalLabel',
                    'Pagination.RegisterRowTotalLabel-end'
                );
            }
        );
    }
}
