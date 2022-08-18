// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
    export class GridReorder
        implements
            OSFramework.DataGrid.Feature.IGridReorder,
            OSFramework.DataGrid.Interface.IBuilder
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

        private _addColumnDragEvents(): void {
            this._grid.provider.draggingColumn.addHandler(
                this._draggingColumnHandler.bind(this)
            );
            this._grid.provider.draggingColumnOver.addHandler(
                this._draggingColumnOverHandler.bind(this)
            );
            this._grid.provider.draggedColumn.addHandler(
                this._draggedColumnHandler.bind(this)
            );
        }

        private _addRowDragEvents(): void {
            this._grid.provider.draggingRow.addHandler(
                this._draggingRowHandler.bind(this)
            );
            this._grid.provider.draggedRow.addHandler(
                this._draggedRowHandler.bind(this)
            );
        }

        private _draggedColumnHandler(
            _s: wijmo.grid.FlexGrid,
            e: wijmo.grid.CellRangeEventArgs
        ) {
            const col = e.getColumn(true);
            const column = this._grid.getColumn(col.binding);
            if (
                column.hasEvents &&
                column.columnEvents.events.has(
                    OSFramework.DataGrid.Event.Column.ColumnEventType
                        .OnColumnReorder
                )
            ) {
                column.columnEvents.trigger(
                    OSFramework.DataGrid.Event.Column.ColumnEventType
                        .OnColumnReorder,
                    null
                );
            }
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

        private _draggingColumnHandler(_s, e) {
            // keep track of group being dragged
            this._draggedColumn = e.getColumn(true) as wijmo.grid.ColumnGroup;
        }

        private _draggingColumnOverHandler(_s, e) {
            // We want to limit dragging to columns within groups
            const col = e.getColumn(true) as wijmo.grid.ColumnGroup;
            e.cancel = col.parentGroup !== this._draggedColumn.parentGroup; // check if column belongs to its own group
        }

        private _draggingRowHandler(
            s: wijmo.grid.FlexGrid,
            e: wijmo.grid.CellRangeEventArgs
        ): void {
            if (this._grid.features.sort.isGridSorted) {
                throw new Error(
                    OSFramework.DataGrid.Enum.ErrorMessages.ReorderRowWithActiveSort
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

            this._addColumnDragEvents();
        }

        public setState(value: boolean): void {
            this._allowColumnDragging = value;
            this._setAllowDragging();
        }

        public toggleRowDragging(allowRowDragging: boolean): void {
            if (allowRowDragging) {
                this._addRowDragEvents();
                if (this._grid.features.rowHeader.hasCheckbox) {
                    throw new Error(
                        OSFramework.DataGrid.Enum.ErrorMessages.ReorderRowOnGridWithCheckbox
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
