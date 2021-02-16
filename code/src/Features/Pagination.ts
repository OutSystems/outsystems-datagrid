// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Features {

    enum PageAction {
        FirstPage = 'FirstPage',
        Forward = 'Forward',
        LastPage = 'LastPage',
        Previous = 'Previous'
    }

    export enum PageLabel {
        PageCount = 'PageCount',
        PageIndex = 'PageIndex',
        PageSize = 'PageSize',
        RowEnd = 'RowEnd',
        RowStart = 'RowStart',
        RowTotal = 'RowTotal'
    }

    class PaginationAction extends wijmo.undo.UndoableAction {
        private _grid: wijmo.grid.FlexGrid;

        constructor(grid: wijmo.grid.FlexGrid) {
            super(grid.itemsSource);

            this._grid = grid;
            this._oldState = grid.itemsSource.pageIndex;
        }

        // apply a saved cell value (state)
        public applyState(state: number): void {
            this.target.moveToPage(state);
            this._grid.focus();
        }

        // close the action saving the new value
        public close(): boolean {
            this._newState = this._grid.itemsSource.pageIndex;
            return this._newState !== this._oldState;
        }
    }

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

    export class Pagination implements IPagination, IBuilder, IDisposable {
        private _grid: Grid.IGridWijmo;
        private _pageSize: number;
        private _phId: string;
        private _qtdeButtons: number;
        private _view: wijmo.collections.CollectionView;

        constructor(grid: Grid.IGridWijmo, pageSize: number) {
            this._grid = grid;
            this._view = grid.provider.itemsSource;
            this._pageSize = pageSize;
        }

        private _update(): void {
            if (this._phId) {
                this.createPageButtons(this._phId, this._qtdeButtons);
            }
        }

        public build(): void {
            this._view.pageSize = this._pageSize;

            this._view.pageChanging.addHandler(() =>
                this._grid.features.undoStack.startAction(
                    new PaginationAction(this._grid.provider)
                )
            );
            this._view.pageChanged.addHandler(() =>
                this._grid.features.undoStack.closeAction(PaginationAction)
            );

            this._view.collectionChanged.addHandler(() => this._update());
        }

        public get rowStart(): number {
            return this.pageIndex * this.pageSize + 1;
        }

        public get rowEnd(): number {
            return this.rowStart + this._view.itemCount - 1;
        }

        /// Retrieve the total number of rows considering all pages
        public get rowTotal(): number {
            return this._view.totalItemCount;
        }

        public get pageSize(): number {
            return this._view.pageSize;
        }

        public get pageCount(): number {
            return this._view.pageCount;
        }

        public get pageIndex(): number {
            return this._view.pageIndex;
        }

        public changePageSize(n: number): void {
            this._view.pageSize = n;
        }

        public createPageButtons(phId: string, qtde: number): void {
            this._phId = phId;
            this._qtdeButtons = qtde;

            const currPage = this.pageIndex; //Page Index
            const nBt = Math.floor(qtde / 2); // Number of Buttons

            // by default the firstIndex will always be the first page and lastIndex will be the last page
            let firstIndex = 0;
            let lastIndex = this.pageCount - 1;

            let showFirstPage = false;
            let showLastPage = false;

            const isOnFirstPages = currPage < qtde;
            const isOnLastPages = currPage >= this.pageCount - qtde;

            // this was defined by UI team
            if (this.pageCount > 5) {
                if (isOnFirstPages) {
                    firstIndex = 0;
                    lastIndex = firstIndex + qtde;

                    showLastPage = true;
                } else if (isOnLastPages) {
                    firstIndex = this.pageCount - 1 - qtde;
                    lastIndex = this.pageCount - 1;

                    showFirstPage = true;
                } else {
                    firstIndex = isOnFirstPages ? 1 : currPage - nBt;
                    lastIndex = currPage + nBt;

                    showFirstPage = true;
                    showLastPage = true;
                }
            }

            const parent = document.getElementById(phId); //OS defining a css class to be found. This needs to be re-think when having multiple grids on the same page, probably

            if (!parent) return;

            const newButton = (innerText, i) => {
                const btn = document.createElement('button');
                btn.innerText = innerText;
                btn.setAttribute('type', 'button');
                btn.setAttribute('class', 'datagrid-pagination-button');
                btn.onclick = () =>
                    this._grid.features.pagination.moveToPage(i);

                //The current selected button-page
                if (i === currPage) {
                    btn.classList.add('datagrid-pagination-selected-page');
                }

                parent.appendChild(btn);
            };

            const newSpan = (innerText) => {
                const span = document.createElement('span');
                span.innerText = innerText;
                span.setAttribute('class', 'datagrid-pagination-ellipsis');
                parent.appendChild(span);
            };

            new Array(...parent.childNodes).map((p) => parent.removeChild(p));

            if (showFirstPage) {
                newButton(1, 0);
                newSpan('...');
            }

            for (let i = firstIndex; i <= lastIndex; i++) {
                newButton(i + 1, i);
            }

            if (showLastPage) {
                newSpan('...');
                newButton(this.pageCount, this.pageCount - 1);
            }
        }

        public dispose(): void {
            this._view = undefined;
        }

        public executeAction(action: PageAction): boolean {
            switch (action) {
                case PageAction.FirstPage:
                    return this.moveToFirstPage();
                case PageAction.Previous:
                    return this.moveToPreviousPage();
                case PageAction.Forward:
                    return this.moveToNextPage();
                case PageAction.LastPage:
                    return this.moveToLastPage();
                default:
                    break;
            }
        }

        public getValueByLabel(label: PageLabel): number {
            switch (label) {
                case PageLabel.PageCount:
                    return this.pageCount;
                case PageLabel.PageIndex:
                    return this.pageIndex + 1;
                case PageLabel.PageSize:
                    return this.pageSize;
                case PageLabel.RowEnd:
                    return this.rowEnd;
                case PageLabel.RowStart:
                    return this.rowStart;
                case PageLabel.RowTotal:
                    return this.rowTotal;
                default:
                    break;
            }
        }

        public moveToFirstPage(): boolean {
            return this._view.moveToFirstPage();
        }

        public moveToLastPage(): boolean {
            return this._view.moveToLastPage();
        }

        public moveToNextPage(): boolean {
            return this._view.moveToNextPage();
        }

        public moveToPage(n: number): boolean {
            return this._view.moveToPage(n);
        }

        public moveToPreviousPage(): boolean {
            return this._view.moveToPreviousPage();
        }

        public registerLabel(label: PageLabel, phId: string): void {
            this._view.collectionChanged.addHandler(() => {
                const element = document.getElementById(phId);

                if (element)
                    element.textContent = this.getValueByLabel(
                        label
                    ).toString();
            });
        }
    }
}
