// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Logging {
	/**
	 * Record written once per page load, before the entries. Together, wallClock and time let every
	 * entry time (performance.now()) be converted to a date and time.
	 *
	 * @export
	 * @interface ILogHeader
	 */
	export interface ILogHeader {
		componentCode: string;
		componentVersion: string;
		formatVersion: number;
		/** performance.now() read at the same moment as wallClock. */
		time: number;
		/** Date.now() read at the same moment as time. */
		wallClock: number;
	}
}
