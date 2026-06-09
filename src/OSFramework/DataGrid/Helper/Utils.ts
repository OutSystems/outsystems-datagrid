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

	export function GetByPath(obj: Record<string, unknown>, path: string): unknown {
		return path.split('.').reduce<unknown>((acc, part) => (acc as Record<string, unknown> | null)?.[part], obj);
	}

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
		current[keys[keys.length - 1]] = value;
	}

	export function DeepClone<T>(obj: T): T {
		try {
			return structuredClone(obj);
		} catch {
			return JSON.parse(JSON.stringify(obj));
		}
	}

	export function Omit<T extends object>(obj: T, keys: string | string[]): Partial<T> {
		if (!obj) return {} as Partial<T>;
		const keysArray = Array.isArray(keys) ? keys : [keys];
		return Object.fromEntries(Object.entries(obj).filter(([k]) => !keysArray.includes(k))) as Partial<T>;
	}
}
