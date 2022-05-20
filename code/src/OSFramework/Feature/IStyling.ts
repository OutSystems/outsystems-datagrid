// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    export interface IStyling {
        /**
         * Add a specific CSS Class to the content of a column.
         * @param {string} columnID
         * @param {string} className
         * @param {boolean} includeHeader
         */
        addColumnCssClass(
            columnID: string,
            className: string,
            includeHeader: boolean
        ): void;
        changeRowHeight(rowHeight: number): void;
        /**
         * Removes a specific CSS Class from a column
         * @param {string} columnID
         * @param {string} className
         */
        removeColumnCssClass(columnID: string, className: string): void;
        /**
         * Set Column word wrap to true
         * @param {string} columnID
         */
        setColumnWordWrap(columnID: string, value: boolean): void;
    }
}
