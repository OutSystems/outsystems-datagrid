// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Helper {
	/**
	 * Returns the closest IGrid based on an element
	 * @param elem Element used as reference or its uniqueId
	 */
	export function GetClosestGrid(elem: Element | string): DataGrid.Grid.IGrid {
		let child: Element;

		if (typeof elem === 'string' || elem instanceof String)
			child = DataGrid.Helper.GetElementByUniqueId(elem as string);
		else child = elem;

		const domGrid = child.closest(DataGrid.Helper.Constants.gridTag);

		if (domGrid) {
			const uniqueId = domGrid
				.querySelector(DataGrid.Helper.Constants.gridUniqueIdCss)
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				.getAttribute(DataGrid.Helper.Constants.uniqueIdAttribute);

			return OutSystems.GridAPI.GridManager.GetGridById(uniqueId);
		}

		return null;
	}
}
