// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    export class ColumnReorder
        implements
            OSFramework.Feature.IColumnReorder,
            OSFramework.Interface.IBuilder
    {
        private _draggedColumn: wijmo.grid.ColumnGroup;
        private _enabled: boolean;
        private _grid: Grid.IGridWijmo;

        constructor(grid: Grid.IGridWijmo, enabled: boolean) {
            this._grid = grid;
            this._enabled = enabled;
        }

        public build(): void {
            this.setState(this._enabled);

            // keep track of group being dragged
            this._grid.provider.draggingColumn.addHandler((s, e) => {
                this._draggedColumn = e.getColumn(
                    true
                ) as wijmo.grid.ColumnGroup;
            });

            // We want to limit dragging to columns within groups
            this._grid.provider.draggingColumnOver.addHandler((s, e) => {
                const col = e.getColumn(true) as wijmo.grid.ColumnGroup;
                e.cancel = col.parentGroup !== this._draggedColumn.parentGroup; // check if column belongs to its own group
            });
        }

        public setState(value: boolean): void {
            this._grid.provider.allowDragging = value
                ? wijmo.grid.AllowDragging.Columns
                : wijmo.grid.AllowDragging.None;
            this._enabled = value;
        }
    }
}
