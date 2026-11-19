/// <reference path="LogLevel.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Logging {
	/**
	 * Keeps the active level in sessionStorage, so it lasts for the browser tab and survives page reloads.
	 * Storage can be unavailable (blocked site data, sandboxed frames), so it never throws.
	 *
	 * @export
	 * @class SessionLogSettings
	 */
	export class SessionLogSettings {
		private _storageKey: string;

		constructor(storageKey: string) {
			this._storageKey = storageKey;
		}

		/**
		 * Reads the saved level.
		 *
		 * @returns {*}  {LogLevel} The saved level, or Off if there is none or it is not valid.
		 * @memberof SessionLogSettings
		 */
		public load(): LogLevel {
			try {
				const level = Number(window.sessionStorage.getItem(this._storageKey));
				return LogLevel[level] !== undefined ? level : LogLevel.Off;
			} catch {
				return LogLevel.Off;
			}
		}

		/**
		 * Saves the level.
		 *
		 * @param {LogLevel} level Level to save.
		 * @memberof SessionLogSettings
		 */
		public save(level: LogLevel): void {
			try {
				window.sessionStorage.setItem(this._storageKey, String(level));
			} catch {
				// The level just will not survive a reload.
			}
		}
	}
}
