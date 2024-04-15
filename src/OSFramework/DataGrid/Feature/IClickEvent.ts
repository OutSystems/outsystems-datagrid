// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Feature {
	export interface IClickEvent {
		/**
		 * Responsible for add the cell event listener handler
		 * @param {function} callback
		 */
		setCellClickEvent(callback: (this: HTMLElement, ev: MouseEvent) => void): void;
	}
}
