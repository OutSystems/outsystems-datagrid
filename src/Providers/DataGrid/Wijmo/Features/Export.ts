// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
	export class Export implements OSFramework.DataGrid.Feature.IExport, OSFramework.DataGrid.Interface.IBuilder {
		private _currPage: number;
		// Dangerous starts for CSV injection
		private readonly _dangerousStarts = ['=', '+', '-', '@'];
		private readonly _grid: Grid.IGridWijmo;
		private _hasLoadingMessage = true;
		private _loadingMessage = 'Your data is being exported.';
		private _pageSize: number;

		constructor(grid: Grid.IGridWijmo) {
			this._grid = grid;
		}

		/**
		 * Mitigates CSV/Excel formula injection by neutralizing values that could be
		 * interpreted as formulas by spreadsheet applications.
		 *
		 * A value is considered dangerous if it starts with any of the characters
		 * defined in `_dangerousStarts` (`=`, `+`, `-`, `@`), either directly, inside
		 * an initial double-quoted field (e.g. `"=1+1"`), or immediately after a
		 * tab, newline, or carriage-return character within the string.
		 *
		 * Escaping strategy:
		 * - If the string starts with a dangerous character (e.g. `=1+1`), a single
		 *   quote (`'`) is prepended (resulting in `'=1+1`), so the value is treated
		 *   as literal text by most CSV/Excel consumers.
		 * - If the string starts with a double quote followed by a dangerous
		 *   character (e.g. `"=1+1"`), a single quote is inserted after the opening
		 *   quote (resulting in `"'=1+1"`).
		 * - If a dangerous character appears immediately after a tab, newline, or
		 *   carriage-return character, a single quote is inserted between the
		 *   whitespace and the dangerous character (e.g. `\n=1+1` becomes
		 *   `\n'=1+1`).
		 *
		 * This function does not perform general CSV quoting/escaping; it only
		 * addresses formula-like patterns to reduce the risk of CSV injection.
		 *
		 * @param cellString Raw cell content to be exported to CSV. If this value is
		 *        falsy (e.g. empty string), it is returned as-is without modification.
		 * @returns The sanitized string with potentially dangerous formula prefixes
		 *          neutralized, or the original falsy value (such as `''` or `null`)
		 *          unchanged.
		 */
		private _escapeCsvInjection(cellString: string): string | null {
			if (!cellString) return cellString;
			// Prefix values that start with dangerous characters with a single quote to prevent CSV injection
			const needEscape = this._dangerousStarts.some((char) => cellString.startsWith(char));
			if (needEscape) {
				cellString = `'${cellString}`;
			}
			// Also handle values that start with a quote followed by a dangerous character
			const containsQuote = this._dangerousStarts.some((char) => cellString.startsWith('"' + char));

			if (containsQuote) {
				cellString = cellString.replace(/^"([=+\-@])/, (match, $1) => '"\'' + $1);
			}
			// Escape dangerous characters that appear immediately after tab/newline characters
			const containsWrap = /[\t\n\r]/.test(cellString);
			if (containsWrap) {
				cellString = cellString.replace(/([\t\n\r])([=+\-@])/g, (match, $1, $2) => $1 + "'" + $2);
			}
			return cellString;
		}

		//Return CellRange considering all rows and columns
		private _getFullCellRange(): wijmo.grid.CellRange {
			const rowsNumber = this._grid.provider.rows.length;
			const colsNumber = this._grid.provider.columns.length;
			return new wijmo.grid.CellRange(0, 0, rowsNumber - 1, colsNumber - 1);
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
			this._grid.features.pagination.moveToPage(this._currPage);
		}

		private _removeLoadingMessage() {
			const loadingMessageElem = OSFramework.DataGrid.Helper.GetElementByUniqueId(
				this._grid.uniqueId
			).parentElement.querySelector('.' + OSFramework.DataGrid.Helper.Constants.overlayExportFeedbackCss);
			if (loadingMessageElem) loadingMessageElem.remove();
		}

		//Exporting to Excel Consider only the current page, so we need to remove the pagination first of all
		private _resetPagination(): void {
			this._pageSize = this._grid.features.pagination.pageSize;
			this._currPage = this._grid.features.pagination.pageIndex;
			this._grid.features.pagination.moveToFirstPage();
			this._grid.features.pagination.changePageSize(0);
		}

		private _showLoadingMessage(): void {
			const parentPlaceholder = OSFramework.DataGrid.Helper.GetElementByUniqueId(
				this._grid.uniqueId
			).parentElement;

			const loadingPlaceholderContent = `<div class="datagrid-loading full-size heading4 OSInline"><i class="icon fa-spin fa fa-spinner fa-1x"></i><div class="ml-10 OSInline">${this._loadingMessage}</div></div>`;
			const createdDivElem = document.createElement('div');
			createdDivElem.className = OSFramework.DataGrid.Helper.Constants.overlayExportFeedbackCss;
			createdDivElem.innerHTML = loadingPlaceholderContent;
			parentPlaceholder.appendChild(createdDivElem);
		}

		// Workaround for HTML tags being exported in CSV with Grouped Columns
		private _stripHtmlBoldTag(htmlString: string): string {
			if (!htmlString) return '';
			return htmlString.replace(/<b>|<\/b>/g, '');
		}

		public build(): void {
			// Callback for when the grid is being exported to CSV.
			// Made available in the Wijmo 2025 v2 (Build 5.20252.42).
			this._grid.provider.gettingCellClipString.addHandler(
				(s: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) => {
					e.data = this._escapeCsvInjection(e.data);
				}
			);
		}

		public customizeExportingMessage(exportingMessage: string, showMessage = true): void {
			if (exportingMessage === '' || exportingMessage === undefined) {
				throw new Error(OSFramework.DataGrid.Enum.ErrorMessages.CustomizeExportingMessageEmptyString);
			}

			this._loadingMessage = OSFramework.DataGrid.Helper.Sanitize(exportingMessage);
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
			const result = this._grid.provider.getClipString(null, false, withHeaders);
			wijmo.Clipboard.copy(result);
		}

		public exportToCsv(filename?: string): void {
			if (this._hasLoadingMessage) {
				this._showLoadingMessage();
			}

			this._resetPagination();

			const params = { fileName: this._handleFilename(filename, true) };
			let result = this._grid.provider.getClipString(this._getFullCellRange(), true, true);

			// Remove text bold tags only when the grid is grouped
			if (this._grid.features.groupPanel.isGridGrouped) {
				result = this._stripHtmlBoldTag(result);
			}

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
					formatItem: this.exportFormatItem,
				};
				const book = wijmo.grid.xlsx.FlexGridXlsxConverter.save(this._grid.provider, params);
				book.sheets[0].name = 'DataGrid Data';
				book.saveAsync(this._handleFilename(filename, false));
				this._reApplyPagination();

				if (this._hasLoadingMessage) {
					this._removeLoadingMessage();
				}
			}, 10);
		}
	}
}
