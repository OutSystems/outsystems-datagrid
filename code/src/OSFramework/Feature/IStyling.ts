// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    export interface IStyling {
        /**
         *
         * @param {string} columnID
         * @param {string} className
         */
        addCssClass(columnID: string, className: string): void;
        /**
         *
         * @param {string} columnID
         * @param {string} className
         */
        addCssClassAll(columnID: string, className: string): void;
        changeRowHeight(rowHeight: number): void;
        /**
         *
         * @param {string} columnID
         * @param {string} className
         */
        removeCssClass(columnID: string, className: string): void;
        /**
         *
         * @param {string} columnID
         * @param {string} className
         */
        removeCssClassAll(columnID: string, className: string): void;
    }
}
