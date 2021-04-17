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
        executeAction(action: OSFramework.Enum.PageAction): boolean;
        getValueByLabel(label: OSFramework.Enum.PageLabel): number;
        moveToFirstPage(): boolean;
        moveToLastPage(): boolean;
        moveToNextPage(): boolean;
        moveToPage(n: number): boolean;
        moveToPreviousPage(): boolean;
        registerLabel(label: OSFramework.Enum.PageLabel, phId: string): void;
    }
}
