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
        export function GetViewLayout(gridID: string): any {
            if (!OSFramework.Helper.IsGridReady(gridID)) return;
            const grid = GridManager.GetGridById(gridID);

            return grid.getViewLayout();
        }

        /**
         * Load a predefined layout on a given grid
         * @param gridID Grid ID
         * @param config A JSON representing a previous saved visualization
         */
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        export function SetViewLayout(gridID: string, config: any): void {
            GridManager.Events.Subscribe(
                gridID,
                ExternalEvents.GridEventType.Initialized,
                (gridId: string, gridObj: OSFramework.Grid.IGrid) => {
                    gridObj.setViewLayout(config);
                }
            );
        }
    }
}
