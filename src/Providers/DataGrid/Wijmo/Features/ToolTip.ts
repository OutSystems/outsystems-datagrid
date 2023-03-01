// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
    export class ToolTip
        implements
            OSFramework.DataGrid.Interface.IBuilder,
            OSFramework.DataGrid.Interface.IDisposable
    {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _eventMouseEnter: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _eventMouseOut: any;
        private _grid: Grid.IGridWijmo;
        private _toolTip: wijmo.Tooltip;

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
            this._toolTip = new wijmo.Tooltip();
            this._eventMouseEnter = this._onMouseEnter.bind(this);
            this._eventMouseOut = this._onMouseOut.bind(this);
        }

        private _onMouseEnter(e: MouseEvent): void {
            let _currTarget: HTMLElement = e.currentTarget as HTMLElement;
            const ht = this._grid.provider.hitTest(e);

            const cellType = this._grid.provider.hitTest(_currTarget).cellType;
            if (
                cellType === wijmo.grid.CellType.Cell ||
                cellType === wijmo.grid.CellType.ColumnFooter
            ) {
                this._setCellToolTip(
                    _currTarget,
                    ht.getColumn().binding,
                    ht.row
                );
            } else if (cellType === wijmo.grid.CellType.ColumnHeader) {
                this._setHeaderTooltip(_currTarget, ht.col);
            }
        }

        private _onMouseOut(/*e: Event*/): void {
            this._toolTip.hide();
        }

        private _setCellToolTip(
            cell: HTMLElement,
            binding: string,
            row: number
        ): void {
            const sanitizedValue = OSFramework.DataGrid.Helper.Sanitize(
                cell.innerText
            );

            const isInvalid = cell.classList.contains('wj-state-invalid');

            if (cell.querySelector('div.dg-cell')) {
                cell = cell.querySelector('div.dg-cell');
            }

            //Make sure to apply the correct tooltipClass
            this._toolTipClass(isInvalid);

            //If the cell is valid
            if (isInvalid === false) {
                if (
                    cell.scrollWidth > cell.clientWidth &&
                    sanitizedValue !== undefined &&
                    sanitizedValue !== ''
                ) {
                    //JS asserts the previous declaration as true when they are equal
                    this._toolTip.show(cell, sanitizedValue); // show tooltip if text is overflow/hidden
                }
            }
            //Otherwise (If the cell is invalid)
            else {
                this._toolTip.show(
                    cell,
                    this._grid.features.validationMark.errorMessage(
                        row,
                        binding
                    )
                );
            }
        }

        private _setHeaderTooltip(cell: HTMLElement, columnNumber: number) {
            const column = this._grid.getColumns()[columnNumber];
            const widgetId = column?.widgetId;
            let headerTooltip = column?.config.headerTooltip;
            const sanitizedValue = OSFramework.DataGrid.Helper.Sanitize(
                cell.innerText
            );

            if (cell && headerTooltip) {
                if (
                    !!document.getElementById(headerTooltip) &&
                    headerTooltip !== widgetId
                ) {
                    // If headerTooltip is an Id of an Element, it should be manipulated to be a selector.
                    // setTooltip() wijmo method allows us to render the content of another element using its id
                    headerTooltip = '#' + headerTooltip;
                }
            } else if (
                cell &&
                sanitizedValue !== undefined &&
                sanitizedValue !== ''
            ) {
                headerTooltip = sanitizedValue;
            }

            this._toolTipClass(false);
            this._toolTip.show(cell, headerTooltip);
        }

        private _toolTipClass(isInvalid: boolean): void {
            if (isInvalid === true) this._toolTip.cssClass = 'errorValidation';
            else this._toolTip.cssClass = '';
        }

        public build(): void {
            this._grid.provider.formatItem.addHandler(
                (s: wijmo.grid.FlexGrid, e: wijmo.grid.FormatItemEventArgs) => {
                    e.cell.removeEventListener(
                        'mouseover',
                        this._eventMouseEnter
                    );
                    e.cell.addEventListener('mouseover', this._eventMouseEnter);

                    e.cell.removeEventListener('mouseout', this._eventMouseOut);
                    e.cell.addEventListener('mouseout', this._eventMouseOut);
                }
            );
        }

        public dispose(): void {
            this._toolTip.dispose();
            this._toolTip = undefined;
        }
    }
}
