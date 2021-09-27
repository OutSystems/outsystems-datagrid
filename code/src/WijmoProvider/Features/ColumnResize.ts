// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    export class ColumnResize
        implements
            OSFramework.Feature.IColumnResize,
            OSFramework.Interface.IBuilder
    {
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
            this._grid.provider.allowResizing = value
                ? wijmo.grid.AllowResizing.Columns
                : wijmo.grid.AllowResizing.None;
            this._enabled = value;
        }
    }
}
