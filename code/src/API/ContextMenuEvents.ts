// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.ContextMenu.Events {
    /**
     * API method to subscribe to events of the context menu, uses a menu item from the context menu to host the event.
     *
     * @export
     * @param {string} menuItemID menu item in which to attach to an event.
     * @param {ExternalEvents.ContextMenuEventType} eventName event to which attach to.
     * @param {OSCallbacks.ContextMenu.Toggle} callback to be invoked qhen the event occurs.
     */
    export function Subscribe(
        menuItemID: string,
        eventName: ExternalEvents.ContextMenuEventType,
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        callback: OSCallbacks.ContextMenu.Toggle
    ): void {
        const gridId = GetGridByMenuId(menuItemID);
        // We need to make sure the grid already exists and it is intialized before subscribing to any context menu event.
        GridManager.Events.Subscribe(
            gridId,
            ExternalEvents.GridEventType.Initialized,
            (gridId: string, gridObj: Grid.IGrid) => {
                gridObj.features.contextMenu.contextMenuEvents.addHandler(
                    eventName,
                    callback
                );
            }
        );
    }
}
