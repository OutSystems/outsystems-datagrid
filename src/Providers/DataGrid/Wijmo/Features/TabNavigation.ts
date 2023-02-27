// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
    export class TabNavigation
        implements
            OSFramework.DataGrid.Feature.ITabNavigation,
            OSFramework.DataGrid.Interface.IBuilder
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
            this._grid.provider.keyActionTab = value
                ? wijmo.grid.KeyAction.CycleOut // Move the selection to the next column, then wrap to the next row, then out of the control.
                : wijmo.grid.KeyAction.None; // No special action (let the browser handle the key). The arrow keys will be used to navigate the grid.
            this._enabled = value;
        }
    }
}
