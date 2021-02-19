// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.ContextMenu.Events {
    /**
     * API method to subscribe to events of a specific grid.
     *
     * @export
     * @param {string} contextMenuID context menu in which to attach to an event.
     * @param {ExternalEvents.ContextMenuEventType} eventName event to which attach to.
     * @param {Callbacks.OSGrid.Event} callback to be invoked qhen the event occurs.
     */
    export function Subscribe(
        contextMenuID: string,
        eventName: ExternalEvents.ContextMenuEventType,
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        callback: Callbacks.OSGrid.Event
    ): void {
        const gridId = GetGridByMenuId(contextMenuID);        
        GridManager.Events.Subscribe(
            gridId,
            ExternalEvents.GridEventType.Initialized,
            (gridId:string, gridObj:Grid.IGrid) => {
                gridObj.features.contextMenu.contextMenuEvents.addHandler(eventName, callback);
            }
        );
    }
}
