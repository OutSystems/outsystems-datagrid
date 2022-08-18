// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace PerformanceAPI {
    export class PerformanceProdMode extends AbstractPerformance {
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        constructor() {
            super(false);
        }

        public clearMarks(): void {
            return;
        }
        public clearMeasures(): void {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        public getEntriesByName(name: string): PerformanceEntryList {
            return [];
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        public getEntriesByType(type: string): PerformanceEntryList {
            return [];
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        public mark(key: string): void {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        public measure(name: string, key1: string, key2: string): void {
            return;
        }
    }
}
