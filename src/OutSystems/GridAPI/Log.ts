/**
 * Namespace with the methods to control the troubleshooting log of the OutSystems Data Grid component.
 * Everything is kept in memory and is lost when the page is reloaded. Only the level is kept for the browser tab.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.GridAPI.Log {
	/**
	 * Removes the recorded messages.
	 *
	 * @export
	 */
	export function Clear(): void {
		OSFramework.DataGrid.Logging.Log.clear();
	}

	/**
	 * Copies the recorded messages to the clipboard. If the clipboard is not available, the text is printed
	 * in the console instead.
	 *
	 * @export
	 * @returns {*}  {Promise<boolean>} True if the text reached the clipboard.
	 */
	export function Copy(): Promise<boolean> {
		return OSFramework.DataGrid.Logging.Log.copy();
	}

	/**
	 * Turns logging off. The messages already recorded are kept until Clear is called or the page is reloaded.
	 *
	 * @export
	 */
	export function Disable(): void {
		OSFramework.DataGrid.Logging.Log.disable();
	}

	/**
	 * Turns logging on at the given level and keeps it on for this browser tab.
	 * Logs can contain application data, so review them before sharing.
	 *
	 * @export
	 * @param {OSFramework.DataGrid.Logging.LogLevel} [level=OSFramework.DataGrid.Logging.LogLevel.Info] 0 Off, 1 Error, 2 Warn, 3 Info, 4 Debug.
	 */
	export function Enable(
		level: OSFramework.DataGrid.Logging.LogLevel = OSFramework.DataGrid.Logging.LogLevel.Info
	): void {
		OSFramework.DataGrid.Logging.Log.enable(level);
	}

	/**
	 * Gets the active level.
	 *
	 * @export
	 * @returns {*}  {OSFramework.DataGrid.Logging.LogLevel} 0 Off, 1 Error, 2 Warn, 3 Info, 4 Debug.
	 */
	export function GetLevel(): OSFramework.DataGrid.Logging.LogLevel {
		return OSFramework.DataGrid.Logging.Log.getLevel();
	}

	/**
	 * Gets the recorded messages as text: the header on the first line and one JSON line per message after it.
	 *
	 * @export
	 * @returns {*}  {string}
	 */
	export function GetLogs(): string {
		return OSFramework.DataGrid.Logging.Log.getLogs();
	}

	/**
	 * Changes the maximum number of messages kept in memory (500 by default).
	 *
	 * @export
	 * @param {number} capacity A whole number of at least 1.
	 */
	export function SetCapacity(capacity: number): void {
		OSFramework.DataGrid.Logging.Log.setCapacity(capacity);
	}
}
