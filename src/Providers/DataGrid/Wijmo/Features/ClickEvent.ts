// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
	export class ClickEvent
		implements
			OSFramework.DataGrid.Feature.IClickEvent,
			OSFramework.DataGrid.Interface.IBuilder,
			OSFramework.DataGrid.Interface.IDisposable
	{
		protected _grid: Providers.DataGrid.Wijmo.Grid.IGridWijmo;

		constructor(
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			grid: Providers.DataGrid.Wijmo.Grid.IGridWijmo
		) {
			this._grid = grid;
		}

		private _raiseCellClickEvent(e: MouseEvent) {
			const ht = this._grid.provider.hitTest(e);
			if (ht.cellType === wijmo.grid.CellType.Cell) {
				const column = ht.getColumn();
				const rowNumber = ht.row;
				const binding = column.binding;
				const columnWidgetId = this._grid.getColumn(column.describedById).widgetId;
				const line = _.cloneDeep(this._grid.provider.rows[rowNumber].dataItem);
				this._grid.rowMetadata.clear(line);

				this._grid.gridEvents.trigger(
					OSFramework.DataGrid.Event.Grid.GridEventType.OnCellClick,
					this._grid,
					columnWidgetId,
					rowNumber,
					binding,
					JSON.stringify(this._grid.isSingleEntity ? OSFramework.DataGrid.Helper.Flatten(line) : line)
				);
			}
		}

		public build(): void {
			this.setCellClickEvent(this._raiseCellClickEvent.bind(this));
		}

		public dispose(): void {
			this.removeCellClickEvent(this._raiseCellClickEvent.bind(this));
		}

		public removeCellClickEvent(callback: (ev: MouseEvent) => void): void {
			this._grid.provider.removeEventListener(this._grid.provider.hostElement, 'click', callback);
		}

		public setCellClickEvent(callback: (ev: MouseEvent) => void): void {
			this._grid.provider.addEventListener(this._grid.provider.hostElement, 'click', callback);
		}
	}
}
