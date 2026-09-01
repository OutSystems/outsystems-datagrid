/**
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.GridAPI.Auxiliary {
	type APIHandler = {
		// eslint-disable-next-line
		callback: any;
		defaultFailValue?: unknown;
		errorCode: OSFramework.DataGrid.Enum.ErrorCodes;
		gridID: string;
		hasValue?: boolean;
	};

	type APIResponse = {
		code: OSFramework.DataGrid.Enum.ErrorCodes;
		isSuccess: boolean;
		message: OSFramework.DataGrid.Enum.ErrorMessages;
		// eslint-disable-next-line
		value?: any;
	};

	export function CreateApiResponse({
		gridID,
		callback,
		errorCode,
		hasValue = false,
		defaultFailValue = undefined,
	}: APIHandler): string {
		const responseObj: APIResponse = {
			isSuccess: true,
			message: OSFramework.DataGrid.Enum.ErrorMessages.SuccessMessage,
			code: OSFramework.DataGrid.Enum.ErrorCodes.GRID_SUCCESS,
		};

		if (!OSFramework.DataGrid.Helper.IsGridReady(gridID)) {
			responseObj.isSuccess = false;
			responseObj.message = OSFramework.DataGrid.Enum.ErrorMessages.Grid_NotFound;
			responseObj.code = OSFramework.DataGrid.Enum.ErrorCodes.CFG_GridNotFound;
			responseObj.value = defaultFailValue;
			return JSON.stringify(responseObj);
		}

		try {
			if (hasValue) {
				responseObj.value = callback();
			} else {
				callback();
			}
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = errorCode;
			responseObj.value = defaultFailValue;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Receives a string and generates the hashcode of it.
	 * @param str - string, typically the data to be showed in the grid.
	 * @returns hashcode to the str
	 */
	export function GetHashCode(str: string): number {
		OSFramework.DataGrid.Helper.Logger.LogDebug(`GetHashCode inputs: str=${str}`, 'GridAPI');
		const result = OSFramework.DataGrid.Helper.GenerateHashCode(str);
		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`GetHashCode output: ${OSFramework.DataGrid.Helper.Logger.SafeStringify(result)}`,
			'GridAPI'
		);
		return result;
	}

	/**
	 * Gets the console logging level currently applied to all Grids on the page.
	 *
	 * @export
	 * @returns {*}  {OSFramework.DataGrid.Enum.LogLevel} Level currently applied.
	 */
	export function GetLogLevel(): OSFramework.DataGrid.Enum.LogLevel {
		OSFramework.DataGrid.Helper.Logger.LogDebug(`GetLogLevel called`, 'GridAPI');
		const result = OSFramework.DataGrid.Helper.Logger.GetLevel();
		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`GetLogLevel output: ${OSFramework.DataGrid.Helper.Logger.SafeStringify(result)}`,
			'GridAPI'
		);
		return result;
	}

	/**
	 * Receives a function and its name. Executes it and measures it properly.
	 * @param functionName Name of the function that will be measured
	 * @param fn Function that will be measured and executed
	 * @returns Output of the received function
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export function MeasurePerformance<T extends (...args: any[]) => any>(functionName: string, fn: T): T {
		return ((...args: Parameters<T>): ReturnType<T> => {
			OutSystems.GridAPI.Performance.SetMark(functionName);
			const result = fn(...args);

			OutSystems.GridAPI.Performance.SetMark(`${functionName}-end`);
			OutSystems.GridAPI.Performance.GetMeasure(`@datagrid-${functionName}`, functionName, `${functionName}-end`);

			return result;
		}) as T;
	}

	/**
	 * Sets the console logging level for all Grids on the page.
	 * Client-side only — no server call is involved. Defaults to Warning, so
	 * informational messages are silent unless verbosity is raised here.
	 *
	 * @export
	 * @param {OSFramework.DataGrid.Enum.LogLevel} level Level to apply:
	 * 0 = None, 1 = Error, 2 = Warning (default), 3 = Info, 4 = Debug.
	 * @returns {*}  {void}
	 */
	export function SetLogLevel(level: OSFramework.DataGrid.Enum.LogLevel): void {
		Performance.SetMark('Auxiliary.SetLogLevel');
		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`SetLogLevel inputs: level=${OSFramework.DataGrid.Helper.Logger.SafeStringify(level)}`,
			'GridAPI'
		);
		try {
			OSFramework.DataGrid.Helper.Logger.SetLevel(level);
		} finally {
			Performance.SetMark('Auxiliary.SetLogLevel-end');
			Performance.GetMeasure(
				'@datagrid-Auxiliary.SetLogLevel',
				'Auxiliary.SetLogLevel',
				'Auxiliary.SetLogLevel-end'
			);
		}
	}
}
/// Overrides for the old namespace - calls the new one, lets users know this is no longer in use

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.Auxiliary {
	type APIHandler = {
		// eslint-disable-next-line
		callback: any;
		errorCode: OSFramework.DataGrid.Enum.ErrorCodes;
		gridID: string;
		hasValue?: boolean;
	};

	export function CreateApiResponse({ gridID, callback, errorCode, hasValue = false }: APIHandler): string {
		OSFramework.DataGrid.Helper.LogWarningMessage(
			`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Auxiliary.CreateApiResponse()'`
		);

		return OutSystems.GridAPI.Auxiliary.CreateApiResponse({
			gridID,
			callback,
			errorCode,
			hasValue,
		});
	}

	/**
	 * Receives a string and generates the hashcode of it.
	 * @param str - string, typically the data to be showed in the grid.
	 * @returns hashcode to the str
	 */
	export function GetHashCode(str: string): number {
		OSFramework.DataGrid.Helper.LogWarningMessage(
			`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Auxiliary.GetHashCode()'`
		);
		return OutSystems.GridAPI.Auxiliary.GetHashCode(str);
	}
}
