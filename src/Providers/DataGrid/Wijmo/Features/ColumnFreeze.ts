// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
    export class ColumnFreeze
        implements
            OSFramework.DataGrid.Feature.IColumnFreeze,
            OSFramework.DataGrid.Interface.IBuilder
    {
        private _grid: Grid.IGridWijmo;

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
        }

        // Method added to fix the issue when frozen columns are resized to their maximum width and it is not possible to resized it again.
        private _afterResizeColumn(
            grid: wijmo.grid.FlexGrid,
            e: wijmo.grid.CellRangeEventArgs
        ): void {
            let frozenColumnsWidth = 0;
            let otherfrozenColumnsWidth = 0;
            const frozenColumns = grid.columns.filter(
                (col) => col.index < grid.frozenColumns
            );
            frozenColumns.forEach((col, index) => {
                frozenColumnsWidth += col.width;
                if (index !== e.col) {
                    otherfrozenColumnsWidth += col.width;
                }
            });
            // Checks if the column was resized to the maximum width and resizes it in 10 pixels less than the max width
            if (frozenColumnsWidth >= grid.clientSize.width) {
                grid.columns[e.col].size =
                    grid.clientSize.width - otherfrozenColumnsWidth - 10;
            }
        }

        public get isFrozen(): boolean {
            return this._grid.provider.frozenColumns !== 0;
        }

        public build(): void {
            this._grid.provider.resizedColumn.addHandler(
                this._afterResizeColumn
            );
        }

        public byActiveSelection(): void {
            this.leftColumns();
        }

        public bySelection(
            cell: OSFramework.DataGrid.OSStructure.CellRange
        ): void {
            this.leftColumns(cell.topRowIndex);
        }

        public firstColumn(): void {
            this.leftColumns(1);
        }

        /**
         * Function that returns the current frozen Columns state in the Grid
         *
         * @returns JSON string with the current frozen Columns state
         */
        public getViewLayout(): string {
            return this._grid.provider.frozenColumns.toString();
        }

        public leftColumns(n?: number): void {
            if (n !== undefined) {
                if (n < 0) {
                    throw new Error(
                        OSFramework.DataGrid.Enum.ErrorMessages.FreezeColumnPositiveNumberExpected
                    );
                }
                this._grid.provider.frozenColumns = n;
            } else {
                const activeCell =
                    this._grid.features.selection.getActiveCell();

                if (activeCell !== undefined) {
                    this._grid.provider.frozenColumns =
                        activeCell.leftColumnIndex + 1;
                }
            }
        }

        /**
         * Function that will set the frozen Columns based on a given state
         *
         * @param state the frozen Columns state to be applied
         */
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public setViewLayout(state: any): void {
            this._grid.provider.frozenColumns = state.frozenColumns;
        }

        public unfreeze(): void {
            this.leftColumns(0);
        }
    }
}
