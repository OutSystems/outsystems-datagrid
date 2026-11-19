/// <reference path="ClipboardExporter.ts" />
/// <reference path="ILogHeader.ts" />
/// <reference path="LogBuffer.ts" />
/// <reference path="LogConstants.ts" />
/// <reference path="LogLevel.ts" />
/// <reference path="LogPayload.ts" />
/// <reference path="LogSerializer.ts" />
/// <reference path="SessionLogSettings.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Logging {
	/**
	 * Troubleshooting log of the component. When it is off, a log call costs one comparison. When it is on,
	 * messages at or below the active level are kept in memory (up to a maximum number) until they are
	 * copied or the page is reloaded. Only the active level is kept across reloads of the browser tab.
	 *
	 * @export
	 * @class Logger
	 */
	export class Logger {
		private _buffer: LogBuffer;
		private _exporter: ClipboardExporter;
		private _header: ILogHeader;
		private _level: LogLevel;
		private _serializer: LogSerializer;
		private _settings: SessionLogSettings;

		constructor(
			settings: SessionLogSettings,
			buffer: LogBuffer,
			serializer: LogSerializer,
			exporter: ClipboardExporter
		) {
			this._settings = settings;
			this._buffer = buffer;
			this._serializer = serializer;
			this._exporter = exporter;
			// The level is cached, so a log call never has to read the storage.
			this._level = settings.load();
			if (this._level !== LogLevel.Off) {
				this._warnAboutData();
			}
		}

		private _createHeader(): ILogHeader {
			return {
				componentCode: LogConstants.ComponentCode,
				componentVersion: Constants.OSDataGridVersion,
				formatVersion: LogConstants.FormatVersion,
				time: performance.now(),
				wallClock: Date.now(),
			};
		}

		private _warnAboutData(): void {
			console.warn(
				`[DataGrid] Logging is on at level ${
					LogLevel[this._level]
				}. Logs are kept in memory and can contain application data. Review them before sharing.`
			);
		}

		private _write(level: LogLevel, name: string, id: string, message: string, data?: LogPayload): void {
			// Logging must never break the component.
			try {
				if (this._header === undefined) {
					this._header = this._createHeader();
				}
				this._buffer.add({
					data: data === undefined ? undefined : this._serializer.safeStringify(data()),
					id,
					level,
					message,
					name,
					time: performance.now(),
				});
			} catch {
				// Nothing to do: the message is lost.
			}
		}

		/**
		 * Removes the recorded messages.
		 *
		 * @memberof Logger
		 */
		public clear(): void {
			this._buffer.clear();
		}

		/**
		 * Copies the recorded messages to the clipboard. If the clipboard is not available, the text is
		 * printed in the console instead.
		 *
		 * @returns {*}  {Promise<boolean>} True if the text reached the clipboard.
		 * @memberof Logger
		 */
		public async copy(): Promise<boolean> {
			try {
				return await this._exporter.copy(this.getLogs());
			} catch {
				return false;
			}
		}

		/**
		 * Records a message at Debug level (the most verbose one, also used for hot paths and values).
		 * On hot paths check isEnabled first, so the data function is not even created while logging is off.
		 *
		 * @param {string} name Name of the part of the component that logs.
		 * @param {string} id Identifier of the instance that logs.
		 * @param {string} message Message to record.
		 * @param {LogPayload} [data] Function that returns the data to record.
		 * @memberof Logger
		 */
		public debug(name: string, id: string, message: string, data?: LogPayload): void {
			if (this._level >= LogLevel.Debug) {
				this._write(LogLevel.Debug, name, id, message, data);
			}
		}

		/**
		 * Turns logging off. The messages already recorded are kept until clear is called or the page is reloaded.
		 *
		 * @memberof Logger
		 */
		public disable(): void {
			this._level = LogLevel.Off;
			this._settings.save(LogLevel.Off);
		}

		/**
		 * Turns logging on at the given level and keeps it on for this browser tab.
		 *
		 * @param {LogLevel} [level=LogLevel.Info] Level to record.
		 * @memberof Logger
		 */
		public enable(level: LogLevel = LogLevel.Info): void {
			if (typeof level !== 'number' || LogLevel[level] === undefined) {
				console.warn(
					`[DataGrid] Invalid log level '${level}'. Use 0 (Off), 1 (Error), 2 (Warn), 3 (Info) or 4 (Debug).`
				);
				return;
			}
			this._level = level;
			this._settings.save(level);
			if (level !== LogLevel.Off) {
				this._warnAboutData();
			}
		}

		/**
		 * Records a message at Error level (exceptions and things that went wrong).
		 *
		 * @param {string} name Name of the part of the component that logs.
		 * @param {string} id Identifier of the instance that logs.
		 * @param {string} message Message to record.
		 * @param {LogPayload} [data] Function that returns the data to record.
		 * @memberof Logger
		 */
		public error(name: string, id: string, message: string, data?: LogPayload): void {
			if (this._level >= LogLevel.Error) {
				this._write(LogLevel.Error, name, id, message, data);
			}
		}

		/**
		 * Gets the active level.
		 *
		 * @returns {*}  {LogLevel}
		 * @memberof Logger
		 */
		public getLevel(): LogLevel {
			return this._level;
		}

		/**
		 * Gets the recorded messages as text: the header on the first line and one JSON line per message after it.
		 *
		 * @returns {*}  {string}
		 * @memberof Logger
		 */
		public getLogs(): string {
			if (this._header === undefined) {
				this._header = this._createHeader();
			}
			return this._serializer.toJsonLines(this._header, this._buffer.getAll());
		}

		/**
		 * Records a message at Info level (events that happen).
		 *
		 * @param {string} name Name of the part of the component that logs.
		 * @param {string} id Identifier of the instance that logs.
		 * @param {string} message Message to record.
		 * @param {LogPayload} [data] Function that returns the data to record.
		 * @memberof Logger
		 */
		public info(name: string, id: string, message: string, data?: LogPayload): void {
			if (this._level >= LogLevel.Info) {
				this._write(LogLevel.Info, name, id, message, data);
			}
		}

		/**
		 * Tells if messages of the given level are being recorded. Use it before building expensive data on hot paths.
		 *
		 * @param {LogLevel} level Level to check.
		 * @returns {*}  {boolean}
		 * @memberof Logger
		 */
		public isEnabled(level: LogLevel): boolean {
			return level > LogLevel.Off && this._level >= level;
		}

		/**
		 * Changes the maximum number of messages kept in memory.
		 *
		 * @param {number} capacity New maximum, a whole number of at least 1.
		 * @memberof Logger
		 */
		public setCapacity(capacity: number): void {
			this._buffer.setCapacity(capacity);
		}

		/**
		 * Records a message at Warn level (paths and situations that should not happen).
		 *
		 * @param {string} name Name of the part of the component that logs.
		 * @param {string} id Identifier of the instance that logs.
		 * @param {string} message Message to record.
		 * @param {LogPayload} [data] Function that returns the data to record.
		 * @memberof Logger
		 */
		public warn(name: string, id: string, message: string, data?: LogPayload): void {
			if (this._level >= LogLevel.Warn) {
				this._write(LogLevel.Warn, name, id, message, data);
			}
		}
	}
}
