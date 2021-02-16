// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Features {
    export class ToolTip implements IBuilder, IDisposable {
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

            if (ht.cellType === wijmo.grid.CellType.Cell) {
                const isInvalid = _currTarget.classList.contains(
                    'wj-state-invalid'
                );

                if (!isInvalid && _currTarget.querySelector('div.dg-cell')) {
                    _currTarget = _currTarget.querySelector('div.dg-cell');
                }

                if (
                    _currTarget.scrollWidth > _currTarget.clientWidth &&
                    !isInvalid &&
                    _currTarget.innerText !== undefined &&
                    _currTarget.innerText !== ''
                ) {
                    //JS asserts the previous declaration as true when they are equal
                    this._toolTip.show(_currTarget, _currTarget.innerText); // show tooltip if text is overflow/hidden
                }
            } else if (ht.cellType === wijmo.grid.CellType.ColumnHeader) {
                if (
                    _currTarget &&
                    _currTarget.innerText !== undefined &&
                    _currTarget.innerText !== ''
                ) {
                    this._toolTip.setTooltip(
                        _currTarget,
                        _currTarget.innerText
                    );
                }
            }
        }

        private _onMouseOut(/*e: Event*/): void {
            this._toolTip.hide();
        }

        private _setToolTip(cell: Element): void {
            cell.removeEventListener('mouseover', this._eventMouseEnter);
            cell.addEventListener('mouseover', this._eventMouseEnter);

            cell.removeEventListener('mouseout', this._eventMouseOut);
            cell.addEventListener('mouseout', this._eventMouseOut);
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
