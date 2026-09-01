namespace OutSystems.GridAPI.Selection {
	export function GetAllSelections(gridID: string): string {
		Performance.SetMark('Selection.GetAllSelections');
		OSFramework.DataGrid.Helper.Logger.LogDebug(`GetAllSelections inputs: gridID=${gridID}`, `Grid:${gridID}`);

		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedGetAllSelections,
			callback: () => {
				const grid = GridManager.GetGridById(gridID);

				return grid.features.selection.getAllSelections();
			},
			hasValue: true,
		});

		Performance.SetMark('Selection.GetAllSelections-end');
		Performance.GetMeasure(
			'@datagrid-Selection.GetAllSelections',
			'Selection.GetAllSelections',
			'Selection.GetAllSelections-end'
		);
		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`GetAllSelections output: ${OSFramework.DataGrid.Helper.Logger.SafeStringify(result)}`,
			`Grid:${gridID}`
		);
		return result;
	}

	export function GetAllSelectionsData(gridID: string): string {
		Performance.SetMark('Selection.GetAllSelectionsData');
		OSFramework.DataGrid.Helper.Logger.LogDebug(`GetAllSelectionsData inputs: gridID=${gridID}`, `Grid:${gridID}`);

		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedGetAllSelectionsData,
			callback: () => {
				const grid = GridManager.GetGridById(gridID);

				return grid.features.selection.getAllSelectionsData();
			},
			hasValue: true,
		});

		Performance.SetMark('Selection.GetAllSelectionsData-end');
		Performance.GetMeasure(
			'@datagrid-Selection.GetAllSelectionsData',
			'Selection.GetAllSelectionsData',
			'Selection.GetAllSelectionsData-end'
		);

		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`GetAllSelectionsData output: ${OSFramework.DataGrid.Helper.Logger.SafeStringify(result)}`,
			`Grid:${gridID}`
		);
		return result;
	}

	export function GetCheckedRowsData(gridID: string): string {
		Performance.SetMark('Selection.GetCheckedRowsData');
		OSFramework.DataGrid.Helper.Logger.LogDebug(`GetCheckedRowsData inputs: gridID=${gridID}`, `Grid:${gridID}`);

		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedGetCheckedRowsData,
			callback: () => {
				const grid = GridManager.GetGridById(gridID);

				return grid.features.selection.getCheckedRowsData();
			},
			hasValue: true,
		});

		Performance.SetMark('Selection.GetCheckedRowsData-end');
		Performance.GetMeasure(
			'@datagrid-Selection.GetCheckedRowsData',
			'Selection.GetCheckedRowsData',
			'Selection.GetCheckedRowsData-end'
		);
		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`GetCheckedRowsData output: ${OSFramework.DataGrid.Helper.Logger.SafeStringify(result)}`,
			`Grid:${gridID}`
		);
		return result;
	}

	export function GetSelectedRowsCount(gridID: string): string {
		Performance.SetMark('Selection.GetSelectedRowsCount');
		OSFramework.DataGrid.Helper.Logger.LogDebug(`GetSelectedRowsCount inputs: gridID=${gridID}`, `Grid:${gridID}`);

		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedGetSelectedRowsCount,
			callback: () => {
				const grid = GridManager.GetGridById(gridID);

				return grid.features.selection.getSelectedRowsCount();
			},
			hasValue: true,
			defaultFailValue: -1,
		});

		Performance.SetMark('Selection.GetSelectedRowsCount-end');
		Performance.GetMeasure(
			'@datagrid-Selection.GetSelectedRowsCount',
			'Selection.GetSelectedRowsCount',
			'Selection.GetSelectedRowsCount-end'
		);
		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`GetSelectedRowsCount output: ${OSFramework.DataGrid.Helper.Logger.SafeStringify(result)}`,
			`Grid:${gridID}`
		);
		return result;
	}

	export function GetSelectedRowsData(gridID: string): string {
		Performance.SetMark('Selection.GetSelectedRowsData');
		OSFramework.DataGrid.Helper.Logger.LogDebug(`GetSelectedRowsData inputs: gridID=${gridID}`, `Grid:${gridID}`);

		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedGetSelectedRowsData,
			callback: () => {
				const grid = GridManager.GetGridById(gridID);

				return grid.features.selection.getSelectedRowsData();
			},
			hasValue: true,
		});

		Performance.SetMark('Selection.GetSelectedRowsData-end');
		Performance.GetMeasure(
			'@datagrid-Selection.GetSelectedRowsData',
			'Selection.GetSelectedRowsData',
			'Selection.GetSelectedRowsData-end'
		);
		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`GetSelectedRowsData output: ${OSFramework.DataGrid.Helper.Logger.SafeStringify(result)}`,
			`Grid:${gridID}`
		);
		return result;
	}

	export function GetSelectionAverage(gridID: string): string {
		Performance.SetMark('Selection.GetSelectionAverage');
		OSFramework.DataGrid.Helper.Logger.LogDebug(`GetSelectionAverage inputs: gridID=${gridID}`, `Grid:${gridID}`);

		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedGetSelectionAverage,
			callback: () => {
				const grid = GridManager.GetGridById(gridID);

				return grid.features.selection.getSelectionAverage();
			},
			hasValue: true,
			defaultFailValue: -1,
		});

		Performance.SetMark('Selection.GetSelectionAverage-end');
		Performance.GetMeasure(
			'@datagrid-Selection.GetSelectionAverage',
			'Selection.GetSelectionAverage',
			'Selection.GetSelectionAverage-end'
		);
		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`GetSelectionAverage output: ${OSFramework.DataGrid.Helper.Logger.SafeStringify(result)}`,
			`Grid:${gridID}`
		);
		return result;
	}

	export function GetSelectionCount(gridID: string): string {
		Performance.SetMark('Selection.GetSelectionCount');
		OSFramework.DataGrid.Helper.Logger.LogDebug(`GetSelectionCount inputs: gridID=${gridID}`, `Grid:${gridID}`);

		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedGetSelectionCount,
			callback: () => {
				const grid = GridManager.GetGridById(gridID);

				return grid.features.selection.getSelectionCount();
			},
			hasValue: true,
			defaultFailValue: -1,
		});

		Performance.SetMark('Selection.GetSelectionCount-end');
		Performance.GetMeasure(
			'@datagrid-Selection.GetSelectionCount',
			'Selection.GetSelectionCount',
			'Selection.GetSelectionCount-end'
		);
		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`GetSelectionCount output: ${OSFramework.DataGrid.Helper.Logger.SafeStringify(result)}`,
			`Grid:${gridID}`
		);
		return result;
	}

	export function GetSelectionMax(gridID: string): string {
		Performance.SetMark('Selection.GetSelectionMax');
		OSFramework.DataGrid.Helper.Logger.LogDebug(`GetSelectionMax inputs: gridID=${gridID}`, `Grid:${gridID}`);

		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedGetSelectionMax,
			callback: () => {
				const grid = GridManager.GetGridById(gridID);

				return grid.features.selection.getSelectionMaxMin(true);
			},
			hasValue: true,
			defaultFailValue: -1,
		});

		Performance.SetMark('Selection.GetSelectionMax-end');
		Performance.GetMeasure(
			'@datagrid-Selection.GetSelectionMax',
			'Selection.GetSelectionMax',
			'Selection.GetSelectionMax-end'
		);
		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`GetSelectionMax output: ${OSFramework.DataGrid.Helper.Logger.SafeStringify(result)}`,
			`Grid:${gridID}`
		);
		return result;
	}

	export function GetSelectionMin(gridID: string): string {
		Performance.SetMark('Selection.GetSelectionMin');
		OSFramework.DataGrid.Helper.Logger.LogDebug(`GetSelectionMin inputs: gridID=${gridID}`, `Grid:${gridID}`);

		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedGetSelectionMin,
			callback: () => {
				const grid = GridManager.GetGridById(gridID);

				return grid.features.selection.getSelectionMaxMin(false);
			},
			hasValue: true,
			defaultFailValue: -1,
		});

		Performance.SetMark('Selection.GetSelectionMin-end');
		Performance.GetMeasure(
			'@datagrid-Selection.GetSelectionMin',
			'Selection.GetSelectionMin',
			'Selection.GetSelectionMin-end'
		);
		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`GetSelectionMin output: ${OSFramework.DataGrid.Helper.Logger.SafeStringify(result)}`,
			`Grid:${gridID}`
		);
		return result;
	}

	export function GetSelectionSum(gridID: string): string {
		Performance.SetMark('Selection.GetSelectionSum');
		OSFramework.DataGrid.Helper.Logger.LogDebug(`GetSelectionSum inputs: gridID=${gridID}`, `Grid:${gridID}`);

		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedGetSelectionSum,
			callback: () => {
				const grid = GridManager.GetGridById(gridID);

				return grid.features.selection.getSelectionSum();
			},
			hasValue: true,
			defaultFailValue: -1,
		});

		Performance.SetMark('Selection.GetSelectionSum-end');
		Performance.GetMeasure(
			'@datagrid-Selection.GetSelectionSum',
			'Selection.GetSelectionSum',
			'Selection.GetSelectionSum-end'
		);
		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`GetSelectionSum output: ${OSFramework.DataGrid.Helper.Logger.SafeStringify(result)}`,
			`Grid:${gridID}`
		);
		return result;
	}

	export function HasSelectedRows(gridID: string): string {
		Performance.SetMark('Selection.HasSelectedRows');
		OSFramework.DataGrid.Helper.Logger.LogDebug(`HasSelectedRows inputs: gridID=${gridID}`, `Grid:${gridID}`);

		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedHasSelectedRows,
			callback: () => {
				const grid = GridManager.GetGridById(gridID);

				return grid.features.selection.hasSelectedRows();
			},
			hasValue: true,
		});

		Performance.SetMark('Selection.HasSelectedRows-end');
		Performance.GetMeasure(
			'@datagrid-Selection.HasSelectedRows',
			'Selection.HasSelectedRows',
			'Selection.HasSelectedRows-end'
		);
		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`HasSelectedRows output: ${OSFramework.DataGrid.Helper.Logger.SafeStringify(result)}`,
			`Grid:${gridID}`
		);
		return result;
	}

	export function SetRowAsSelected(gridID: string, rowsIndex: number[], isSelected = true): string {
		Performance.SetMark('Selection.SelectRows');
		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`SetRowAsSelected inputs: gridID=${gridID}, rowsIndex=${OSFramework.DataGrid.Helper.Logger.SafeStringify(rowsIndex)}, isSelected=${OSFramework.DataGrid.Helper.Logger.SafeStringify(isSelected)}`,
			`Grid:${gridID}`
		);

		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedSetRowAsSelected,
			callback: () => {
				const grid = GridManager.GetGridById(gridID);

				return grid.features.selection.setRowAsSelected(rowsIndex, isSelected);
			},
		});

		Performance.SetMark('Selection.SelectRows-end');
		Performance.GetMeasure('@datagrid-Selection.SelectRows', 'Selection.SelectRows', 'Selection.SelectRows-end');
		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`SetRowAsSelected output: ${OSFramework.DataGrid.Helper.Logger.SafeStringify(result)}`,
			`Grid:${gridID}`
		);
		return result;
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.Selection {
	export function GetAllSelections(gridID: string): string {
		OSFramework.DataGrid.Helper.LogWarningMessage(
			`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Selection.GetAllSelections()'`
		);
		return OutSystems.GridAPI.Selection.GetAllSelections(gridID);
	}

	export function GetAllSelectionsData(gridID: string): string {
		OSFramework.DataGrid.Helper.LogWarningMessage(
			`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Selection.GetAllSelectionsData()'`
		);
		return OutSystems.GridAPI.Selection.GetAllSelectionsData(gridID);
	}

	export function GetCheckedRowsData(gridID: string): string {
		OSFramework.DataGrid.Helper.LogWarningMessage(
			`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Selection.GetCheckedRowsData()'`
		);
		return OutSystems.GridAPI.Selection.GetCheckedRowsData(gridID);
	}

	export function GetSelectedRowsCount(gridID: string): string {
		OSFramework.DataGrid.Helper.LogWarningMessage(
			`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Selection.GetSelectedRowsCount()'`
		);
		return OutSystems.GridAPI.Selection.GetSelectedRowsCount(gridID);
	}

	export function GetSelectedRowsData(gridID: string): string {
		OSFramework.DataGrid.Helper.LogWarningMessage(
			`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Selection.GetSelectedRowsData()'`
		);
		return OutSystems.GridAPI.Selection.GetSelectedRowsData(gridID);
	}

	export function HasSelectedRows(gridID: string): string {
		OSFramework.DataGrid.Helper.LogWarningMessage(
			`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Selection.HasSelectedRows()'`
		);
		return OutSystems.GridAPI.Selection.HasSelectedRows(gridID);
	}
}
