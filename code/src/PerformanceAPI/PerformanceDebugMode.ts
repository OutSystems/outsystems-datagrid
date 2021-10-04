/// <reference path="AbstractPerformance.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace PerformanceAPI {
    export class PerformanceDebugMode extends AbstractPerformance {
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        constructor() {
            super(true);
        }

        public clearMarks(): void {
            performance.clearMarks();
        }
        public clearMeasures(): void {
            performance.clearMeasures();
        }

        public getEntriesByName(name: string): PerformanceEntryList {
            return performance.getEntriesByName(name);
        }

        public getEntriesByType(type: string): PerformanceEntryList {
            return performance.getEntriesByType(type);
        }

        public mark(key: string): void {
            performance.mark(key);
        }

        public measure(name: string, key1: string, key2: string): void {
            performance.measure(name, key1, key2);
        }
    }
}
