namespace OutSystems.GridAPI.Pagination {
    /**
     *
     *
     * @export
     * @param {string} gridID
     * @param {number} n
     * @returns {*}  {void}
     */
    export function ChangePageSize(gridID: string, n: number): void {
        Performance.SetMark('Pagination.ChangePageSize');

        if (!OSFramework.DataGrid.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.pagination.changePageSize(n);

        Performance.SetMark('Pagination.ChangePageSize-end');
        Performance.GetMeasure(
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
            OSFramework.DataGrid.Event.Grid.GridEventType.Initialized,
            (_gridId: string, gridObj: OSFramework.DataGrid.Grid.IGrid) => {
                Performance.SetMark('Pagination.CreatePageButtons');
                gridObj.features.pagination.createPageButtons(
                    phID,
                    buttonQuantity
                );

                Performance.SetMark('Pagination.CreatePageButtons-end');
                Performance.GetMeasure(
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
        Performance.SetMark('Pagination.GetCurrentPage');

        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode:
                OSFramework.DataGrid.Enum.ErrorCodes
                    .API_FailedPaginationGetCurrentPage,
            hasValue: true,
            callback: () => {
                if (!OSFramework.DataGrid.Helper.IsGridReady(gridID)) {
                    throw new Error(
                        OSFramework.DataGrid.Enum.ErrorMessages.Grid_NotFound
                    );
                }

                const grid = GridManager.GetGridById(gridID);

                // we don't want to return page index if there is server side pagination
                if (grid.config.serverSidePagination) {
                    throw new Error(
                        'It seems that you have server side pagination turned on. Switch it off and try again'
                    );
                }
                return grid.features.pagination.pageIndex;
            }
        });

        Performance.SetMark('Pagination.GetCurrentPage-end');
        Performance.GetMeasure(
            '@datagrid-Pagination.GetCurrentPage',
            'Pagination.GetCurrentPage',
            'Pagination.GetCurrentPage-end'
        );

        return result;
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     * @returns {*}  {void}
     */
    export function MoveToFirstPage(gridID: string): void {
        Performance.SetMark('Pagination.MoveToFirstPage');

        if (!OSFramework.DataGrid.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.pagination.moveToFirstPage();

        Performance.SetMark('Pagination.MoveToFirstPage-end');
        Performance.GetMeasure(
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
        Performance.SetMark('Pagination.MoveToLastPage');

        if (!OSFramework.DataGrid.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.pagination.moveToLastPage();

        Performance.SetMark('Pagination.MoveToLastPage-end');
        Performance.GetMeasure(
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
        Performance.SetMark('Pagination.MoveToNextPage');

        if (!OSFramework.DataGrid.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.pagination.moveToNextPage();

        Performance.SetMark('Pagination.MoveToNextPage-end');
        Performance.GetMeasure(
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
        Performance.SetMark('Pagination.MoveToPage');
        let returnMessage =
            new OSFramework.DataGrid.OSStructure.ReturnMessage();

        if (!OSFramework.DataGrid.Helper.IsGridReady(gridID)) {
            returnMessage = {
                isSuccess: false,
                message: OSFramework.DataGrid.Enum.ErrorMessages.Grid_NotFound,
                code: OSFramework.DataGrid.Enum.ErrorCodes.CFG_GridNotFound
            };
            return JSON.stringify(returnMessage);
        }

        const grid = GridManager.GetGridById(gridID);
        let isSuccess = true;
        let message: string;
        let code: OSFramework.DataGrid.Enum.ErrorCodes;

        // we don't want to set page index if there is server side pagination
        if (grid.config.serverSidePagination) {
            isSuccess = false;
            message =
                'It seems that you have server side pagination turned on. Switch it off and try again';
            code =
                OSFramework.DataGrid.Enum.ErrorCodes
                    .API_FailedPaginationSetCurrentPage;
        }

        isSuccess = grid.features.pagination.moveToPage(n);

        returnMessage = {
            isSuccess,
            message,
            code
        };

        Performance.SetMark('Pagination.MoveToPage-end');
        Performance.GetMeasure(
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
        Performance.SetMark('Pagination.MoveToPreviousPage');

        if (!OSFramework.DataGrid.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.pagination.moveToPreviousPage();

        Performance.SetMark('Pagination.MoveToPreviousPage-end');
        Performance.GetMeasure(
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
            OSFramework.DataGrid.Event.Grid.GridEventType.Initialized,
            (_gridId: string, gridObj: OSFramework.DataGrid.Grid.IGrid) => {
                Performance.SetMark('Pagination.RegisterCurrentPageLabel');
                gridObj.features.pagination.registerLabel(
                    OSFramework.DataGrid.Enum.PageLabel.PageIndex,
                    phID
                );

                Performance.SetMark('Pagination.RegisterCurrentPageLabel-end');
                Performance.GetMeasure(
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
            OSFramework.DataGrid.Event.Grid.GridEventType.Initialized,
            (_gridId: string, gridObj: OSFramework.DataGrid.Grid.IGrid) => {
                Performance.SetMark('Pagination.RegisterPageCountLabel');
                gridObj.features.pagination.registerLabel(
                    OSFramework.DataGrid.Enum.PageLabel.PageCount,
                    phID
                );

                Performance.SetMark('Pagination.RegisterPageCountLabel-end');
                Performance.GetMeasure(
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
            OSFramework.DataGrid.Event.Grid.GridEventType.Initialized,
            (_gridId: string, gridObj: OSFramework.DataGrid.Grid.IGrid) => {
                Performance.SetMark('Pagination.RegisterPageSizeLabel');
                gridObj.features.pagination.registerLabel(
                    OSFramework.DataGrid.Enum.PageLabel.PageSize,
                    phID
                );

                Performance.SetMark('Pagination.RegisterPageSizeLabel-end');
                Performance.GetMeasure(
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
            OSFramework.DataGrid.Event.Grid.GridEventType.Initialized,
            (_gridId: string, gridObj: OSFramework.DataGrid.Grid.IGrid) => {
                Performance.SetMark('Pagination.RegisterRowEndLabel');
                gridObj.features.pagination.registerLabel(
                    OSFramework.DataGrid.Enum.PageLabel.RowEnd,
                    phID
                );

                Performance.SetMark('Pagination.RegisterRowEndLabel-end');
                Performance.GetMeasure(
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
            OSFramework.DataGrid.Event.Grid.GridEventType.Initialized,
            (_gridId: string, gridObj: OSFramework.DataGrid.Grid.IGrid) => {
                Performance.SetMark('Pagination.RegisterRowStartLabel');
                gridObj.features.pagination.registerLabel(
                    OSFramework.DataGrid.Enum.PageLabel.RowStart,
                    phID
                );

                Performance.SetMark('Pagination.RegisterRowStartLabel-end');
                Performance.GetMeasure(
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
            OSFramework.DataGrid.Event.Grid.GridEventType.Initialized,
            (_gridId: string, gridObj: OSFramework.DataGrid.Grid.IGrid) => {
                Performance.SetMark('Pagination.RegisterRowTotalLabel');
                gridObj.features.pagination.registerLabel(
                    OSFramework.DataGrid.Enum.PageLabel.RowTotal,
                    phID
                );

                Performance.SetMark('Pagination.RegisterRowTotalLabel-end');
                Performance.GetMeasure(
                    '@datagrid-Pagination.RegisterRowTotalLabel',
                    'Pagination.RegisterRowTotalLabel',
                    'Pagination.RegisterRowTotalLabel-end'
                );
            }
        );
    }
}
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
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Pagination.ChangePageSize()'`
        );
        return OutSystems.GridAPI.Pagination.ChangePageSize(gridID, n);
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
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Pagination.CreatePageButtons()'`
        );
        return OutSystems.GridAPI.Pagination.CreatePageButtons(
            gridID,
            phID,
            buttonQuantity
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
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Pagination.GetCurrentPage()'`
        );
        return OutSystems.GridAPI.Pagination.GetCurrentPage(gridID);
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     * @returns {*}  {void}
     */
    export function MoveToFirstPage(gridID: string): void {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Pagination.MoveToFirstPage()'`
        );
        return OutSystems.GridAPI.Pagination.MoveToFirstPage(gridID);
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     * @returns {*}  {void}
     */
    export function MoveToLastPage(gridID: string): void {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Pagination.MoveToLastPage()'`
        );
        return OutSystems.GridAPI.Pagination.MoveToLastPage(gridID);
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     * @returns {*}  {void}
     */
    export function MoveToNextPage(gridID: string): void {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Pagination.MoveToNextPage()'`
        );
        return OutSystems.GridAPI.Pagination.MoveToNextPage(gridID);
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
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Pagination.MoveToPage()'`
        );
        return OutSystems.GridAPI.Pagination.MoveToPage(gridID, n);
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     * @returns {*}  {void}
     */
    export function MoveToPreviousPage(gridID: string): void {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Pagination.MoveToPreviousPage()'`
        );
        return OutSystems.GridAPI.Pagination.MoveToPreviousPage(gridID);
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
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Pagination.RegisterCurrentPageLabel()'`
        );
        return OutSystems.GridAPI.Pagination.RegisterCurrentPageLabel(
            gridID,
            phID
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
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Pagination.RegisterPageCountLabel()'`
        );
        return OutSystems.GridAPI.Pagination.RegisterPageCountLabel(
            gridID,
            phID
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
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Pagination.RegisterPageSizeLabel()'`
        );
        return OutSystems.GridAPI.Pagination.RegisterPageSizeLabel(
            gridID,
            phID
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
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Pagination.RegisterRowEndLabel()'`
        );
        return OutSystems.GridAPI.Pagination.RegisterRowEndLabel(gridID, phID);
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     * @param {string} phID
     */
    export function RegisterRowStartLabel(gridID: string, phID: string): void {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Pagination.RegisterRowStartLabel()'`
        );
        return OutSystems.GridAPI.Pagination.RegisterRowStartLabel(
            gridID,
            phID
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
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Pagination.RegisterRowTotalLabel()'`
        );
        return OutSystems.GridAPI.Pagination.RegisterRowTotalLabel(
            gridID,
            phID
        );
    }
}
