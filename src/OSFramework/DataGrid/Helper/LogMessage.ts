/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSFramework.DataGrid.Helper {
	export const warningMessage = 'This API is deprecated please use the new api';

	/**
	 * @deprecated Use Logger.LogWarning() instead.
	 */
	export function LogWarningMessage(message: string): void {
		Logger.LogWarning(message);
	}
}
