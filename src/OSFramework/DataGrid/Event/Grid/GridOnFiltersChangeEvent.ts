// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event.Grid {
    /**
     *Class that represents the Filter Change event.
     *
     * @export
     * @class GridOnFiltersChangeEvent
     * @extends {AbstractGridEvent}
     */
    export class GridOnFiltersChangeEvent extends AbstractGridEvent {
        /**
         * Method that will trigger the event with the correct parameters.
         *
         * @param gridObj grid that is raising the event
         * @param gridID id of the grid that is raising the event
         * @param activeFilters list of currently active filters
         */
        public trigger(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            gridObj: OSFramework.Grid.IGrid,
            gridID: string,
            activeFilters: Array<OSStructure.ActiveFilter>
        ): void {
            const serializedActiveFilters = JSON.stringify(activeFilters);
            this.handlers
                .slice(0)
                .forEach((h) =>
                    Helper.AsyncInvocation(
                        h,
                        gridID,
                        gridObj,
                        serializedActiveFilters
                    )
                );
        }
    }
}
