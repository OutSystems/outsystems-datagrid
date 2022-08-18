/**
 * Namespace that contains the callbacks signatures to be passed in the grid events.
 */
namespace OSFramework.DataGrid.Callbacks.OSGrid {
    /**
     * This is the callback signature for events triggerend by the grid.
     * @param {string} gridID which grid triggered the event
     * @param {OSFramework.DataGrid.Grid.IGrid} gridObj object of the grid which triggered the event
     */
    export type Event = {
        (gridID: string, gridObj: OSFramework.DataGrid.Grid.IGrid): void;
    };
}
