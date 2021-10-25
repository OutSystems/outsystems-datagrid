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
            this._grid.provider.rowHeaders.columns.push(column);

            new wijmo.grid.selector.Selector(column);
        }

        private _buildRowHeader() {
            if (this.hasCheckbox) {
                this._buildCheckbox();
            }
            if (!this.hasRowNumber) {
                this._grid.features.autoRowNumber.setState(false);
            }
        }

        public build(): void {
            this._buildRowHeader();
        }
    }
}
