// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    export class ToolTip
        implements
            OSFramework.Interface.IBuilder,
            OSFramework.Interface.IDisposable {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _eventMouseEnter: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _eventMouseOut: any;
        private _grid: WijmoProvider.Grid.IGridWijmo;
        private _toolTip: wijmo.Tooltip;

        constructor(grid: WijmoProvider.Grid.IGridWijmo) {
            this._grid = grid;
            this._toolTip = new wijmo.Tooltip();
            this._eventMouseEnter = this._onMouseEnter.bind(this);
            this._eventMouseOut = this._onMouseOut.bind(this);
        }

        private _onMouseEnter(e: MouseEvent): void {
            let _currTarget: HTMLElement = e.currentTarget as HTMLElement;
            const ht = this._grid.provider.hitTest(e);

            if (ht.cellType === wijmo.grid.CellType.Cell) {
                const isInvalid = _currTarget.classList.contains(
                    'wj-state-invalid'
                );

                if (_currTarget.querySelector('div.dg-cell')) {
                    _currTarget = _currTarget.querySelector('div.dg-cell');
                }

                //Make sure to apply the correct tooltipClass
                this._toolTipClass(isInvalid);

                //If the cell is valid
                if (isInvalid === false) {
                    if (
                        _currTarget.scrollWidth > _currTarget.clientWidth &&
                        _currTarget.innerText !== undefined &&
                        _currTarget.innerText !== ''
                    ) {
                        //JS asserts the previous declaration as true when they are equal
                        this._toolTip.show(_currTarget, _currTarget.innerText); // show tooltip if text is overflow/hidden
                    }
                }
                //Otherwise (If the cell is invalid)
                else {
                    this._toolTip.show(
                        _currTarget,
                        this._grid.features.validationMark.errorMessage(
                            ht.row,
                            ht.getColumn().binding
                        )
                    );
                }
            } else if (ht.cellType === wijmo.grid.CellType.ColumnHeader) {
                const rendered = this._grid.getColumn(ht.getColumn().binding)
                    .config;
                this._grid.provider.columns[ht.col] || {};

                if (_currTarget && rendered.headerTooltip) {
                    if (document.getElementById(rendered.headerTooltip)) {
                        rendered.headerTooltip = '#' + rendered.headerTooltip;
                    }
                    this._setHeaderTooltip(_currTarget, rendered.headerTooltip);
                } else if (
                    _currTarget &&
                    _currTarget.innerText !== undefined &&
                    _currTarget.innerText !== ''
                ) {
                    this._setHeaderTooltip(_currTarget, _currTarget.innerText);
                }
            }
        }
        private _onMouseOut(/*e: Event*/): void {
            this._toolTip.hide();
        }

        private _setHeaderTooltip(element: HTMLElement, content: string): void {
            //Make sure to reset the cssClass for the tooltip
            this._toolTipClass(false);
            this._toolTip.setTooltip(element, content);
        }

        private _setToolTip(cell: Element): void {
            cell.removeEventListener('mouseover', this._eventMouseEnter);
            cell.addEventListener('mouseover', this._eventMouseEnter);

            cell.removeEventListener('mouseout', this._eventMouseOut);
            cell.addEventListener('mouseout', this._eventMouseOut);
        }

        private _toolTipClass(isInvalid: boolean): void {
            if (isInvalid === true) this._toolTip.cssClass = 'errorValidation';
            else this._toolTip.cssClass = '';
        }

        public build(): void {
            this._grid.provider.formatItem.addHandler(
                (s: wijmo.grid.FlexGrid, e: wijmo.grid.FormatItemEventArgs) => {
                    this._setToolTip(e.cell);
                }
            );
        }

        public dispose(): void {
            this._toolTip.dispose();
            this._toolTip = undefined;
        }
    }
}
