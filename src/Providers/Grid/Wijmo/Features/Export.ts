// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    export class Export
        implements OSFramework.Feature.IExport, OSFramework.Interface.IBuilder
    {
        private _curPage: number;
        private _grid: Grid.IGridWijmo;
        private _hasLoadingMessage = true;
        private _loadingMessage = 'Your data is being exported.';
        private _pageSize: number;

        constructor(grid: Grid.IGridWijmo) {
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

        private _handleFilename(fileName: string, isCSV = false): string {
            if (fileName === undefined || fileName === '') {
                fileName = 'DataGridReactive';
            }

            return `${fileName}.${isCSV ? 'csv' : 'xlsx'}`;
        }
        //Then re-apply the pagination
        private _reApplyPagination(): void {
            this._grid.features.pagination.changePageSize(this._pageSize);
            this._grid.features.pagination.moveToPage(this._curPage);
        }

        private _removeLoadingMessage() {
            const loadingMessageElem = OSFramework.Helper.GetElementByUniqueId(
                this._grid.uniqueId
            ).parentElement.querySelector(
                '.' + OSFramework.Helper.Constants.overlayExportFeedbackCss
            );
            if (loadingMessageElem) loadingMessageElem.remove();
        }

        //Exporting to Excel Consider only the current page, so we need to remove the pagination first of all
        private _resetPagination(): void {
            this._pageSize = this._grid.features.pagination.pageSize;
            this._curPage = this._grid.features.pagination.pageIndex;
            this._grid.features.pagination.moveToFirstPage();
            this._grid.features.pagination.changePageSize(0);
        }

        private _showLoadingMessage() {
            const parentPlaceholder = OSFramework.Helper.GetElementByUniqueId(
                this._grid.uniqueId
            ).parentElement;

            const loadingPlaceholderContent = `<div class="datagrid-loading heading4 OSInline" style="width: 100%; height: 100%;"><i class="icon fa-spin fa fa-spinner fa-1x"></i><div class="OSInline" style="margin-left: 10px;">${this._loadingMessage}</div></div>`;
            const createdDivElem = document.createElement('div');
            createdDivElem.className =
                OSFramework.Helper.Constants.overlayExportFeedbackCss;
            createdDivElem.innerHTML = loadingPlaceholderContent;
            parentPlaceholder.appendChild(createdDivElem);
        }

        public build(): void {
            return;
        }

        public customizeExportingMessage(
            exportingMessage: string,
            showMessage = true
        ): void {
            if (exportingMessage === '' || exportingMessage === undefined) {
                throw new Error(
                    OSFramework.Enum.ErrorMessages.CustomizeExportingMessageEmptyString
                );
            }

            this._loadingMessage =
                OSFramework.Helper.Sanitize(exportingMessage);
            this._hasLoadingMessage = showMessage;
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

        public exportToCsv(filename?: string): void {
            if (this._hasLoadingMessage) {
                this._showLoadingMessage();
            }

            this._resetPagination();

            const params = { fileName: this._handleFilename(filename, true) };
            const result = this._grid.provider.getClipString(
                this._getFullCellRange(),
                true,
                true
            );

            this._reApplyPagination();
            wijmo.saveFile(result, params.fileName);

            if (this._hasLoadingMessage) {
                this._removeLoadingMessage();
            }
        }

        public exportToExcel(withStyles: boolean, filename: string): void {
            this._resetPagination();

            if (this._hasLoadingMessage) {
                this._showLoadingMessage();
            }

            // include timeout in order to apply conditional format
            setTimeout(() => {
                const params: wijmo.grid.xlsx.IFlexGridXlsxOptions = {
                    includeColumnHeaders: true,
                    includeRowHeaders: true,
                    includeStyles: withStyles,
                    formatItem: this.exportFormatItem
                };
                const book = wijmo.grid.xlsx.FlexGridXlsxConverter.save(
                    this._grid.provider,
                    params
                );
                book.sheets[0].name = 'DataGrid Data';
                book.save(this._handleFilename(filename, false));
                this._reApplyPagination();

                if (this._hasLoadingMessage) {
                    this._removeLoadingMessage();
                }
            }, 10);
        }
    }
}
