// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    export interface IDirtyMark {
        clear(): void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getOldValue(rowNumber: number, binding: string): any;
        // clearByRow(row: number): void;

        /**
         * Saves cell original value
         * @param rowNumber Cell's row number
         * @param columnNumber Cell's column number
         */
        saveOriginalValue(rowNumber: number, columnNumber: number): void;
    }
}