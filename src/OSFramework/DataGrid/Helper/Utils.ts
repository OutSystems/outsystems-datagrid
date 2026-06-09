// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Helper {
	// Prevents prototype pollution: paths containing these segments would mutate Object.prototype,
	// affecting every object in the runtime.
	const BLOCKED_PATH_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
	/**
	 * Receives an array, splits it into smaller arrays and executes a callback.
	 * @param data Array to be split
	 * @param callback Callback to be executed on splitted arrays
	 * @param chunkSize Size of splitted array
	 */
	export function BatchArray(data: object[], callback: (part: object[]) => void, chunkSize = 10): void {
		if (!Array.isArray(data)) throw new Error('An array must be passed');

		const chunk = Array.from({ length: Math.ceil(data.length / chunkSize) }, (_, i) =>
			data.slice(i * chunkSize, (i + 1) * chunkSize)
		);

		chunk.forEach((part) => callback(part));
	}

	/**
	 * Gets a nested property value from an object using a dot-separated path.
	 * @param obj The object to query
	 * @param path The dot-separated path of the property to get
	 * @returns The value at the specified path, or undefined if the path is invalid
	 */
	export function GetByPath(obj: Record<string, unknown>, path: string): unknown {
		return path.split('.').reduce<unknown>((acc, part) => (acc as Record<string, unknown> | null)?.[part], obj);
	}

	/**
	 * Sets a nested property value on an object using a dot-separated path.
	 * If any part of the path does not exist, it will be created as an empty object.
	 *
	 * @export
	 * @param {Record<string, unknown>} obj
	 * @param {string} path
	 * @param {unknown} value
	 */
	export function SetByPath(obj: Record<string, unknown>, path: string, value: unknown): void {
		const keys = path.split('.');
		if (keys.some((key) => BLOCKED_PATH_KEYS.has(key))) {
			throw new Error('Unsafe path segment');
		}
		let current: Record<string, unknown> = obj;
		for (let i = 0; i < keys.length - 1; i++) {
			// Overwrite primitives so the next descent doesn't throw in strict mode
			// (assigning a property on a string/number is a TypeError).
			if (typeof current[keys[i]] !== 'object' || current[keys[i]] === null) {
				current[keys[i]] = {};
			}
			current = current[keys[i]] as Record<string, unknown>;
		}
		const lastKey = keys.at(-1);
		lastKey && (current[lastKey] = value);
	}

	/**
	 * Creates a deep clone of the given object.
	 * Uses structuredClone if available, otherwise falls back to JSON methods.
	 *
	 * @param obj The object to clone
	 * @returns A deep clone of the object
	 */
	export function DeepClone<T>(obj: T): T {
		try {
			// structuredClone is available in modern environments and handles more
			// complex cases than JSON methods (like functions, Dates, Maps, Sets, etc.)
			return structuredClone(obj);
		} catch {
			return JSON.parse(JSON.stringify(obj));
		}
	}

	/**
	 * Creates a new object by omitting specified keys from the original object.
	 *
	 * @param obj The original object
	 * @param keys The keys to omit
	 * @returns A new object without the specified keys
	 */
	export function Omit<T extends object>(obj: T, keys: string | string[]): Partial<T> {
		if (!obj) return {};
		const keysArray = Array.isArray(keys) ? keys : [keys];
		return Object.fromEntries(Object.entries(obj).filter(([k]) => !keysArray.includes(k))) as Partial<T>;
	}
}
