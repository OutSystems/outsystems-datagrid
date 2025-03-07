namespace OutSystems.GridAPI.ColumnManager {
	const columnMap = new Map<string, string>(); //column.uniqueId -> grid.uniqueId
	const columnArr = new Array<OSFramework.DataGrid.Column.IColumn>();

	/**
	 * Add a given column or columns list to the grid group panel.
	 *
	 * @export
	 * @param {string} gridID ID of the Grid where the change will occur.
	 * @param {string} ListOfColumnIDs List of Ids of the Column blocks that will be programmatically added to the grid group panel.
	 */
	export function AddColumnsToGroupPanel(gridID: string, ListOfColumnIDs: string): string {
		Performance.SetMark('ColumnManager.AddColumnToGroupPanel');
		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedAddColumnToGroupPanel,
			callback: () => {
				GridManager.GetGridById(gridID).features.groupPanel.addColumnsToGroupPanel(ListOfColumnIDs);
			},
		});

		Performance.SetMark('ColumnManager.AddColumnToGroupPanel-end');
		Performance.GetMeasure(
			'@datagrid-ColumnManager.AddColumnToGroupPanel',
			'ColumnManager.AddColumnToGroupPanel',
			'ColumnManager.AddColumnToGroupPanel-end'
		);

		return result;
	}

	/**
	 * Creates the column for the provider with the given configurations.
	 *
	 * @param {string} columnID id of the column with which actions on the column can be performed.
	 * @param {OSFramework.DataGrid.Enum.ColumnType} type type of column to be created.
	 * @param {string} [configs='{}'] configurations in JSON format.
	 * @param {string} [editorConfig='{}'] configurations to be used when the column is in edit mode.
	 * @returns {*}  {boolean} true if the column got created.
	 */
	export function CreateColumn(
		columnID: string,
		type: OSFramework.DataGrid.Enum.ColumnType,
		configs = '{}',
		editorConfig = '{}'
	): boolean {
		Performance.SetMark('ColumnManager.createColumn');

		editorConfig = editorConfig === '' ? '{}' : editorConfig;
		let output = false;
		let column: OSFramework.DataGrid.Column.IColumn;
		const grid = GetGridByColumnId(columnID);
		const jsonConfigs = JSON.parse(configs);
		const jsonEditorConfigs = JSON.parse(editorConfig);

		if (grid !== undefined) {
			column = Providers.DataGrid.Wijmo.Column.ColumnFactory.MakeColumn(
				grid,
				type,
				columnID,
				jsonConfigs,
				jsonEditorConfigs
			);

			columnArr.push(column);
			columnMap.set(columnID, grid.uniqueId);
			grid.addColumn(column);

			output = true;
		}

		Performance.SetMark('ColumnManager.createColumn-end');
		Performance.GetMeasure(
			'@datagrid-ColumnManager.createColumn',
			'ColumnManager.createColumn',
			'ColumnManager.createColumn-end'
		);
		return output;
	}

	/**
	 * Gets the grid to which the column belongs to.
	 *
	 * @param {string} columnID id of the column with which actions on the column can be performed.
	 * @returns {*}  {ColumnMapper} this structure has the id of Grid, and the reference to the instance of the grid.
	 */
	function GetGridByColumnId(columnID: string): OSFramework.DataGrid.Grid.IGrid {
		Performance.SetMark('ColumnManager.getGridByColumnId');

		let grid: OSFramework.DataGrid.Grid.IGrid;

		//ColumnId is the UniqueId
		if (columnMap.has(columnID)) {
			grid = GridManager.GetGridById(columnMap.get(columnID), false);
			//UniqueID not found
		} else {
			// Try to find its reference on DOM
			const elem = OSFramework.DataGrid.Helper.GetElementByUniqueId(columnID, false);

			// If element is found, means that the DOM was rendered
			if (elem !== undefined) {
				//Find the closest grid
				grid = OSFramework.DataGrid.Helper.GetClosestGrid(elem);
			}
			//TODO: [RGRIDT-623] By looking to the DOM first, maybe this 3rd possibility can be removed from here
			// Otherwise insert in active grid
			else {
				grid = GridManager.GetActiveGrid();
			}
		}

		Performance.SetMark('ColumnManager.getGridByColumnId-end');
		Performance.GetMeasure(
			'@datagrid-ColumnManager.getGridByColumnId',
			'ColumnManager.getGridByColumnId',
			'ColumnManager.getGridByColumnId-end'
		);
		return grid;
	}

	/**
	 * Returns a column based on ID
	 * @param columnID Column Id
	 */
	export function GetColumnById(columnID: string): OSFramework.DataGrid.Column.IColumn {
		// we want to return the last column in our array that matches our predicate
		return _.findLast(columnArr, (p) => p && p.equalsToID(columnID));
	}

	/**
	 * Changes the property of a given column.
	 *
	 * @export
	 * @param {string} columnID id of the column with which actions on the column can be performed.
	 * @param {string} propertyName name of the property to be changed - some properties of the provider might not work out of be box.
	 * @param {*} propertyValue value to which the property should be changed to.
	 */
	export function ChangeProperty(
		columnID: string,
		propertyName: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		propertyValue: any
	): void {
		Performance.SetMark('ColumnManager.changeProperty');

		const column = GetColumnById(columnID);
		if (column === undefined) {
			throw new Error(OSFramework.DataGrid.Enum.ErrorMessages.Column_NotFound);
		}

		const grid = column.grid;

		if (grid !== undefined) {
			grid.changeColumnProperty(columnID, propertyName, propertyValue);
		}
		Performance.SetMark('ColumnManager.changeProperty-end');
		Performance.GetMeasure(
			'@datagrid-ColumnManager.changeProperty',
			'ColumnManager.changeProperty',
			'ColumnManager.changeProperty-end'
		);
	}

	/**
	 * Destroys the column
	 *
	 * @export
	 * @param {string} columnID id of the column with which actions on the column can be performed.
	 */
	export function DestroyColumn(columnID: string): void {
		Performance.SetMark('ColumnManager.destroyColumn');

		const grid = GetGridByColumnId(columnID);

		grid && grid.removeColumn(columnID);
		columnMap.delete(columnID);
		columnArr.splice(
			columnArr.findIndex((p) => {
				return p && p.equalsToID(columnID);
			}),
			1
		);
		Performance.SetMark('ColumnManager.destroyColumn-end');
		Performance.GetMeasure(
			'@datagrid-ColumnManager.destroyColumn',
			'ColumnManager.destroyColumn',
			'ColumnManager.destroyColumn-end'
		);
	}

	/**
	 * Remove a given column or columns list from the grid group panel
	 *
	 * @export
	 * @param {string} gridID ID of the Grid where the change will occur.
	 * @param {string} ListOfColumnIDs List of Ids of the Column blocks that will be programmatically removed from the grid group panel.
	 */
	export function RemoveColumnsFromGroupPanel(gridID: string, ListOfColumnIDs: string): string {
		Performance.SetMark('ColumnManager.RemoveColumnsFromGroupPanel');
		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedRemoveColumnsFromGroupPanel,
			callback: () => {
				GridManager.GetGridById(gridID).features.groupPanel.removeColumnsFromGroupPanel(ListOfColumnIDs);
			},
		});

		Performance.SetMark('ColumnManager.RemoveColumnsFromGroupPanel-end');
		Performance.GetMeasure(
			'@datagrid-ColumnManager.RemoveColumnsFromGroupPanell',
			'ColumnManager.RemoveColumnsFromGroupPanel',
			'ColumnManager.RemoveColumnsFromGroupPanel-end'
		);

		return result;
	}

	/**
	 * Set column aggregate in group panel
	 *
	 * @export
	 * @param {string} gridID ID of the Grid where the change will occur.
	 * @param {string} columnID id of the column with which actions on the column can be performed.
	 * @param {number} aggregate aggregate that will be applied on group panel.
	 */
	export function SetColumnAggregate(gridID: string, columnID: string, aggregate: number): string {
		Performance.SetMark('ColumnManager.SetColumnAggregate');
		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedSetColumnAggregate,
			callback: () => {
				GridManager.GetGridById(gridID).features.groupPanel.setAggregate(columnID, aggregate);
			},
		});

		Performance.SetMark('ColumnManager.SetColumnAggregate-end');
		Performance.GetMeasure(
			'@datagrid-ColumnManager.SetColumnAggregate',
			'ColumnManager.SetColumnAggregate',
			'ColumnManager.SetColumnAggregate-end'
		);

		return result;
	}

	/**
	 *  Combines consecutive cells of a given grid column that have the same value into a single cell.
	 *
	 * @export
	 * @param {string} gridID
	 * @param {string} columnID
	 * @param {boolean} allowMerge
	 * @return {*}  {string}
	 */
	export function MergeColumnCells(gridID: string, columnID: string, allowMerge: boolean): string {
		Performance.SetMark('ColumnManager.AllowCellMerging');
		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedAllowCellMerging,
			callback: () => {
				GridManager.GetGridById(gridID).features.columnMergeCells.mergeColumnCells(columnID, allowMerge);
			},
		});

		Performance.SetMark('ColumnManager.AllowCellMerging-end');
		Performance.GetMeasure(
			'@datagrid-ColumnManager.AllowCellMerging',
			'ColumnManager.AllowCellMerging',
			'ColumnManager.AllowCellMerging-end'
		);

		return result;
	}

	/**
	 *  Changes column header
	 *
	 * @export
	 * @param {string} gridID
	 * @param {string} columnID
	 * @param {string} header
	 * @return {*}  {string}
	 */
	export function SetColumnHeader(gridID: string, columnID: string, header: string): string {
		Performance.SetMark('ColumnManager.SetColumnHeader');
		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedSetColumnHeader,
			callback: () => {
				GridManager.GetGridById(gridID).features.column.setColumnHeader(columnID, header);
			},
		});

		Performance.SetMark('ColumnManager.SetColumnHeader-end');
		Performance.GetMeasure(
			'@datagrid-ColumnManager.SetColumnHeader',
			'ColumnManager.SetColumnHeader',
			'ColumnManager.SetColumnHeader-end'
		);

		return result;
	}
}

/**
 * Namespace that contains functions responsible for interactions with columns.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.ColumnManager {
	/**
	 * Add a given column to the grid group panel.
	 *
	 * @export
	 * @param {string} gridID ID of the Grid where the change will occur.
	 * @param {string} columnID ID of the Column block that will be programmatically added to the grid group panel.
	 */
	export function AddColumnsToGroupPanel(gridID: string, ListOfColumnIDs: string): string {
		OSFramework.DataGrid.Helper.LogWarningMessage(
			`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.ColumnManager.AddColumnsToGroupPanel()'`
		);
		return OutSystems.GridAPI.ColumnManager.AddColumnsToGroupPanel(gridID, ListOfColumnIDs);
	}

	/**
	 * Creates the column for the provider with the given configurations.
	 *
	 * @param {string} columnID id of the column with which actions on the column can be performed.
	 * @param {OSFramework.DataGrid.Enum.ColumnType} type type of column to be created.
	 * @param {string} [configs='{}'] configurations in JSON format.
	 * @param {string} [editorConfig='{}'] configurations to be used when the column is in edit mode.
	 * @returns {*}  {boolean} true if the column got created.
	 */
	export function CreateColumn(
		columnID: string,
		type: OSFramework.DataGrid.Enum.ColumnType,
		configs = '{}',
		editorConfig = '{}'
	): boolean {
		OSFramework.DataGrid.Helper.LogWarningMessage(
			`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.ColumnManager.CreateColumn()'`
		);
		return OutSystems.GridAPI.ColumnManager.CreateColumn(columnID, type, configs, editorConfig);
	}

	/**
	 * Returns a column based on ID
	 * @param columnID Column Id
	 */
	export function GetColumnById(columnID: string): OSFramework.DataGrid.Column.IColumn {
		OSFramework.DataGrid.Helper.LogWarningMessage(
			`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.ColumnManager.GetColumnById()'`
		);
		return OutSystems.GridAPI.ColumnManager.GetColumnById(columnID);
	}

	/**
	 * Changes the property of a given column.
	 *
	 * @export
	 * @param {string} columnID id of the column with which actions on the column can be performed.
	 * @param {string} propertyName name of the property to be changed - some properties of the provider might not work out of be box.
	 * @param {*} propertyValue value to which the property should be changed to.
	 */
	export function ChangeProperty(
		columnID: string,
		propertyName: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		propertyValue: any
	): void {
		OSFramework.DataGrid.Helper.LogWarningMessage(
			`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.ColumnManager.ChangeProperty()'`
		);
		return OutSystems.GridAPI.ColumnManager.ChangeProperty(columnID, propertyName, propertyValue);
	}

	/**
	 * Destroys the column
	 *
	 * @export
	 * @param {string} columnID id of the column with which actions on the column can be performed.
	 */
	export function DestroyColumn(columnID: string): void {
		OSFramework.DataGrid.Helper.LogWarningMessage(
			`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.ColumnManager.DestroyColumn()'`
		);
		return OutSystems.GridAPI.ColumnManager.DestroyColumn(columnID);
	}

	/**
	 * Set column aggregate in group panel
	 *
	 * @export
	 * @param {string} gridID ID of the Grid where the change will occur.
	 * @param {string} columnID id of the column with which actions on the column can be performed.
	 * @param {number} aggregate aggregate that will be applied on group panel.
	 */
	export function SetColumnAggregate(gridID: string, columnID: string, aggregate: number): string {
		OSFramework.DataGrid.Helper.LogWarningMessage(
			`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.ColumnManager.SetColumnAggregate()'`
		);
		return OutSystems.GridAPI.ColumnManager.SetColumnAggregate(gridID, columnID, aggregate);
	}

	/**
	 *  Combines consecutive cells of a given grid column that have the same value into a single cell.
	 *
	 * @export
	 * @param {string} gridID
	 * @param {string} columnID
	 * @param {boolean} allowMerge
	 * @return {*}  {string}
	 */
	export function MergeColumnCells(gridID: string, columnID: string, allowMerge: boolean): string {
		OSFramework.DataGrid.Helper.LogWarningMessage(
			`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.ColumnManager.MergeColumnCells()'`
		);
		return OutSystems.GridAPI.ColumnManager.MergeColumnCells(gridID, columnID, allowMerge);
	}

	/**
	 *  Changes column header
	 *
	 * @export
	 * @param {string} gridID
	 * @param {string} columnID
	 * @param {string} header
	 * @return {*}  {string}
	 */
	export function SetColumnHeader(gridID: string, columnID: string, header: string): string {
		OSFramework.DataGrid.Helper.LogWarningMessage(
			`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.ColumnManager.SetColumnHeader()'`
		);
		return OutSystems.GridAPI.ColumnManager.SetColumnHeader(gridID, columnID, header);
	}
}
