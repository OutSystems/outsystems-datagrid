// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    export interface IDirtyMark {
        clear(): void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        /**
         * Clears dirty marks in the given row.
         * @param {*} row
         */
        clearPropertyInRow(row: any): void;
        getOldValue(rowNumber: number, binding: string): any;
    }
}
