/**
 * Namespace that contains the signatures of the callbacks in OutSystems code.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Callbacks {
    /**
     * This is the most generic callback signature and can be used even for internal events
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type Generic = { (...ags): any };

    /**
     * This is the most generic callback signature for events existing in OutSystems code.
     * @param {string} gridID enables the OutSystems code to understand which grid triggered the event
     */
    export type OSGeneric = { (gridID: string, ...args): void };

    /**
     * Namespace that contains the callbacks signatures to be passed in the column events.
     */
    export namespace OSColumn {
        /**
         * This is the callback signature for events triggerend by column action.
         * @param {string} gridID which grid triggered the event
         * @param {string} columnID which column triggered the event
         * @param {string} line values present in the line
         */
        export type ClickEvent = {
            (gridID: string, columnID: string, line: string): void;
        };
    }

    /**
     * Namespace that contains the callbacks signatures to be passed in the grid events.
     */
    export namespace OSGrid {
        /**
         * This is the callback signature for events triggerend by the grid.
         * @param {string} gridID which grid triggered the event
         * @param {Grid.IGrid} gridObj object of the grid which triggered the event
         */
        export type Event = {
            (gridID: string, gridObj: Grid.IGrid): void;
        };
    }
}
