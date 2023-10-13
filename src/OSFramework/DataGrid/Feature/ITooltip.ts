// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Feature {
    export interface ITooltip {
        /**
         * Set the Column Group header tooltip content.
         * @param {HTMLElement} cell
         * @param {string} tooltipContent
         */
        setColumnGroupHeaderTooltip(
            cell: HTMLElement,
            tooltipContent: string
        ): void;
    }
}
