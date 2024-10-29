// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
	export class Tooltip
		implements
			OSFramework.DataGrid.Feature.ITooltip,
			OSFramework.DataGrid.Interface.IBuilder,
			OSFramework.DataGrid.Interface.IDisposable
	{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventMouseEnter: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventMouseOut: any;
		private _grid: Grid.IGridWijmo;
		private _tooltip: wijmo.Tooltip;

		constructor(grid: Grid.IGridWijmo) {
			this._grid = grid;
			this._tooltip = new wijmo.Tooltip();
			this._tooltip.trigger = wijmo.TooltipTrigger.Both;
			this._eventMouseEnter = this._onMouseEnter.bind(this);
			this._eventMouseOut = this._onMouseOut.bind(this);
		}

		private _onMouseEnter(e: MouseEvent): void {
			const _currTarget: HTMLElement = e.currentTarget as HTMLElement;
			const ht = this._grid.provider.hitTest(_currTarget);

			const cellType = ht.cellType;
			if (cellType === wijmo.grid.CellType.Cell || cellType === wijmo.grid.CellType.ColumnFooter) {
				//Check if we do have data available, for instance while using filters that make the Grid without results
				if (this._grid.provider.rows.length > 0) {
					this._setCellTooltip(_currTarget, ht.getColumn().binding, ht.row);
				}
			} else if (cellType === wijmo.grid.CellType.ColumnHeader) {
				// If the Column Header is from a Group Column, we need to use a different approach than the regular header
				// We can check if the current target is a ColumnGroup by checking its class and if providerIndex is -1
				if (
					_currTarget.classList.contains(Helper.Constants.CssClasses.ColumnGroup) &&
					this._grid.getColumnByIndex(ht.getColumn().index).providerIndex === -1
				) {
					this._setColumnGroupHeaderTooltip(_currTarget);
				} else {
					this._setHeaderTooltip(_currTarget, ht);
				}
			}
		}

		private _onMouseOut(): void {
			this._tooltip.hide();
		}

		private _setCellTooltip(cell: HTMLElement, binding: string, row: number): void {
			const sanitizedValue = OSFramework.DataGrid.Helper.Sanitize(cell.innerText);

			const isInvalid = this._grid.features.validationMark.isInvalid(row, binding);

			if (cell.querySelector(Helper.Constants.CssClasses.CellClass)) {
				cell = cell.querySelector(Helper.Constants.CssClasses.CellClass);
			}

			//Make sure to apply the correct tooltipClass
			this._tooltipClass(isInvalid);

			//If the cell is valid
			if (isInvalid === false) {
				if (cell.scrollWidth > cell.clientWidth && sanitizedValue !== undefined && sanitizedValue !== '') {
					//JS asserts the previous declaration as true when they are equal
					this._tooltip.show(cell, sanitizedValue); // show tooltip if text is overflow/hidden
				} else {
					this._tooltip.hide();
				}
			}
			//Otherwise (If the cell is invalid)
			else {
				this._tooltip.show(cell, this._grid.features.validationMark.errorMessage(row, binding));
			}
		}

		private _setColumnGroupHeaderTooltip(cell: HTMLElement) {
			// Do nothing if a tooltip is already set for this column
			if (this._tooltip.getTooltip(cell)) return;
			// Otherwise, the tooltip will be the header text
			const headerTooltip = OSFramework.DataGrid.Helper.Sanitize(cell.innerText);

			this._tooltipClass(false);
			this._tooltip.show(cell, headerTooltip);
		}

		private _setHeaderTooltip(cell: HTMLElement, htCell: wijmo.grid.HitTestInfo) {
			const sanitizedValue = OSFramework.DataGrid.Helper.Sanitize(cell.innerText);

			const column = this._grid.getColumn(htCell.getColumn().binding);
			const widgetId = column?.widgetId;
			let headerTooltip = column?.config.headerTooltip;

			if (cell && headerTooltip) {
				if (!!document.getElementById(headerTooltip) && headerTooltip !== widgetId) {
					// If headerTooltip is an Id of an Element, it should be manipulated to be a selector.
					// setTooltip() wijmo method allows us to render the content of another element using its id
					headerTooltip = '#' + headerTooltip;
				}
			} else if (cell && sanitizedValue !== undefined && sanitizedValue !== '') {
				headerTooltip = sanitizedValue;
			}

			this._tooltipClass(false);
			this._tooltip.show(cell, headerTooltip);
		}

		private _tooltipClass(isInvalid: boolean): void {
			if (isInvalid === true) {
				this._tooltip.cssClass = Helper.Constants.CssClasses.TooltipErrorValidation;
			} else {
				this._tooltip.cssClass = '';

				// Implementation of the workaround provided by Wijmo related to ROU-4207 issue.
				// To be removed after Wijmo fix.
				if (wijmo.Tooltip._eTip)
					wijmo.Tooltip._eTip.setAttribute(
						OSFramework.DataGrid.Helper.GlobalEnum.HTMLAttributes.Class,
						Helper.Constants.CssClasses.Tooltip
					);
			}
		}

		public build(): void {
			this._grid.provider.formatItem.addHandler((s: wijmo.grid.FlexGrid, e: wijmo.grid.FormatItemEventArgs) => {
				e.cell.removeEventListener(
					OSFramework.DataGrid.Helper.GlobalEnum.HTMLEvent.MouseOver,
					this._eventMouseEnter
				);
				e.cell.addEventListener(
					OSFramework.DataGrid.Helper.GlobalEnum.HTMLEvent.MouseOver,
					this._eventMouseEnter
				);

				e.cell.removeEventListener(
					OSFramework.DataGrid.Helper.GlobalEnum.HTMLEvent.MouseOut,
					this._eventMouseOut
				);
				e.cell.addEventListener(OSFramework.DataGrid.Helper.GlobalEnum.HTMLEvent.MouseOut, this._eventMouseOut);
			});
		}

		public dispose(): void {
			this._tooltip.dispose();
			this._tooltip = undefined;
		}

		public setColumnGroupHeaderTooltip(cell: HTMLElement, tooltipContent: string): void {
			if (cell.classList.contains(Helper.Constants.CssClasses.ColumnGroup)) {
				this._tooltip.setTooltip(cell, tooltipContent);
			} else {
				console.warn(OSFramework.DataGrid.Enum.ErrorMessages.SetColumnHeaderTooltip);
			}
		}
	}
}
