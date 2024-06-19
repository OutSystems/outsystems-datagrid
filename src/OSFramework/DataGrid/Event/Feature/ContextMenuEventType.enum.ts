// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Event.Feature {
	/**
	 * Events currently supported in the Context Menu element.
	 *
	 * @export
	 * @enum {number}
	 */
	export enum ContextMenuEventType {
		/**
		 * When the menu is opening, but not yet visible/open.
		 */
		Opening = 'Opening',
		/**
		 * When the menu was opened or closed.
		 */
		Toggle = 'Toggle',
	}
}
