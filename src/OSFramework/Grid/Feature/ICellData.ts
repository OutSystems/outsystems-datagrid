// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    export interface ICellData {
        /**
         * Responsible for updating a specific cell -
         * This is needed in a case we wnat to update another column cell, for example when a cell content is denpendent on another.
         * @param {number} rowNumber
         * @param {string} column
         * @param {string} value
         */
        setCellData(
            rowNumber: number,
            column: OSFramework.Column.IColumn,
            // eslint-disable-next-line
            value: string
        ): void;
    }
}
