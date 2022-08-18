// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        executeAction(action: Enum.PageAction): boolean;
        getValueByLabel(label: Enum.PageLabel): number;
        moveToFirstPage(): boolean;
        moveToLastPage(): boolean;
        moveToNextPage(): boolean;
        moveToPage(n: number): boolean;
        moveToPreviousPage(): boolean;
        registerLabel(label: Enum.PageLabel, phId: string): void;
    }
}
