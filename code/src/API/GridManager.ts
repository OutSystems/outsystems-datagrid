/**
 * Namespace for all public methods to access and use the Data Grid component.
 */
namespace GridAPI {
    /**
     * Format of data as set in service center.
     */
    // eslint-disable-next-line prefer-const
    export let dateFormat = '';

    /**
     *  Namespace that contains functions responsible for interactions with the grid.
     */
    export namespace GridManager {
        const gridMap = new Map<string, Grid.IGrid>(); //grid.uniqueId -> Grid obj
        let activeGrid: Grid.IGrid = undefined;

        /**
         * Function that will change the data source in the respective grid.
         *
         * @param {Grid.IGrid} grid Grid where the change will occur.
         * @param {string} data Data to be set in the data grid in JSON format. If the action ArrangeData is used, metadata will also be present and used to generate the columns of the grid.
         * @returns {*}  {boolean} true if the data was changed in the grid.
         */
        function setDataInGrid(grid: Grid.IGrid, data: string): boolean {
            let output = false;
            if (grid !== undefined) {
                if (grid.isReady && data !== '' && data !== '{}') {
                    grid.setData(data);
                }
                output = true;
            }
            return output;
        }

        /**
         * Function that creates an instance of grid object with the configurations passed.
         *
         * @export
         * @param {string} gridID ID of the Grid where the change will occur.
         * @param {string} configs configurations for the grid in JSON format.
         * @returns {*}  {Grid.IGrid} instance of the grid.
         */
        export function CreateGrid(
            gridID: string,
            configs: string
        ): Grid.IGrid {
            const _grid = Grid.GridFactory.MakeGrid(
                Grid.GridType.FlexGrid,
                gridID,
                JSON.parse(configs)
            );

            if (gridMap.has(gridID)) {
                throw new Error(
                    `There is already a grid registered under id:${gridID}`
                );
            }

            gridMap.set(gridID, _grid);
            activeGrid = _grid;

            Events.CheckPendingEvents(gridID);

            return _grid;
        }

        /**
         * Function that gets the instance of grid, by a given ID.
         *
         * @export
         * @param {string} gridID ID of the Grid where the change will occur.
         * @param {boolean} raiseError Will raise errors when there is no object with this uniqueId
         * @returns {*}  {Grid.IGrid} instance of the grid.
         */
        export function GetGridById(gridID: string, raiseError = true): Grid.IGrid {
            let grid: Grid.IGrid;

            //gridID is the UniqueId
            if (gridMap.has(gridID)) {
                grid = gridMap.get(gridID);
            } else {
                //Search for WidgetId
                for (const p of gridMap.values()) {
                    if (p.equalsToID(gridID)) {
                        grid = p;
                        break;
                    }
                }
            }

            if (grid === undefined && raiseError) {
                throw new Error(`Grid id:${gridID} not found`);
            }

            return grid;
        }

        /**
         * Function that gets the instance of the current active grid. The active grid, is always the last (existing) grid that was created in the page.
         *
         * @export
         * @returns {*}  {Grid.IGrid} instance of the active grid.
         */
        export function GetActiveGrid(): Grid.IGrid {
            return activeGrid;
        }

        /**
         * Function that initializes the provider grid in the page.
         * The current provider grid is wijmo.
         * @export
         * @param {string} gridID ID of the Grid that is to be initialized.
         * @param {string} [data='{}']  Data to be set in the data grid in JSON format. If the action ArrangeData is used, metadata will also be present and used to generate the columns of the grid.
         * @returns {*}  {boolean} true if the grid was initialized.
         */
        export function InitializeGrid(gridID: string, data = '{}'): boolean {
            let output = false;
            const grid = GetGridById(gridID);

            grid.build();

            output = setDataInGrid(grid, data);

            return output;
        }

        /**
         * Function that will change the data source in the respective grid.
         *
         * @export
         * @param {string} gridID ID of the Grid where the change will occur.
         * @param {string} data Data to be set in the data grid in JSON format. If the action ArrangeData is used, metadata will also be present and used to generate the columns of the grid.
         * @returns {*}  {boolean} true if the data was changed in the grid.
         */
        export function SetGridData(gridID: string, data: string): boolean {
            const grid = GetGridById(gridID);
            const output = setDataInGrid(grid, data);
            return output;
        }

        /**
         * Function that will destroy the grid from the page.
         *
         * @export
         * @param {string} gridID ID of the Grid to be destroyed.
         */
        export function RemoveGrid(gridID: string): void {
            const grid = GetGridById(gridID);

            gridMap.delete(grid.uniqueId);

            //Update activeGrid with the most recent one
            if (activeGrid.uniqueId === grid.uniqueId) {
                activeGrid = Array.from(gridMap.values()).pop();
            }

            grid.dispose();
        }

        /**
         * Function that will change the property of a given grid.
         *
         * @export
         * @param {string} gridID ID of the Grid where the change will occur.
         * @param {string} propertyName name of the property to be changed - some properties of the provider might not work out of be box.
         * @param {*} propertyValue value to which the property should be changed to.
         */
        export function ChangeProperty(
            gridID: string,
            propertyName: string,
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
            propertyValue: any
        ): void {
            const grid = GetGridById(gridID);

            grid.changeProperty(propertyName, propertyValue);
        }

        /**
         *
         *
         * @export
         * @param {string} gridID
         */
        export function DestroyGrid(gridID: string): void {
            const grid = GetGridById(gridID);

            gridMap.delete(grid.uniqueId);

            //Update activeGrid with the most pecent one
            if (activeGrid.uniqueId === grid.uniqueId) {
                activeGrid = Array.from(gridMap.values()).pop();
            }

            grid.dispose();
        }

        /**
         * Function responsible for setting up the the date format to be used in all grids.
         *
         * @export
         * @param {string} date example of date.
         */
        export function SetDateSample(date: string): void {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            GridAPI.dateFormat = date
                .replace('13', 'dd')
                .replace('10', 'MM')
                .replace('1900', 'yyyy');
        }

        /**
         * Function that obtains all the changed lines (added, edited, removed) by the user.
         *
         * @export
         * @param {string} gridID ID of the Grid where the change will occur.
         * @returns {*}  {string} Changed lines in JSON format.
         */
        export function GetChangesInGrid(gridID: string): string {
            const grid = GetGridById(gridID);
            let output = '';

            if (grid !== undefined) {
                output = JSON.stringify(grid.getChangesMade());
            }

            return output;
        }

        /**
         * Function that will add new rows to the grid
         *
         * @export
         * @param {string} gridID ID of the Grid where the change will occur.
         * @returns {*}  {string} Resulting code and message in JSON format
         */
        export function AddRows(gridID: string): string {
            const grid = GetGridById(gridID);
            let output = '';

            if (grid !== undefined) {
                output = JSON.stringify(grid.features.rows.addNewRows());
            }

            return output;
        }

        /**
         * Function that will remove the selected rows from the grid.
         *
         * @export
         * @param {string} gridID ID of the Grid where the change will occur.
         * @returns {*}  {string} Resulting code and message in JSON format
         */
        export function RemoveRows(gridID: string): string {
            const grid = GetGridById(gridID);
            let output = '';

            if (grid !== undefined) {
                output = JSON.stringify(
                    grid.features.rows.removeSelectedRows()
                );
            }

            return output;
        }

        /**
         * Function that will mark all changes as saved.
         *
         * @export
         * @param {string} gridID ID of the Grid where the change will occur.
         */
        export function MarkChangesAsSaved(gridID: string): void {
            const grid = GetGridById(gridID);

            if (grid !== undefined) {
                grid.clearAllChanges();
            }
        }
    }
}
