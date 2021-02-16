/**
 * Defines signatures for all the callbacks related to ContextMenu
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.OSCallbacks.ContextMenu {
    /**
     * Callback signature for the MenuItem click Event
     */
    export type OSClickEvent = {
        (gridID: string, gridObject: Grid.IGrid): void;
    };
}
