// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Event.Feature {
	/**
	 * Class that encapsulate the basic logic of triggering the event of opening/closing the context menu with the right parameters order.
	 *
	 * @class ToggleContextMenu
	 * @extends {OSFramework.DataGrid.Event.AbstractEvent<string>}
	 */
	export class ToggleContextMenu extends Event.AbstractEvent<string> {
		public trigger(gridID: string, isOpening: boolean, columnId: string): void {
			this.handlers.slice(0).forEach((h) => {
				if (isOpening) {
					//only when opening the context menu, we need the operation
					//to be synchronous, so that the items can be updated.
					h(gridID, isOpening, columnId);
				} else {
					Helper.AsyncInvocation(h, gridID, isOpening, columnId);
				}
			});
		}
	}
}
