// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.GridAPI.Security {
	export function DisableCellDataSanitizer(gridID: string): void {
		Performance.SetMark('Security.DisableCellDataSanitizer');
		try {
			GridManager.GetGridById(gridID).features.cellDataSanitizer.disableCellDataSanitizer();
		} finally {
			Performance.SetMark('Security.DisableCellDataSanitizer-end');
			Performance.GetMeasure(
				'@datagrid-Security.DisableCellDataSanitizer',
				'Security.DisableCellDataSanitizer',
				'Security.DisableCellDataSanitizer-end'
			);
		}
	}

	/**
	 * Function that enables the cell data sanitizer in the respective grid.
	 *
	 * @export
	 * @param {string} gridID ID of the Grid where the change will occur.
	 * @returns {*}  {void}
	 */
	export function EnableCellDataSanitizer(gridID: string): void {
		Performance.SetMark('Security.EnableCellDataSanitizer');
		try {
			GridManager.GetGridById(gridID).features.cellDataSanitizer.enableCellDataSanitizer();
		} finally {
			Performance.SetMark('Security.EnableCellDataSanitizer-end');
			Performance.GetMeasure(
				'@datagrid-Security.EnableCellDataSanitizer',
				'Security.EnableCellDataSanitizer',
				'Security.EnableCellDataSanitizer-end'
			);
		}
	}
}
