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
            column.align = 'center';

            new wijmo.grid.selector.Selector(this._grid.provider);
            this._grid.provider.rowHeaders.columns.insert(0, column);
        }

        private _buildRowHeader() {
            if (this.hasCheckbox) {
                this._buildCheckbox();
                // with checkbox, we want to prevent row selection on row number and
                // want to still be able to select cells.
                this._disableRowSelectionOnRowNumber();
                this._grid.provider.selectionMode =
                    wijmo.grid.SelectionMode.MultiRange;

                // if grid has checked rows, add custom class so column headers are selected as well
                this._grid.provider.formatItem.addHandler((s, e) => {
                    if (e.panel.cellType === wijmo.grid.CellType.RowHeader) {
                        const columnHeaderElement =
                            s.columnHeaders.hostElement.querySelector(
                                '.wj-cell.wj-header'
                            );

                        const rowHeaderCheckedElement =
                            s.rowHeaders.hostElement.querySelector(
                                "input[type='checkbox']:checked"
                            );

                        if (rowHeaderCheckedElement) {
                            wijmo.addClass(
                                columnHeaderElement,
                                'checked-column-header'
                            );
                        } else if (
                            wijmo.hasClass(
                                columnHeaderElement,
                                'checked-column-header'
                            )
                        ) {
                            wijmo.removeClass(
                                columnHeaderElement,
                                'checked-column-header'
                            );
                        }
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
