// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace PerformanceAPI {
    export abstract class AbstractPerformance implements IPerformance {
        private _isDebug: boolean;

        constructor(isDebug: boolean) {
            this._isDebug = isDebug;
        }

        public get isDebug(): boolean {
            return this._isDebug;
        }

        public abstract clearMarks(): void;
        public abstract clearMeasures(): void;
        public abstract getEntriesByName(name: string): PerformanceEntryList;
        public abstract getEntriesByType(type: string): PerformanceEntryList;
        public abstract mark(key: string): void;
        public abstract measure(name: string, key1: string, key2: string): void;
    }
}
