// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    export class RowHeader
        implements
            OSFramework.Feature.IRowHeader,
            OSFramework.Interface.IBuilder
    {
        private _grid: Grid.IGridWijmo;
        private _rowHeaderType: OSFramework.Enum.RowHeader;

        constructor(grid: Grid.IGridWijmo, rowHeaderType: number) {
            this._grid = grid;
            this._rowHeaderType = rowHeaderType;
        }

        public get type(): OSFramework.Enum.RowHeader {
            return this._rowHeaderType;
        }

        public get hasRowNumber(): boolean {
            return (
                this._rowHeaderType === OSFramework.Enum.RowHeader.RowNumber ||
                this._rowHeaderType ===
                    OSFramework.Enum.RowHeader.RowNumberAndCheckbox
            );
        }

        public get hasCheckbox(): boolean {
            return (
                this._rowHeaderType ===
                    OSFramework.Enum.RowHeader.RowCheckbox ||
                this._rowHeaderType ===
                    OSFramework.Enum.RowHeader.RowNumberAndCheckbox
            );
        }

        private _buildCheckbox(): void {
            const column = new wijmo.grid.Column();
            column.allowResizing = false;
            column.allowSorting = false;
            column.allowDragging = false;
            column.allowMerging = false;

            new wijmo.grid.selector.Selector(this._grid.provider);
            this._grid.provider.rowHeaders.columns.insert(0, column);
        }

        private _buildRowHeader() {
            if (this.hasCheckbox) {
                this._buildCheckbox();
                this._disableRowSelectionOnRowNumber();

                this._grid.provider.selectionMode =
                    wijmo.grid.SelectionMode.CellRange;

                // check if Grid has checked rows
                this._grid.provider.formatItem.addHandler((s) => {
                    const element =
                        s.columnHeaders.hostElement.querySelector(
                            '.wj-cell.wj-header'
                        );

                    const el = s.hostElement.querySelector(
                        ".wj-header input[type='checkbox']:checked"
                    );
                    if (el) {
                        wijmo.addClass(element, 'checked-columns');
                    } else if (wijmo.hasClass(element, 'checked-columns')) {
                        wijmo.removeClass(element, 'checked-columns');
                    }
                });
            }
            if (!this.hasRowNumber) {
                this._grid.features.autoRowNumber.setState(false);
            }
        }

        /**
         * Disable row number header from being clicked as we want to select rows only with checkbox
         */
        private _disableRowSelectionOnRowNumber(): void {
            this._grid.provider.hostElement
                .querySelector('.wj-rowheaders')
                .addEventListener('mousedown', (e) => e.preventDefault());
        }

        public build(): void {
            this._buildRowHeader();
        }
    }
}
