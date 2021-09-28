// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event.Grid {
    /**
     *Class that represents the Sort Change event.
     *
     * @export
     * @class GridOnSortChangeEvent
     * @extends {AbstractGridEvent}
     */
    export class GridOnSortChangeEvent extends AbstractGridEvent {
        /**
         * Method that will trigger the event with the correct parameters.
         *
         * @param gridObj grid that is raising the event
         * @param gridID id of the grid that is raising the event
         * @param activeSorts list of currently active sorts
         */
        public trigger(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            gridObj: OSFramework.Grid.IGrid,
            gridID: string,
            activeSorts: Array<OSStructure.ActiveSort>
        ): void {
            const serializedActiveSorts = JSON.stringify(activeSorts);
            this.handlers
                .slice(0)
                .forEach((h) =>
                    Helper.AsyncInvocation(
                        h,
                        gridID,
                        gridObj,
                        serializedActiveSorts
                    )
                );
        }
    }
}
