// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    export interface ICellStyle {
        /**
         * Add a CSS class to a specific cell from the grid.
         */
        addClass(binding: string, rowNumber: number, className: string): void;
        /**
         * Remove CSS class from a specific cell from the grid.
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        removeClass(rowNumber: number, binding: string): any;
    }
}
