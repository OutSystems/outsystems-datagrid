/// <reference path="ILogEntry.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Logging {
	/**
	 * In-memory store with a maximum number of entries. When it is full, the oldest entry is overwritten.
	 *
	 * @export
	 * @class LogBuffer
	 */
	export class LogBuffer {
		private _capacity: number;
		private _entries: ILogEntry[] = [];
		// Index of the oldest entry, only different from 0 once the buffer is full.
		private _head = 0;

		constructor(capacity: number) {
			this._capacity = capacity;
		}

		/**
		 * Adds an entry, discarding the oldest one if the buffer is full.
		 *
		 * @param {ILogEntry} entry Entry to store.
		 * @memberof LogBuffer
		 */
		public add(entry: ILogEntry): void {
			if (this._entries.length < this._capacity) {
				this._entries.push(entry);
			} else {
				this._entries[this._head] = entry;
				this._head = (this._head + 1) % this._capacity;
			}
		}

		/**
		 * Removes all the entries.
		 *
		 * @memberof LogBuffer
		 */
		public clear(): void {
			this._entries = [];
			this._head = 0;
		}

		/**
		 * Gets a copy of the entries, from the oldest to the newest.
		 *
		 * @returns {*}  {ILogEntry[]}
		 * @memberof LogBuffer
		 */
		public getAll(): ILogEntry[] {
			return this._entries.slice(this._head).concat(this._entries.slice(0, this._head));
		}

		/**
		 * Changes the maximum number of entries. If it gets smaller, only the newest entries are kept.
		 * Values that are not a whole number of at least 1 are ignored.
		 *
		 * @param {number} capacity New maximum number of entries.
		 * @memberof LogBuffer
		 */
		public setCapacity(capacity: number): void {
			if (!Number.isInteger(capacity) || capacity < 1) {
				return;
			}
			const ordered = this.getAll();
			this._entries = ordered.slice(-capacity);
			this._head = 0;
			this._capacity = capacity;
		}
	}
}
