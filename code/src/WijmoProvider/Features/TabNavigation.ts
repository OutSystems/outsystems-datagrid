// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    export class TabNavigation implements ITabNavigation, OSFramework.Interface.IBuilder {
        private _enabled: boolean;
        private _grid: WijmoProvider.Grid.IGridWijmo;

        constructor(grid: WijmoProvider.Grid.IGridWijmo, enabled: boolean) {
            this._grid = grid;
            this._enabled = enabled;
        }

        public build(): void {
            this.setState(this._enabled);
        }

        public setState(value: boolean): void {
            this._grid.provider.keyActionTab = value
                ? wijmo.grid.KeyAction.Cycle
                : wijmo.grid.KeyAction.None;
            this._enabled = value;
        }
    }
}
