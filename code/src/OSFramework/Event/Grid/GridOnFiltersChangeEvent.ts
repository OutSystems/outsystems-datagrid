// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace ExternalEvents {
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
            gridObj: Grid.IGrid,
            gridID: string,
            activeFilters: Array<GridAPI.Structures.ActiveFilter>
        ): void {
            const serializedActiveFilters = JSON.stringify(activeFilters);
            this.handlers
                .slice(0)
                .forEach((h) =>
                    setTimeout(
                        () => h(gridID, gridObj, serializedActiveFilters),
                        0
                    )
                );
        }
    }
}