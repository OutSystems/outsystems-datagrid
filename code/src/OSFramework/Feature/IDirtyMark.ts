// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    export interface IDirtyMark {
        isGridDirty: boolean;
        clear(): void;
        clearByRowKeys(rowKeys: Array<string>): void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        clearPropertyInRow(row: any): void;
        clearPropertyInRowByKey(key: string): void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getOldValue(rowNumber: number, binding: string): any;
        /**
         * Saves cell original value
         * @param rowNumber Cell's row number
         * @param columnNumber Cell's column number
         */
        saveOriginalValue(rowNumber: number, columnNumber: number): void;
    }
}
