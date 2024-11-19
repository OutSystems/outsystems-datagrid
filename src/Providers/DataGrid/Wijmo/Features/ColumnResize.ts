// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
	export class ColumnResize
		implements OSFramework.DataGrid.Feature.IColumnResize, OSFramework.DataGrid.Interface.IBuilder
	{
		private _enabled: boolean;
		private _grid: Grid.IGridWijmo;

		constructor(grid: Grid.IGridWijmo, enabled: boolean) {
			this._grid = grid;
			this._enabled = enabled;
		}

		// workaround for WJM-35264
		private _setResizeWorkaround() {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const oldMouseDownHandler = (wijmo.grid._MouseHandler.prototype as any)._mousedown;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(wijmo.grid._MouseHandler.prototype as any)._mousedown = function (e) {
				oldMouseDownHandler.call(this, e);

				if (this._szInitial && this._szInitial.canHaveHScrl) {
					this._szInitial.canHaveHScrl = false;
				}
			};
		}

		public build(): void {
			this.setState(this._enabled);
			this._setResizeWorkaround();
		}

		public setState(value: boolean): void {
			this._grid.provider.allowResizing = value
				? wijmo.grid.AllowResizing.Columns
				: wijmo.grid.AllowResizing.None;
			this._enabled = value;
		}
	}
}
