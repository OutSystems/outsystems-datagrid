// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace PerformanceAPI {
    export interface IPerformance {
        isDebug: boolean;

        clearMarks(): void;
        clearMeasures(): void;
        getEntriesByName(name: string): PerformanceEntryList;
        getEntriesByType(type: string): PerformanceEntryList;
        mark(key: string): void;
        measure(name: string, key1: string, key2: string): void;
    }
}
