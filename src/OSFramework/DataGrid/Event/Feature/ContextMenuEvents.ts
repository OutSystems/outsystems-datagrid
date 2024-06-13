// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Event.Feature {
	/**
	 * Class that encapsulate the basic logic of triggering the event of opening/closing the context menu with the right parameters order.
	 *
	 * @class ToggleContextMenu
	 * @extends {OSFramework.DataGrid.Event.AbstractEvent<string>}
	 */
	export class ToggleContextMenu extends Event.AbstractEvent<string> {
		public trigger(gridID: string, columnId: string, isOpening: boolean): void {
			this.handlers.slice(0).forEach((h) => Helper.AsyncInvocation(h, gridID, isOpening, columnId));
		}
	}

	/**
	 * Class that encapsulate the basic logic of triggering the event of opening the context menu.
	 * This event is synchronous to allow the developer to change the Context Menu items before the
	 * menu is visibel. The event be fired before the context menu is opened.
	 *
	 * @export
	 * @class OpeningContextMenu
	 * @extends {Event.AbstractEvent<string>}
	 */
	export class OpeningContextMenu extends Event.AbstractEvent<string> {
		public trigger(gridID: string, columnId: string): void {
			this.handlers.slice(0).forEach((h) => h(gridID, columnId));
		}
	}
}
