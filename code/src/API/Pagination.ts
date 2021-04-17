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
        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.pagination.changePageSize(n);
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
            OSFramework.Event.GridEventType.Initialized,
            (gridId: string, gridObj: OSFramework.Grid.IGrid) => {
                gridObj.features.pagination.createPageButtons(
                    phID,
                    buttonQuantity
                );
            }
        );
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     * @returns {*}  {void}
     */
    export function MoveToFirstPage(gridID: string): void {
        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.pagination.moveToFirstPage();
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     * @returns {*}  {void}
     */
    export function MoveToLastPage(gridID: string): void {
        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.pagination.moveToLastPage();
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     * @returns {*}  {void}
     */
    export function MoveToNextPage(gridID: string): void {
        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.pagination.moveToNextPage();
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     * @param {number} n
     * @returns {*}  {void}
     */
    export function MoveToPage(gridID: string, n: number): void {
        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.pagination.moveToPage(n);
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     * @returns {*}  {void}
     */
    export function MoveToPreviousPage(gridID: string): void {
        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.pagination.moveToPreviousPage();
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
            OSFramework.Event.GridEventType.Initialized,
            (gridId: string, gridObj: OSFramework.Grid.IGrid) => {
                gridObj.features.pagination.registerLabel(
                    OSFramework.Feature.Auxiliar.PageLabel.PageIndex,
                    phID
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
            OSFramework.Event.GridEventType.Initialized,
            (gridId: string, gridObj: OSFramework.Grid.IGrid) => {
                gridObj.features.pagination.registerLabel(
                    OSFramework.Feature.Auxiliar.PageLabel.PageCount,
                    phID
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
            OSFramework.Event.GridEventType.Initialized,
            (gridId: string, gridObj: OSFramework.Grid.IGrid) => {
                gridObj.features.pagination.registerLabel(
                    OSFramework.Feature.Auxiliar.PageLabel.PageSize,
                    phID
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
            OSFramework.Event.GridEventType.Initialized,
            (gridId: string, gridObj: OSFramework.Grid.IGrid) => {
                gridObj.features.pagination.registerLabel(
                    OSFramework.Feature.Auxiliar.PageLabel.RowEnd,
                    phID
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
            OSFramework.Event.GridEventType.Initialized,
            (gridId: string, gridObj: OSFramework.Grid.IGrid) => {
                gridObj.features.pagination.registerLabel(
                    OSFramework.Feature.Auxiliar.PageLabel.RowStart,
                    phID
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
            OSFramework.Event.GridEventType.Initialized,
            (gridId: string, gridObj: OSFramework.Grid.IGrid) => {
                gridObj.features.pagination.registerLabel(
                    OSFramework.Feature.Auxiliar.PageLabel.RowTotal,
                    phID
                );
            }
        );
    }
}
