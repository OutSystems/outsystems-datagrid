namespace OutSystems.GridAPI.View {
	/**
	 * Get the current layout of a given grid
	 * @param gridID Grid ID
	 * @returns A JSON representing the current grid configuration
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export function GetViewLayout(gridID: string): string {
		Performance.SetMark('View.GetViewLayout');
		OSFramework.DataGrid.Helper.Logger.LogDebug(`GetViewLayout inputs: gridID=${gridID}`, `Grid:${gridID}`);

		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedGetViewLayout,
			callback: () => {
				return GridManager.GetGridById(gridID).getViewLayout();
			},
			hasValue: true,
		});

		Performance.SetMark('View.GetViewLayout-end');
		Performance.GetMeasure('@datagrid-View.GetViewLayout', 'View.GetViewLayout', 'View.GetViewLayout-end');

		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`GetViewLayout output: ${OSFramework.DataGrid.Helper.Logger.SafeStringify(result)}`,
			`Grid:${gridID}`
		);
		return result;
	}

	/**
	 * Load a predefined layout on a given grid
	 * @param gridID Grid ID
	 * @param config A JSON representing a previous saved visualization
	 */
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
	export function SetViewLayout(gridID: string, config: any): any {
		Performance.SetMark('View.SetViewLayout');
		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`SetViewLayout inputs: gridID=${gridID}, config=${OSFramework.DataGrid.Helper.Logger.SafeStringify(config)}`,
			`Grid:${gridID}`
		);

		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedSetViewLayout,
			callback: () => {
				return GridManager.GetGridById(gridID).setViewLayout(config);
			},
		});

		Performance.SetMark('View.SetViewLayout-end');
		Performance.GetMeasure('@datagrid-View.SetViewLayout', 'View.SetViewLayout', 'View.SetViewLayout-end');

		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`SetViewLayout output: ${OSFramework.DataGrid.Helper.Logger.SafeStringify(result)}`,
			`Grid:${gridID}`
		);
		return result;
	}

	/**
	 * Get the current layout of a given grid
	 * @param gridID Grid ID
	 * @returns A JSON representing the current grid configuration
	 */
	export function GetColumnsOrder(gridID: string): string {
		Performance.SetMark('View.GetColumnsOrder');
		OSFramework.DataGrid.Helper.Logger.LogDebug(`GetColumnsOrder inputs: gridID=${gridID}`, `Grid:${gridID}`);

		const result = Auxiliary.CreateApiResponse({
			gridID,
			errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedAddClass,
			callback: () => {
				return GridManager.GetGridById(gridID).features.column.getColumnsOrder();
			},
			hasValue: true,
		});

		Performance.SetMark('View.GetColumnsOrder-end');
		Performance.GetMeasure('@datagrid-View.GetColumnsOrder', 'View.GetColumnsOrder', 'View.GetColumnsOrder-end');

		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`GetColumnsOrder output: ${OSFramework.DataGrid.Helper.Logger.SafeStringify(result)}`,
			`Grid:${gridID}`
		);
		return result;
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI {
	/**
	 * API used for saving and load View definitions
	 */
	export namespace View {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		export function GetViewLayout(gridID: string): string {
			OSFramework.DataGrid.Helper.LogWarningMessage(
				`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.View.GetViewLayout()'`
			);
			return OutSystems.GridAPI.View.GetViewLayout(gridID);
		}

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		export function SetViewLayout(gridID: string, config: any): any {
			OSFramework.DataGrid.Helper.LogWarningMessage(
				`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.View.SetViewLayout()'`
			);
			return OutSystems.GridAPI.View.SetViewLayout(gridID, config);
		}
	}
}
