// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
	// export class Builder extends Validation implements OSFramework.DataGrid.Interface.IBuilder {
	export class Column implements OSFramework.DataGrid.Feature.IColumn, OSFramework.DataGrid.Interface.IBuilder {
		private _grid: Grid.IGridWijmo;

		constructor(grid: Grid.IGridWijmo) {
			this._grid = grid;
		}

		public build(): void {
			//
		}

		public getColumnsOrder(): OSFramework.DataGrid.OSStructure.IColumnOrder[] {
			const gridColumns = this._grid.getColumns();
			let columnsOrder: OSFramework.DataGrid.OSStructure.IColumnOrder[];
			if (gridColumns.length > 0) {
				columnsOrder = gridColumns.map((col) => {
					return {
						binding: col.config.binding,
						position: col.provider.index,
						widgetId: col.widgetId,
					};
				});
			} else {
				columnsOrder = this._grid.provider.columns.map((col) => {
					return {
						binding: col.binding,
						position: col.index,
					};
				});
			}
			return columnsOrder;
		}

		public setColumnHeader(columnBinding: string, header: string): void {
			const column = this._grid.getColumn(columnBinding);

			if (column) {
				column.provider.header = header;
			} else {
				throw new Error(OSFramework.DataGrid.Enum.ErrorMessages.Column_NotFound);
			}
		}
	}
}
