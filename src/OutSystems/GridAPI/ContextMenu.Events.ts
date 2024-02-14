namespace OutSystems.GridAPI.ContextMenu.Events {
	/**
	 * API method to subscribe to events of the context menu, uses a menu item from the context menu to host the event.
	 *
	 * @export
	 * @param menuItemID menu item in which to attach to an event.
	 * @param eventName event to which attach to.
	 * @param callback to be invoked qhen the event occurs.
	 */
	export function Subscribe(
		menuItemID: string,
		eventName: OSFramework.DataGrid.Event.Feature.ContextMenuEventType,
		// eslint-disable-next-line
		callback: OSFramework.DataGrid.Callbacks.ContextMenu.Toggle
	): void {
		const gridId = GetGridByMenuId(menuItemID);
		// We need to make sure the grid already exists and it is intialized before subscribing to any context menu event.
		GridManager.Events.Subscribe(
			gridId,
			OSFramework.DataGrid.Event.Grid.GridEventType.Initialized,
			(_gridId: string, gridObj: OSFramework.DataGrid.Grid.IGrid) => {
				gridObj.features.contextMenu.contextMenuEvents.addHandler(eventName, callback);
			}
		);
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.ContextMenu.Events {
	/**
	 * API method to subscribe to events of the context menu, uses a menu item from the context menu to host the event.
	 *
	 * @export
	 * @param menuItemID menu item in which to attach to an event.
	 * @param eventName event to which attach to.
	 * @param callback to be invoked qhen the event occurs.
	 */
	export function Subscribe(
		menuItemID: string,
		eventName: OSFramework.DataGrid.Event.Feature.ContextMenuEventType,
		// eslint-disable-next-line
		callback: OSFramework.DataGrid.Callbacks.ContextMenu.Toggle
	): void {
		OSFramework.DataGrid.Helper.LogWarningMessage(
			`${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.ContextMenu.Events.Subscribe()'`
		);
		return OutSystems.GridAPI.ContextMenu.Events.Subscribe(menuItemID, eventName, callback);
	}
}
