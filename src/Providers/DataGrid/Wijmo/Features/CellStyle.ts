// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
	export class CellStyle implements OSFramework.DataGrid.Interface.IBuilder, OSFramework.DataGrid.Feature.ICellStyle {
		private _grid: Grid.IGridWijmo;
		private readonly _internalLabel = OSFramework.DataGrid.Enum.RowMetadata.CellStyle;
		private _metadata: OSFramework.DataGrid.Interface.IRowMetadata;

		constructor(grid: Grid.IGridWijmo) {
			this._grid = grid;
			this._metadata = this._grid.rowMetadata;
		}

		private _formatItems(grid: wijmo.grid.FlexGrid, e: wijmo.grid.FormatItemEventArgs) {
			if (e.panel.cellType === wijmo.grid.CellType.Cell) {
				const cssMetadata = this.getMetadata(e.row).cssClass;
				const binding = this._grid.provider.getColumn(e.col).binding;

				if (cssMetadata.size > 0 && cssMetadata.get(binding)) {
					this.getMetadata(e.row)
						.cssClass.get(this._grid.provider.getColumn(e.col).binding)
						.forEach((className) => {
							wijmo.addClass(e.cell, className);
						});
				}
			}
		}

		public addClass(binding: string, rowNumber: number, className: string, refresh = false): void {
			this.getMetadata(rowNumber).addClass(binding, className);

			// we only want to force refresh on specific cases, as this could cause infinite renders on grid
			if (refresh) {
				this._grid.provider.invalidate();
			}
		}

		public build(): void {
			this._grid.provider.formatItem.addHandler(this._formatItems.bind(this));
		}

		public clear(): void {
			this._metadata.clearProperty(this._internalLabel);
			this._grid.provider.invalidate(); //Mark to be refreshed
		}

		public getMetadata(rowNumber: number): OSFramework.DataGrid.Feature.Auxiliar.CellStyleInfo {
			if (!this.hasMetadata(rowNumber))
				this._metadata.setMetadataByRowNumber(
					rowNumber,
					this._internalLabel,
					new OSFramework.DataGrid.Feature.Auxiliar.CellStyleInfo()
				);

			return this._metadata.getMetadataByRowNumber(
				rowNumber,
				this._internalLabel
			) as OSFramework.DataGrid.Feature.Auxiliar.CellStyleInfo;
		}

		public hasMetadata(rowNumber: number): boolean {
			return this._metadata.hasOwnPropertyByRowNumber(rowNumber, this._internalLabel);
		}

		public removeAllClasses(rowNumber: number, binding: string, refresh = false): void {
			this.getMetadata(rowNumber).removeAllClasses(binding);

			// we only want to force refresh on specific cases, as this could cause infinite renders on grid
			if (refresh) {
				this._grid.provider.invalidate();
			}
		}

		public removeClass(
			rowNumber: number,
			binding: string,
			className: string,
			refresh = false
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		): any {
			this.getMetadata(rowNumber).removeClass(binding, className);

			// we only want to force refresh on specific cases, as this could cause infinite renders on grid
			if (refresh) {
				this._grid.provider.invalidate();
			}
		}
	}
}
