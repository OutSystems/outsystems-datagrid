// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    export class GridReorder
        implements
            OSFramework.Feature.IGridReorder,
            OSFramework.Interface.IBuilder
    {
        private _allowColumnDragging: boolean;
        private _allowRowDragging = false;
        private _dragIndex: number;
        private _draggedColumn: wijmo.grid.ColumnGroup;
        private _grid: Grid.IGridWijmo;

        constructor(grid: Grid.IGridWijmo, enabled: boolean) {
            this._grid = grid;
            this._allowColumnDragging = enabled;
        }

        private _addRowDragEvents(): void {
            this._grid.provider.draggingRow.addHandler(
                this._draggingRowHandler.bind(this)
            );
            this._grid.provider.draggedRow.addHandler(
                this._draggedRowHandler.bind(this)
            );
        }

        private _draggedRowHandler(
            s: wijmo.grid.FlexGrid,
            e: wijmo.grid.CellRangeEventArgs
        ): void {
            const dropIndex = e.row;
            const arr = s.collectionView.sourceCollection;

            s.collectionView.deferUpdate(() => {
                const item = arr[this._dragIndex];
                arr.splice(this._dragIndex, 1);
                arr.splice(dropIndex, 0, item);
                s.collectionView.moveCurrentToPosition(dropIndex);
            });
        }

        private _draggingRowHandler(
            s: wijmo.grid.FlexGrid,
            e: wijmo.grid.CellRangeEventArgs
        ): void {
            if (this._grid.features.sort.isGridSorted) {
                throw new Error(
                    OSFramework.Enum.ErrorMessages.ReorderRowWithActiveSort
                );
            }
            this._dragIndex = e.row;
            s.collectionView.moveCurrentToPosition(this._dragIndex);
        }

        private _removeRowDragEvents(): void {
            this._grid.provider.draggingRow.removeHandler(
                this._draggingRowHandler
            );
            this._grid.provider.draggedRow.removeHandler(
                this._draggedRowHandler
            );
        }

        private _setAllowDragging() {
            this._grid.provider.allowDragging = wijmo.grid.AllowDragging.None;

            if (this._allowColumnDragging && this._allowRowDragging) {
                this._grid.provider.allowDragging =
                    wijmo.grid.AllowDragging.Both;
            } else if (!this._allowColumnDragging && this._allowRowDragging) {
                this._grid.provider.allowDragging =
                    wijmo.grid.AllowDragging.Rows;
            } else if (this._allowColumnDragging && !this._allowRowDragging) {
                this._grid.provider.allowDragging =
                    wijmo.grid.AllowDragging.Columns;
            }
        }

        public build(): void {
            this.setState(this._allowColumnDragging);

            // keep track of group being dragged
            this._grid.provider.draggingColumn.addHandler((_s, e) => {
                this._draggedColumn = e.getColumn(
                    true
                ) as wijmo.grid.ColumnGroup;
            });

            // We want to limit dragging to columns within groups
            this._grid.provider.draggingColumnOver.addHandler((_s, e) => {
                const col = e.getColumn(true) as wijmo.grid.ColumnGroup;
                e.cancel = col.parentGroup !== this._draggedColumn.parentGroup; // check if column belongs to its own group
            });
        }

        public getViewLayout(): string {
            return JSON.stringify(
                this._grid.provider.collectionView.sourceCollection,
                OSFramework.Helper.JsonReplacer
            );
        }

        public setState(value: boolean): void {
            this._allowColumnDragging = value;
            this._setAllowDragging();
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public setViewLayout(state: any): void {
            if (state.rows) {
                this._grid.provider.collectionView.sourceCollection =
                    JSON.parse(state.rows, OSFramework.Helper.JsonReviver);
            }
        }

        public toggleRowDragging(allowRowDragging: boolean): void {
            if (allowRowDragging) {
                this._addRowDragEvents();
                if (this._grid.features.rowHeader.hasCheckbox) {
                    throw new Error(
                        OSFramework.Enum.ErrorMessages.ReorderRowOnGridWithCheckbox
                    );
                }
            } else {
                this._removeRowDragEvents();
            }

            this._allowRowDragging = allowRowDragging;
            this._setAllowDragging();
        }
    }
}
