// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Event.Grid {
    /**
     *Class that represents the Row Checkbox Change event.
     *
     * @export
     * @class GridOnCheckedRowsChangeEvent
     * @extends {AbstractGridEvent}
     */
    export class GridOnCheckedRowsChangeEvent extends AbstractGridEvent {
        /**
         * Method that will trigger the event with the correct parameters.
         *
         * @param gridObj grid that is raising the event
         * @param gridID id of the grid that is raising the event
         * @param rowNumber number of the row that is raising the event
         * @param isChecked boolean that indicates if the row was selected or unselected
         * @param rowData  data of the row that is raising the event
         */
        public trigger(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            gridObj: OSFramework.DataGrid.Grid.IGrid,
            gridID: string,
            rowNumber: number,
            isChecked: boolean,
            rowData: string
        ): void {
            this.handlers
                .slice(0)
                .forEach((h) =>
                    Helper.AsyncInvocation(
                        h,
                        gridID,
                        rowNumber,
                        isChecked,
                        rowData
                    )
                );
        }
    }
}
