namespace OSFramework.Feature {
    export interface IPagination {
        pageCount: number;
        pageIndex: number;
        pageSize: number;
        rowEnd: number;
        rowStart: number;
        rowTotal: number;

        changePageSize(n: number): void;
        createPageButtons(phId: string, qtde: number): void;
        executeAction(action: PageAction): boolean;
        getValueByLabel(label: PageLabel): number;
        moveToFirstPage(): boolean;
        moveToLastPage(): boolean;
        moveToNextPage(): boolean;
        moveToPage(n: number): boolean;
        moveToPreviousPage(): boolean;
        registerLabel(label: PageLabel, phId: string): void;
    }
}
