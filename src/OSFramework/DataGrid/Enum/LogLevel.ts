/**
 * Available levels for the Grid's console logging.
 * Each level also includes the levels below it (Debug ⊃ Info ⊃ Warning ⊃ Error).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Enum {
	export enum LogLevel {
		None = 0,
		Error = 1,
		Warning = 2,
		Info = 3,
		Debug = 4,
	}
}
