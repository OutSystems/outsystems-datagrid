// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    export interface IStyling {
        /**
         * Add a specific CSS Class to the content of a column (header).
         * @param {string} columnID
         * @param {string} className
         */
        addCssClass(columnID: string, className: string): void;
        /**
         * Add a specific CSS Class to a column (header and content).
         * @param {string} columnID
         * @param {string} className
         */
        addCssClassAll(columnID: string, className: string): void;
        changeRowHeight(rowHeight: number): void;
        /**
         * Removes a specific CSS Class from a column content
         * @param {string} columnID
         * @param {string} className
         */
        removeCssClass(columnID: string, className: string): void;
        /**
         * Removes a specific CSS Class from an entire column
         * @param {string} columnID
         * @param {string} className
         */
        removeCssClassAll(columnID: string, className: string): void;
    }
}
