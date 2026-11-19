/// <reference path="LogLevel.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Logging {
	/**
	 * One recorded message.
	 *
	 * @export
	 * @interface ILogEntry
	 */
	export interface ILogEntry {
		/** Data of the message, already serialized as JSON text when it was recorded. */
		data?: string;
		/** Identifier of the instance that logged (for example a grid or column id). */
		id: string;
		level: LogLevel;
		message: string;
		/** Name of the part of the component that logged (for example a class name). */
		name: string;
		/** performance.now() at the moment of the log. */
		time: number;
	}
}
