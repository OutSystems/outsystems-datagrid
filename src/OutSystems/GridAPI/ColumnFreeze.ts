/**
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.GridAPI.ColumnFreeze {
	/**
	 * Responsable for freeze columns
	 * @param gridID The grid where the action will be performed
	 * @param n Number of columns to freeze, when omitted the active cell will be used, and everything to its left will be freeze
	 */
	export function Freeze(gridID: string, n?: number): string {
		Performance.SetMark('ColumnFreeze.freeze');
		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedFreezeColumns,
			callback: () => {
				GridManager.GetGridById(gridID).features.columnFreeze.leftColumns(n);
			},
		});

		Performance.SetMark('ColumnFreeze.freeze-end');
		Performance.GetMeasure('@datagrid-ColumnFreeze.freeze', 'ColumnFreeze.freeze', 'ColumnFreeze.freeze-end');

		return result;
	}

	/**
	 * Verifies if Grid has or not freezed columns
	 * @param gridID The grid where the action will be performed
	 */
	export function IsFrozen(gridID: string): string {
		Performance.SetMark('ColumnFreeze.isFrozen');
		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedHasFrozenColumns,
			callback: () => {
				return GridManager.GetGridById(gridID).features.columnFreeze.isFrozen;
			},
			hasValue: true,
		});

		Performance.SetMark('ColumnFreeze.isFrozen-end');
		Performance.GetMeasure('@datagrid-ColumnFreeze.isFrozen', 'ColumnFreeze.isFrozen', 'ColumnFreeze.isFrozen-end');
		return result;
	}

	/**
	 * Responsable for free-up all columns freezed
	 * @param gridID The grid where the action will be performed
	 */
	export function Unfreeze(gridID: string): string {
		Performance.SetMark('ColumnFreeze.unfreeze');
		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedUnfreezeColumns,
			callback: () => {
				GridManager.GetGridById(gridID).features.columnFreeze.unfreeze();
			},
		});

		Performance.SetMark('ColumnFreeze.unfreeze-end');
		Performance.GetMeasure('@datagrid-ColumnFreeze.unfreeze', 'ColumnFreeze.unfreeze', 'ColumnFreeze.unfreeze-end');

		return result;
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.ColumnFreeze {
	/**
	 * Responsable for freeze columns
	 * @param gridID The grid where the action will be performed
	 * @param n Number of columns to freeze, when omitted the active cell will be used, and everything to its left will be freeze
	 */
	export function Freeze(gridID: string, n?: number): string {
		OSFramework.DataGrid.Helper.LogWarningMessage(
			`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.ColumnFreeze.Freeze()'`
		);
		return OutSystems.GridAPI.ColumnFreeze.Freeze(gridID, n);
	}

	/**
	 * Verifies if Grid has or not freezed columns
	 * @param gridID The grid where the action will be performed
	 */
	export function IsFrozen(gridID: string): string {
		OSFramework.DataGrid.Helper.LogWarningMessage(
			`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.ColumnFreeze.IsFrozen()'`
		);
		return OutSystems.GridAPI.ColumnFreeze.IsFrozen(gridID);
	}

	/**
	 * Responsable for free-up all columns freezed
	 * @param gridID The grid where the action will be performed
	 */
	export function Unfreeze(gridID: string): string {
		OSFramework.DataGrid.Helper.LogWarningMessage(
			`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.ColumnFreeze.Unfreeze()'`
		);
		return OutSystems.GridAPI.ColumnFreeze.Unfreeze(gridID);
	}
}
