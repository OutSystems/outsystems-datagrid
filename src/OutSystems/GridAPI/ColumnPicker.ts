namespace OutSystems.GridAPI.ColumnPicker {
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
        Performance.SetMark('ColumnPicker.SetColumnVisibility');
        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode:
                OSFramework.DataGrid.Enum.ErrorCodes
                    .API_FailedSetColumnVisibility,
            callback: () => {
                GridManager.GetGridById(
                    gridID
                ).features.columnPicker.setShowHiddenColumns(showHiddenColumns);
            }
        });

        Performance.SetMark('ColumnPicker.SetColumnVisibility-end');
        Performance.GetMeasure(
            '@datagrid-ColumnPicker.SetColumnVisibility',
            'ColumnPicker.SetColumnVisibility',
            'ColumnPicker.SetColumnVisibility-end'
        );

        return result;
    }
}

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
            OSFramework.DataGrid.Helper.LogWarningMessage(
                `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.ColumnPicker.SetColumnVisibility()'`
            );
            return OutSystems.GridAPI.ColumnPicker.SetColumnVisibility(
                gridID,
                showHiddenColumns
            );
        }
    }
}
