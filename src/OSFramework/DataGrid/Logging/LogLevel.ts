// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Logging {
	/**
	 * Levels of the troubleshooting log. A message is recorded when its level is at or below the active level,
	 * so Debug also records Info, Warn and Error. Off records nothing.
	 *
	 * @export
	 * @enum {number}
	 */
	export enum LogLevel {
		Off = 0,
		Error = 1,
		Warn = 2,
		Info = 3,
		Debug = 4,
	}
}
