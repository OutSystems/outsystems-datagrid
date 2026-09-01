namespace OutSystems.GridAPI.Sort {
	/**
	 * Function that clears sort of grid
	 *
	 * @export
	 * @param {string} gridID ID of the Grid that is to be to check from results.
	 * @returns {*}  {string} Return Message containing the resulting code from sorting columns and the error message in case of failure
	 */
	export function Clear(gridID: string): string {
		Performance.SetMark('Sort.Clear');
		OSFramework.DataGrid.Helper.Logger.LogDebug(`Clear inputs: gridID=${gridID}`, `Grid:${gridID}`);
		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedClearSort,
			callback: () => {
				GridManager.GetGridById(gridID).features.sort.clear();
			},
		});

		Performance.SetMark('Sort.Clear-end');
		Performance.GetMeasure('@datagrid-Sort.Clear', 'Sort.Clear', 'Sort.Clear-end');

		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`Clear output: ${OSFramework.DataGrid.Helper.Logger.SafeStringify(result)}`,
			`Grid:${gridID}`
		);
		return result;
	}

	/**
	 * Function that sorts a Grid column based in its ID and on a sorting
	 *
	 * @export
	 * @param {string} gridID ID of the Grid that is to be to check from results.
	 * @param {string} columnID
	 * @param {OSFramework.DataGrid.OSStructure.Sorting} sorting
	 * @return {*}  {string} Return Message containing the resulting code from sorting columns and the error message in case of failure
	 */
	export function ColumnSort(
		gridID: string,
		columnID: string,
		sorting: OSFramework.DataGrid.OSStructure.Sorting
	): string {
		Performance.SetMark('Sort.ColumnSort');
		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`ColumnSort inputs: gridID=${gridID}, columnID=${columnID}, sorting=${OSFramework.DataGrid.Helper.Logger.SafeStringify(sorting)}`,
			`Grid:${gridID}`
		);
		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedColumnSort,
			callback: () => {
				GridManager.GetGridById(gridID).features.sort.sortColumn(columnID, sorting);
			},
		});

		Performance.SetMark('Sort.ColumnSort-end');
		Performance.GetMeasure('@datagrid-Sort.ColumnSort', 'Sort.ColumnSort', 'Sort.ColumnSort-end');

		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`ColumnSort output: ${OSFramework.DataGrid.Helper.Logger.SafeStringify(result)}`,
			`Grid:${gridID}`
		);
		return result;
	}
	/**
	 * Function that defines whether or not Grid will have Unsort State
	 *
	 * @export
	 * @param {string} gridID ID of the Grid that is to be to check from results.
	 * @param {boolean} hasUnsortState Set to True to add a third state to columns sorting that unsorts the column.
	 * @return {*}  {string} Return Message containing the resulting code from sorting columns and the error message in case of failure
	 */
	export function SetUnsortState(gridID: string, hasUnsortState: boolean): string {
		Performance.SetMark('Sort.SetUnsortState');
		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`SetUnsortState inputs: gridID=${gridID}, hasUnsortState=${OSFramework.DataGrid.Helper.Logger.SafeStringify(hasUnsortState)}`,
			`Grid:${gridID}`
		);
		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedSetUnsortState,
			callback: () => {
				GridManager.GetGridById(gridID).features.sort.setUnsortState(hasUnsortState);
			},
		});

		Performance.SetMark('Sort.SetUnsortState-end');
		Performance.GetMeasure('@datagrid-Sort.SetUnsortState', 'Sort.SetUnsortState', 'Sort.SetUnsortState-end');

		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`SetUnsortState output: ${OSFramework.DataGrid.Helper.Logger.SafeStringify(result)}`,
			`Grid:${gridID}`
		);
		return result;
	}
}

/**
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.Sort {
	export function Clear(gridID: string): string {
		OSFramework.DataGrid.Helper.LogWarningMessage(
			`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Sort.Clear()'`
		);
		return OutSystems.GridAPI.Sort.Clear(gridID);
	}

	export function ColumnSort(
		gridID: string,
		columnID: string,
		sorting: OSFramework.DataGrid.OSStructure.Sorting
	): string {
		OSFramework.DataGrid.Helper.LogWarningMessage(
			`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Sort.ColumnSort()'`
		);
		return OutSystems.GridAPI.Sort.ColumnSort(gridID, columnID, sorting);
	}

	export function SetUnsortState(gridID: string, hasUnsortState: boolean): string {
		OSFramework.DataGrid.Helper.LogWarningMessage(
			`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Sort.SetUnsortState()'`
		);
		return OutSystems.GridAPI.Sort.SetUnsortState(gridID, hasUnsortState);
	}
}
