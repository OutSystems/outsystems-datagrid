// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Interface {
	/**
	 * Define signature for OS communications
	 * This method should be defined wherever need a JSON.stringify
	 *
	 * @example GridAPI.Selection.getAllSelectionsDataSource
	 */
	export interface ISerializable {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		serialize(): Types.RowData;
	}
}
