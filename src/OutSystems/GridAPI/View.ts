namespace OutSystems.GridAPI.View {
    /**
     * Get the current layout of a given grid
     * @param gridID Grid ID
     * @returns A JSON representing the current grid configuration
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export function GetViewLayout(gridID: string): string {
        if (!OSFramework.DataGrid.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        Performance.SetMark('View.GetViewLayout');

        let output = '';

        output = JSON.stringify(grid.getViewLayout());

        Performance.SetMark('View.GetViewLayout-end');
        Performance.GetMeasure(
            '@datagrid-View.GetViewLayout',
            'View.GetViewLayout',
            'View.GetViewLayout-end'
        );

        return output;
    }

    /**
     * Load a predefined layout on a given grid
     * @param gridID Grid ID
     * @param config A JSON representing a previous saved visualization
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    export function SetViewLayout(gridID: string, config: any): any {
        if (!OSFramework.DataGrid.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        Performance.SetMark('View.SetViewLayout');

        let output = '';

        output = JSON.stringify(grid.setViewLayout(config));

        Performance.SetMark('View.SetViewLayout-end');
        Performance.GetMeasure(
            '@datagrid-View.SetViewLayout',
            'View.SetViewLayout',
            'View.SetViewLayout-end'
        );

        return output;
    }

    /**
     * Get the current layout of a given grid
     * @param gridID Grid ID
     * @returns A JSON representing the current grid configuration
     */
    export function GetColumnsOrder(gridID: string): string {
        Performance.SetMark('View.GetColumnsOrder');

        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedAddClass,
            callback: () => {
                return GridManager.GetGridById(
                    gridID
                ).features.column.getColumnsOrder();
            },
            hasValue: true
        });

        Performance.SetMark('View.GetColumnsOrder-end');
        Performance.GetMeasure(
            '@datagrid-View.GetColumnsOrder',
            'View.GetColumnsOrder',
            'View.GetColumnsOrder-end'
        );

        return result;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI {
    /**
     * API used for saving and load View definitions
     */
    export namespace View {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        export function GetViewLayout(gridID: string): string {
            OSFramework.DataGrid.Helper.LogWarningMessage(
                `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.View.GetViewLayout()'`
            );
            return OutSystems.GridAPI.View.GetViewLayout(gridID);
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        export function SetViewLayout(gridID: string, config: any): any {
            OSFramework.DataGrid.Helper.LogWarningMessage(
                `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.View.SetViewLayout()'`
            );
            return OutSystems.GridAPI.View.SetViewLayout(gridID, config);
        }
    }
}
