// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Helper {
	export function AsyncInvocationPromise(
		callback: Callbacks.Generic,
		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		...args: any
	): Promise<void> {
		if (callback) {
			return new Promise((resolve) =>
				setTimeout(() => {
					resolve(callback(...args));
				}, 0)
			);
		}
	}

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
	export function AsyncInvocation(callback: Callbacks.Generic, ...args: any) {
		if (callback) setTimeout(() => callback(...args), 0);
	}
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
	export function SyncInvocation(callback: Callbacks.Generic, ...args: any) {
		if (callback) callback(...args);
	}
}
