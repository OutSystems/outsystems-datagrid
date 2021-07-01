// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    export class ColumnReorder
        implements
            OSFramework.Feature.IColumnReorder,
            OSFramework.Interface.IBuilder
    {
        private _enabled: boolean;
        private _grid: WijmoProvider.Grid.IGridWijmo;
        private _draggedColumn: wijmo.grid.ColumnGroup;

        constructor(grid: WijmoProvider.Grid.IGridWijmo, enabled: boolean) {
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

            this._grid.provider.draggingColumnOver.addHandler((s, e) => {
                // allow dropping only within groups
                let col = e.getColumn(true) as wijmo.grid.ColumnGroup;
                e.cancel = col.parentGroup != this._draggedColumn.parentGroup;
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
