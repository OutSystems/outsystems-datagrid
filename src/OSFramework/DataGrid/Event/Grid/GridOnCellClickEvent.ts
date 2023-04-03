// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Event.Grid {
    /**
     *Class that represents the Cell Click Change event.
     *
     * @export
     * @class GridOnCellClickEvent
     * @extends {AbstractGridEvent}
     */
    export class GridOnCellClickEvent extends AbstractGridEvent {
        /**
         * Method that will trigger the event with the correct parameters.
         *
         * @param gridObj grid that is raising the event
         * @param gridID id of the grid that is raising the event
         * @param columnWidgetId id of the column that is raising the event
         * @param rowNumber id of the row number that is raising the event
         * @param line  data of the row that is raising the event
         */
        public trigger(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            gridObj: OSFramework.DataGrid.Grid.IGrid,
            gridID: string,
            columnWidgetId: string,
            rowNumber: number,
            binding: string,
            line: string
        ): void {
            this.handlers
                .slice(0)
                .forEach((h) =>
                    Helper.AsyncInvocation(
                        h,
                        gridID,
                        columnWidgetId,
                        rowNumber,
                        binding,
                        line
                    )
                );
        }
    }
}
