/// <reference path="ILogEntry.ts" />
/// <reference path="ILogHeader.ts" />
/// <reference path="LogConstants.ts" />
/// <reference path="LogLevel.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Logging {
	/**
	 * Turns values and entries into text. Never throws.
	 *
	 * @export
	 * @class LogSerializer
	 */
	export class LogSerializer {
		private _entryToLine(entry: ILogEntry): string {
			const line = JSON.stringify({
				time: entry.time,
				level: LogLevel[entry.level],
				name: entry.name,
				id: entry.id,
				message: entry.message,
			});
			// The data is already JSON text, so it is added as it is instead of being encoded a second time.
			return entry.data === undefined ? line : `${line.slice(0, -1)},"data":${entry.data}}`;
		}

		/**
		 * Serializes any value as valid JSON text. Circular references, errors and big integers are handled,
		 * and text longer than the maximum is replaced by a truncated preview.
		 *
		 * @param {unknown} value Value to serialize.
		 * @returns {*}  {string} Valid JSON text.
		 * @memberof LogSerializer
		 */
		public safeStringify(value: unknown): string {
			// Objects between the root and the value being visited, to detect real cycles only.
			const ancestors: unknown[] = [];
			let text: string;

			try {
				text = JSON.stringify(value, function (this: unknown, _key: string, current: unknown): unknown {
					if (typeof current === 'bigint') {
						return current.toString();
					}
					if (current instanceof Error) {
						return { message: current.message, name: current.name, stack: current.stack };
					}
					if (typeof current !== 'object' || current === null) {
						return current;
					}
					while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) {
						ancestors.pop();
					}
					if (ancestors.includes(current)) {
						return '[Circular]';
					}
					ancestors.push(current);
					return current;
				});
			} catch {
				text = undefined;
			}

			// JSON.stringify gives undefined for values that have no JSON form (undefined, functions, symbols).
			if (text === undefined) {
				text = JSON.stringify(String(value));
			}

			if (text.length > LogConstants.MaxDataLength) {
				return JSON.stringify({
					length: text.length,
					preview: text.slice(0, LogConstants.MaxDataLength),
					truncated: true,
				});
			}
			return text;
		}

		/**
		 * Builds the text to share: the header on the first line and one JSON line per entry after it.
		 *
		 * @param {ILogHeader} header Header of the page load.
		 * @param {ILogEntry[]} entries Entries, oldest first.
		 * @returns {*}  {string} Lines separated by a line break.
		 * @memberof LogSerializer
		 */
		public toJsonLines(header: ILogHeader, entries: ILogEntry[]): string {
			const lines = [JSON.stringify({ type: 'header', ...header })];
			entries.forEach((entry) => lines.push(this._entryToLine(entry)));
			return lines.join('\n');
		}
	}
}
