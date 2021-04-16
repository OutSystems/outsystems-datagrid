// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Features {
    export class ColumnReorder implements IColumnReorder, IBuilder {
        private _enabled: boolean;
        private _grid: Grid.IGridWijmo;

        constructor(grid: Grid.IGridWijmo, enabled: boolean) {
            this._grid = grid;
            this._enabled = enabled;
        }

        public build(): void {
            this.setState(this._enabled);
        }

        public setState(value: boolean): void {
            this._grid.provider.allowDragging = value
                ? wijmo.grid.AllowDragging.Columns
                : wijmo.grid.AllowDragging.None;
            this._enabled = value;
        }
    }
}
