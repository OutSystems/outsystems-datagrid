// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    export class Export implements IExport, IBuilder {
        private _curPage: number;
        private _grid: WijmoProvider.Grid.IGridWijmo;
        private _pageSize: number;

        constructor(grid: WijmoProvider.Grid.IGridWijmo) {
            this._grid = grid;
        }

        //Return CellRange considering all rows and columns
        private _getFullCellRange(): wijmo.grid.CellRange {
            const rowsNumber = this._grid.provider.rows.length;
            const colsNumber = this._grid.provider.columns.length;
            return new wijmo.grid.CellRange(
                0,
                0,
                rowsNumber - 1,
                colsNumber - 1
            );
        }

        //Then re-apply the pagination
        private _reApplyPagination(): void {
            this._grid.features.pagination.changePageSize(this._pageSize);
            this._grid.features.pagination.moveToPage(this._curPage);
        }

        //Exporting to Excel Consider only the current page, so we need to remove the pagination first of all
        private _resetPagination(): void {
            this._pageSize = this._grid.features.pagination.pageSize;
            this._curPage = this._grid.features.pagination.pageIndex;
            this._grid.features.pagination.moveToFirstPage();
            this._grid.features.pagination.changePageSize(0);
        }

        public build(): void {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public exportFormatItem(args: any): void {
            const p = args.panel;
            //const row = args.row;
            const col = args.col;
            const xlsxCell = args.xlsxCell;

            if (p.cellType === wijmo.grid.CellType.RowHeader && col === 0) {
                const cell = args.getFormattedCell();
                xlsxCell.value = cell.textContent.trim(); // Set autonumber index
            } /*else if (p.cellType === wijmo.grid.CellType.Cell) {
                //future usage
            } else if (p.cellType === wijmo.grid.CellType.ColumnHeader) {
                //future usage
            }*/
        }

        public exportToClipboard(withHeaders: boolean): void {
            const result = this._grid.provider.getClipString(
                null,
                false,
                withHeaders
            );
            wijmo.Clipboard.copy(result);
        }

        public exportToCsv(): void {
            this._resetPagination();

            const params = { fileName: 'DataGridReactive.csv' };
            const result = this._grid.provider.getClipString(
                this._getFullCellRange(),
                true,
                true
            );

            this._reApplyPagination();
            wijmo.saveFile(result, params.fileName);
        }

        public exportToExcel(withStyles: boolean): void {
            this._resetPagination();

            const params = {
                includeColumnHeaders: true,
                includeRowHeaders: true,
                includeCellStyles: withStyles,
                formatItem: this.exportFormatItem
            };

            const book = wijmo.grid.xlsx.FlexGridXlsxConverter.save(
                this._grid.provider,
                params
            );
            //name the sheet
            book.sheets[0].name = 'DataGrid Data';
            // save the book
            book.save('DataGridReactive.xlsx');

            this._reApplyPagination();
        }
    }
}
