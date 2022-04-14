// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI {
    /**
     * API used defining column picker configs
     */
    export namespace ColumnPicker {
        /**
         * Set the visibility of the hidden columns (Visible = False and CanBeHidden = True) on the grid Column Picker.
         * By default, all columns are displayed in the Column Picker.
         * @param gridID Grid ID
         * @param showHiddenColumns Displays the name of the columns that are not visible and whose visibility cannot be changed.
         */

        export function SetColumnVisibility(
            gridID: string,
            showHiddenColumns: boolean
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        ): any {
            PerformanceAPI.SetMark('ColumnPicker.SetColumnVisibility');
            const responseObj = {
                isSuccess: true,
                message: OSFramework.Enum.ErrorMessages.SuccessMessage,
                code: OSFramework.Enum.ErrorCodes.GRID_SUCCESS
            };

            if (!OSFramework.Helper.IsGridReady(gridID)) {
                responseObj.isSuccess = false;
                responseObj.message =
                    OSFramework.Enum.ErrorMessages.Grid_NotFound;
                responseObj.code = OSFramework.Enum.ErrorCodes.CFG_GridNotFound;
                return JSON.stringify(responseObj);
            }

            try {
                GridManager.GetGridById(
                    gridID
                ).features.columnPicker.setShowHiddenColumns(showHiddenColumns);
            } catch (error) {
                responseObj.isSuccess = false;
                responseObj.message = error.message;
                responseObj.code =
                    OSFramework.Enum.ErrorCodes.API_FailedSetColumnVisibility;
            }

            PerformanceAPI.SetMark('ColumnPicker.SetColumnVisibility-end');
            PerformanceAPI.GetMeasure(
                '@datagrid-ColumnPicker.SetColumnVisibility',
                'ColumnPicker.SetColumnVisibility',
                'ColumnPicker.SetColumnVisibility-end'
            );

            return JSON.stringify(responseObj);
        }
    }
}
