/**
 * Defines signatures for all the callbacks related to ContextMenu
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.Callbacks.ContextMenu {
    /**
     * Callback signature for the MenuItem click Event
     * @param {string} gridID which grid triggered the event
     * @param {OSFramework.Grid.IGrid} gridObj object of the grid which triggered the event
     */
    export type OSClickEvent = {
        (gridID: string, gridObject: OSFramework.Grid.IGrid): void;
    };

    /**
     * This is the callback signature for events triggerend by column action.
     * @param {string} gridID which grid triggered the event
     * @param {string} isOpening defines if context menu is opening or closing
     */
    export type Toggle = {
        (gridID: string, isOpening: boolean): void;
    };
}
