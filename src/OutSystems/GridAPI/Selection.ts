namespace OutSystems.GridAPI.Selection {
	export function GetAllSelections(gridID: string): string {
		Performance.SetMark('Selection.GetAllSelections');

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
		return result;
	}

	export function GetAllSelectionsData(gridID: string): string {
		Performance.SetMark('Selection.GetAllSelectionsData');

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

		return result;
	}

	export function GetCheckedRowsData(gridID: string): string {
		Performance.SetMark('Selection.GetCheckedRowsData');

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
		return result;
	}

	export function GetSelectedRowsCount(gridID: string): string {
		Performance.SetMark('Selection.GetSelectedRowsCount');

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
		return result;
	}

	export function GetSelectedRowsData(gridID: string): string {
		Performance.SetMark('Selection.GetSelectedRowsData');

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
		return result;
	}

	export function GetSelectionAverage(gridID: string): string {
		Performance.SetMark('Selection.GetSelectionAverage');

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
		return result;
	}

	export function GetSelectionCount(gridID: string): string {
		Performance.SetMark('Selection.GetSelectionCount');

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
		return result;
	}

	export function GetSelectionMax(gridID: string): string {
		Performance.SetMark('Selection.GetSelectionMax');

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
		return result;
	}

	export function GetSelectionMin(gridID: string): string {
		Performance.SetMark('Selection.GetSelectionMin');

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
		return result;
	}

	export function GetSelectionSum(gridID: string): string {
		Performance.SetMark('Selection.GetSelectionSum');

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
		return result;
	}

	export function HasSelectedRows(gridID: string): string {
		Performance.SetMark('Selection.HasSelectedRows');

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
		return result;
	}

	export function SetRowAsSelected(gridID: string, rowsIndex: number[], isSelected = true): string {
		Performance.SetMark('Selection.SelectRows');

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
