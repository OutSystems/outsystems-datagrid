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
     * @return {*}  {number} Index of the current page, 0 based. Return -1 if the Grid is not yet initialized.
     */
    export function GetCurrentPage(gridID: string): string {
        PerformanceAPI.SetMark('Pagination.GetCurrentPage');
        let output = '';

        if (!OSFramework.Helper.IsGridReady(gridID)) {
            return JSON.stringify({
                value: -1,
                isSuccess: false,
                message: 'Grid not found',
                code: OSFramework.Enum.ErrorCodes.CFG_GridNotFound
            });
        }

        const grid = GridManager.GetGridById(gridID);
        output = JSON.stringify(grid.features.pagination.getCurrentPage());

        PerformanceAPI.SetMark('Pagination.GetCurrentPage-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Pagination.GetCurrentPage',
            'Pagination.GetCurrentPage',
            'Pagination.GetCurrentPage-end'
        );

        return output;
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
     * @returns {*}  {void}
     */
    export function MoveToPage(gridID: string, n: number): string {
        PerformanceAPI.SetMark('Pagination.MoveToPage');
        let output = '';

        if (!OSFramework.Helper.IsGridReady(gridID)) {
            return JSON.stringify({
                isSuccess: false,
                message: 'Grid not found',
                code: OSFramework.Enum.ErrorCodes.CFG_GridNotFound
            });
        }

        const grid = GridManager.GetGridById(gridID);
        output = JSON.stringify(grid.features.pagination.moveToPage(n));

        PerformanceAPI.SetMark('Pagination.MoveToPage-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Pagination.MoveToPage',
            'Pagination.MoveToPage',
            'Pagination.MoveToPage-end'
        );

        return output;
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
