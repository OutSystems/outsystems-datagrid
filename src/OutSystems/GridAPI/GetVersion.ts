/**
 * Namespace for all public methods to access and use the OutSystems Data Grid component.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.GridAPI {
	/**
	 * Function that returns the OutSystems DataGrid version value
	 *
	 * @export
	 * @return {*}  {string}
	 */
	export function GetVersion(): string {
		OSFramework.DataGrid.Helper.Logger.LogDebug(`GetVersion called`, 'GridAPI');
		const result = OSFramework.DataGrid.Constants.OSDataGridVersion;
		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`GetVersion output: ${OSFramework.DataGrid.Helper.Logger.SafeStringify(result)}`,
			'GridAPI'
		);
		return result;
	}

	/**
	 * Function that returns the Wijmo FlexGrid version value
	 * @export
	 * @return {*}  {string}
	 */
	export function GetWijmoFlexGridVersion(): string {
		OSFramework.DataGrid.Helper.Logger.LogDebug(`GetWijmoFlexGridVersion called`, 'GridAPI');
		const result = OSFramework.DataGrid.Constants.WijmoFlexGridVersion;
		OSFramework.DataGrid.Helper.Logger.LogDebug(
			`GetWijmoFlexGridVersion output: ${OSFramework.DataGrid.Helper.Logger.SafeStringify(result)}`,
			'GridAPI'
		);
		return result;
	}
}
