// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Features {
    /**
     * Interface for freezing columns
     */
    export interface IColumnFreeze {
        /**
         * Indicates when there is some column freezed
         */
        isFrozen: boolean;
        /**
         * Freeze columns considering Grid's active cell
         */
        byActiveSelection(): void;
        /**
         * Freeze columns considering a cell position
         *
         * @param cell Used as reference to freeze everything up and left
         */
        bySelection(cell: GridAPI.Structures.CellRange): void;
        /**
         * Freeze the first column
         */
        firstColumn(): void;
        /**
         * Freeze leftmost columns
         *
         * @param n how many columns to freeze, if omitted active cell will be considered
         */
        leftColumns(n?: number): void;
        /**
         * Unfreeze panes
         */
        unfreeze(): void;
    }

    export class ColumnFreeze implements IColumnFreeze, IBuilder {
        private _grid: Grid.IGridWijmo;

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
        }

        public get isFrozen(): boolean {
            return this._grid.provider.frozenColumns !== 0;
        }

        public build(): void {
            // Implementing interface
        }

        public byActiveSelection(): void {
            this.leftColumns();
        }

        public bySelection(cell: GridAPI.Structures.CellRange): void {
            this.leftColumns(cell.topRowIndex);
        }

        public firstColumn(): void {
            this.leftColumns(1);
        }

        public leftColumns(n?: number): void {
            if (n !== undefined) {
                this._grid.provider.frozenColumns = n;
            } else {
                const activeCell = this._grid.features.selection.getActiveCell();

                if (activeCell !== undefined) {
                    this._grid.provider.frozenColumns =
                        activeCell.leftColumnIndex + 1;
                }
            }
        }

        public unfreeze(): void {
            this.leftColumns(0);
        }
    }
}
