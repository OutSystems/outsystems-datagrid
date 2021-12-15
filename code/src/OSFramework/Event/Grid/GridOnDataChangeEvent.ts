// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event.Grid {
    /**
     *Class that represents the Data Change event.
     *
     * @export
     * @class GridOnDataChangeEvent
     * @extends {AbstractGridEvent}
     */
    export class GridOnDataChangeEvent extends AbstractGridEvent {
        /**
         * Method that will trigger the event with the correct parameters.
         *
         * @param gridObj grid that is raising the event
         * @param gridID id of the grid that is raising the event
         * @param dataChanges changes that happened on grid
         */
        public trigger(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            gridObj: OSFramework.Grid.IGrid,
            gridID: string,
            dataChanges: OSStructure.DataChanges
        ): void {
            const serializedDataChanges = JSON.stringify(dataChanges);
            this.handlers
                .slice(0)
                .forEach((h) =>
                    Helper.AsyncInvocation(
                        h,
                        gridID,
                        gridObj,
                        serializedDataChanges
                    )
                );
        }
    }
}
