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
	// test comment
	export function GetVersion(): string {
		return OSFramework.DataGrid.Constants.OSDataGridVersion;
	}

	/**
	 * Function that returns the Wijmo FlexGrid version value
	 * @export
	 * @return {*}  {string}
	 */
	export function GetWijmoFlexGridVersion(): string {
		return OSFramework.DataGrid.Constants.WijmoFlexGridVersion;
	}
}
