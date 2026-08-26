/**
 * Level-aware console logger for the Grid operations.
 *
 * A message is only written to the console when its level is at or below the
 * current level. The default level is Warning, so informational messages stay
 * silent unless verbosity is raised at runtime via
 * OutSystems.GridAPI.Auxiliary.SetLogLevel() or the localStorage override —
 * both client-side only, no server calls involved.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Helper.Logger {
	/**
	 * localStorage key that overrides the initial log level, so verbosity can
	 * be raised on a live application without an application change. Accepts a
	 * level name ('None' | 'Error' | 'Warning' | 'Info', case-insensitive) or
	 * its numeric value.
	 */
	export const logLevelStorageKey = 'outsystems-datagrid-log-level';

	let _currentLevel: Enum.LogLevel;

	function _getCurrentLevel(): Enum.LogLevel {
		if (_currentLevel === undefined) {
			_currentLevel = _getInitialLevel();
		}
		return _currentLevel;
	}

	function _getInitialLevel(): Enum.LogLevel {
		// localStorage may be unavailable (sandboxed iframes, blocked site
		// data) — logging must never break the grid.
		try {
			const storedLevel = _parseLevel(window.localStorage.getItem(logLevelStorageKey));
			if (storedLevel !== undefined) {
				return storedLevel;
			}
		} catch {
			// Fall back to the default level.
		}
		return Enum.LogLevel.Warning;
	}

	function _parseLevel(value: string): Enum.LogLevel | undefined {
		if (value === null || value === undefined || value === '') {
			return undefined;
		}
		const numericValue = Number(value);
		if (!isNaN(numericValue)) {
			return Enum.LogLevel[numericValue] !== undefined ? numericValue : undefined;
		}
		const levelName = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
		const namedValue = Enum.LogLevel[levelName as keyof typeof Enum.LogLevel];
		return typeof namedValue === 'number' ? namedValue : undefined;
	}

	/**
	 * Gets the current log level.
	 *
	 * @export
	 * @returns {*}  {Enum.LogLevel} Level currently applied.
	 */
	export function GetLevel(): Enum.LogLevel {
		return _getCurrentLevel();
	}

	/**
	 * Logs an error message to the console (visible at level Error and above).
	 *
	 * @export
	 * @param {string} message Message to log.
	 */
	export function LogError(message: string): void {
		if (_getCurrentLevel() >= Enum.LogLevel.Error) {
			console.error(message);
		}
	}

	/**
	 * Logs an informational message to the console (visible at level Info only).
	 *
	 * @export
	 * @param {string} message Message to log.
	 */
	export function LogInfo(message: string): void {
		if (_getCurrentLevel() >= Enum.LogLevel.Info) {
			console.log(message);
		}
	}

	/**
	 * Logs a warning message to the console (visible at level Warning and above).
	 *
	 * @export
	 * @param {string} message Message to log.
	 */
	export function LogWarning(message: string): void {
		if (_getCurrentLevel() >= Enum.LogLevel.Warning) {
			console.warn(message);
		}
	}

	/**
	 * Sets the log level for all Grids on the page.
	 *
	 * @export
	 * @param {Enum.LogLevel} level Level to apply.
	 */
	export function SetLevel(level: Enum.LogLevel): void {
		if (Enum.LogLevel[level] === undefined) {
			LogWarning(
				`Logger.SetLevel - Invalid log level '${level}'. Use 0 (None), 1 (Error), 2 (Warning) or 3 (Info).`
			);
			return;
		}
		_currentLevel = level;
	}
}
