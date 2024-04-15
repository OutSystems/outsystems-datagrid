// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Event.Grid {
	/**
	 * Class that will make sure that the trigger invokes the handlers
	 * with the correct parameters.
	 *
	 * @abstract
	 * @class AbstractGridEvent
	 * @extends {AbstractEvent<OSFramework.DataGrid.Grid.IGrid>}
	 */
	export abstract class AbstractGridEvent extends OSFramework.DataGrid.Event
		.AbstractEvent<OSFramework.DataGrid.Grid.IGrid> {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		public trigger(
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			gridObj: OSFramework.DataGrid.Grid.IGrid,
			gridID: string,
			// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-unused-vars
			...args
		): void {
			this.handlers.slice(0).forEach((h) => Helper.AsyncInvocation(h, gridID, gridObj));
		}
	}
}
