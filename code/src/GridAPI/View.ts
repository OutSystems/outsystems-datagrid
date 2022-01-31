// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI {
    /**
     * API used for saving and load View definitions
     */
    export namespace View {
        /**
         * Get the current layout of a given grid
         * @param gridID Grid ID
         * @returns A JSON representing the current grid configuration
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        export function GetViewLayout(gridID: string): string {
            if (!OSFramework.Helper.IsGridReady(gridID)) return;
            const grid = GridManager.GetGridById(gridID);

            PerformanceAPI.SetMark('View.GetViewLayout');

            let output = '';

            output = JSON.stringify(grid.getViewLayout());

            PerformanceAPI.SetMark('View.GetViewLayout-end');
            PerformanceAPI.GetMeasure(
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
            if (!OSFramework.Helper.IsGridReady(gridID)) return;
            const grid = GridManager.GetGridById(gridID);

            PerformanceAPI.SetMark('View.SetViewLayout');

            let output = '';

            output = JSON.stringify(grid.setViewLayout(config));

            PerformanceAPI.SetMark('View.SetViewLayout-end');
            PerformanceAPI.GetMeasure(
                '@datagrid-View.SetViewLayout',
                'View.SetViewLayout',
                'View.SetViewLayout-end'
            );

            return output;
        }
    }
}
