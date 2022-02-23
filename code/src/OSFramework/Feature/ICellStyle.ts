// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    export interface ICellStyle {
        /**
         * Add a CSS class to a specific cell from the grid.
         */
        addClass(
            binding: string,
            rowNumber: number,
            className: string,
            refresh?: boolean
        ): void;

        clear(): void;

        getMetadata(rowNumber: number): Feature.Auxiliar.CellStyleInfo;

        removeAllClasses(
            rowNumber: number,
            binding: string,
            refresh?: boolean
        ): void;
        /**
         * Remove CSS class from a specific cell from the grid.
         */
        removeClass(
            rowNumber: number,
            binding: string,
            className: string,
            refresh?: boolean
        ): void;
    }
}
