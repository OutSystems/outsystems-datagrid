// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
	// export class Builder extends Validation implements OSFramework.DataGrid.Interface.IBuilder {
	export class ColumnAggregate
		implements
			OSFramework.DataGrid.Feature.IColumnAggregate,
			OSFramework.DataGrid.Interface.IBuilder,
			OSFramework.DataGrid.Interface.IDisposable
	{
		private _aggregateRow: wijmo.grid.GroupRow;
		private _cellClasses: Map<string, Array<string>>;
		private _grid: Grid.IGridWijmo;
		private _showAggregateValue: boolean;

		constructor(grid: Grid.IGridWijmo, showAggregateValue: boolean) {
			this._grid = grid;
			this._showAggregateValue = showAggregateValue;
			this._cellClasses = new Map<string, Array<string>>();
		}

		private _formatItem(s: wijmo.grid.FlexGrid, e: wijmo.grid.FormatItemEventArgs) {
			if (e.panel.cellType === wijmo.grid.CellType.ColumnFooter) {
				const binding = this._grid.provider.columns[e.col].binding;
				const classesToAdd = this._cellClasses.get(binding);
				classesToAdd?.forEach((className) => wijmo.addClass(e.cell, className));
			}
		}

		/**
		 * Function to add the aggregate cell class
		 *
		 * @param columnBinding {string} => The column binding of the aggregate to add the class
		 * @param className {string} => Classname to be added
		 */
		public addClass(columnBinding: string, className: string): void {
			let cellClassArray = [];

			// Get the array associated with the column binding, if it exists.
			if (this._cellClasses.has(columnBinding)) cellClassArray = this._cellClasses.get(columnBinding);

			// If the className does not exists in the cellClassArray yet, we should add it
			const shouldAdd = cellClassArray.findIndex((cellClassName) => cellClassName === className) === -1;

			// If shouldAdd is true and the className does not exist in the array yet, let's add it.
			if (shouldAdd) {
				cellClassArray = [...cellClassArray, className]; // append new className to the cellClassArray array
				this._cellClasses.set(columnBinding, cellClassArray); // update the cellClassArray associated with the biding
			}
		}

		public build(): void {
			this.setState(this._showAggregateValue);
			this._grid.provider.formatItem.addHandler(this._formatItem.bind(this));
		}

		public dispose(): void {
			this._grid.provider.formatItem.removeHandler(this._formatItem.bind(this));
		}

		/**
		 * Function to remove the aggregate cell class
		 *
		 * @param columnBinding {string} => The column binding of the aggregate to add the class
		 * @param className {string} => Classname to be added
		 */
		public removeClass(columnBinding: string, className: string): void {
			// If the columnBinding does not in the _cellClasses, no action is required
			if (!this._cellClasses.has(columnBinding)) return;

			// Get the array associated with the column binding
			const cellClassArray = this._cellClasses.get(columnBinding);

			// Get the className index in the array.
			const classIndex = cellClassArray.findIndex((cellClassName) => cellClassName === className);

			// If the className exists in the array, let's remove it.
			if (classIndex > -1) {
				// Remove the desired className
				cellClassArray.splice(classIndex, 1);

				// If the array is not empty, update it.
				// Otherwise, delete the binding element from the Map
				if (cellClassArray.length > 0) this._cellClasses.set(columnBinding, cellClassArray);
				else this._cellClasses.delete(columnBinding);
			}
		}

		/**
		 * Function that will set the conditional format to the aggregate rows
		 *
		 * @param columnID {string} => The columnID of the aggregate to add the new conditional format rules
		 * @param conditionalFormat {string} => String containing the conditional format rules
		 */
		public setConditionalFormat(columnID: string, conditionalFormat: string): void {
			const column = this._grid.getColumn(columnID);

			if (!column) {
				throw new Error(OSFramework.DataGrid.Enum.ErrorMessages.InvalidColumnIdentifier);
			}

			if (column.provider.aggregate === wijmo.Aggregate.None) {
				throw new Error(OSFramework.DataGrid.Enum.ErrorMessages.Aggregate_NotFound);
			}

			if (
				!(
					column.columnType === OSFramework.DataGrid.Enum.ColumnType.Number ||
					column.columnType === OSFramework.DataGrid.Enum.ColumnType.Currency
				)
			)
				throw new Error(
					`It seems you are trying to add the conditional format to a ${column.columnType}Column's aggregate. This is not allowed, try to use Number and Currency column instead.`
				);

			this._grid.features.conditionalFormat.addAggregateRules(
				column.config.binding,
				JSON.parse(conditionalFormat)
			);

			this._grid.provider.collectionView.refresh();
		}

		/**
		 * Function that will add/remove row footer to show aggregate values
		 *
		 * @param value {boolean} True => Adds aggregate footer , False => Removes aggregate footer
		 */
		public setState(value: boolean): void {
			if (value) {
				if (this._aggregateRow === undefined) {
					this._aggregateRow = new wijmo.grid.GroupRow();
				}
				this._grid.provider.columnFooters.rows.push(this._aggregateRow);
			} else {
				const aggregateRow = this._grid.provider.columnFooters.rows.find(
					(row) => row.index === this._aggregateRow.index
				);

				// we only want to remove the row, if it exists
				if (aggregateRow) this._grid.provider.columnFooters.rows.remove(aggregateRow);
			}
		}
	}
}
