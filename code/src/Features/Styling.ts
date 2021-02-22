// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Features {
    export interface IStyling {
        changeRowHeight(rowHeight: number): void;
    }

    export class Styling implements IStyling, IBuilder {
        private _grid: Grid.IGridWijmo;
        private _rowHeight: number;

        constructor(grid: Grid.IGridWijmo, rowHeight: number) {
            this._grid = grid;
            this._rowHeight = rowHeight;
        }

        public get rowHeight(): number {
            return this._rowHeight;
        }

        public build(): void {
            // This value doesn't change (48px)
            const colHeadersHeight = 48;
            // Set default height for column headers
            this._grid.provider.columnHeaders.rows.defaultSize = colHeadersHeight;

            // Sets the initial rowHeight
            if (this._rowHeight !== undefined) {
                this.changeRowHeight(this._rowHeight);
            }
        }

        public changeRowHeight(rowHeight: number): void {
            this._rowHeight = rowHeight;
            this._grid.provider.cells.rows.defaultSize = rowHeight;
        }
    }
}
