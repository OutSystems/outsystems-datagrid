// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    export interface IDirtyMark {
        clear(): void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getOldValue(rowNumber: number, binding: string): any;
        // clearByRow(row: number): void;
        saveOriginalValue(rowNumber: number, columnNumber: number): void;
    }
}
