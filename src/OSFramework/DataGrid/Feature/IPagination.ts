// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Feature {
	/**
	 * Accessible labels of the page buttons. Each label is a template where "{0}" is replaced by the page number,
	 * so translations can place the number wherever the language requires it.
	 */
	export type PageButtonLabels = {
		currentPage?: string;
		goToPage?: string;
	};

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
		setPageButtonLabels(labels: PageButtonLabels): void;
	}
}
