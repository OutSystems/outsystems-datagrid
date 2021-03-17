// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace ExternalEvents {
    /**
     * Class that will make sure that the trigger invokes the handlers
     * with the correct parameters.
     *
     * @abstract
     * @class AbstractGridEvent
     * @extends {AbstractEvent<Grid.IGrid>}
     */
    abstract class AbstractGridEvent extends InternalEvents.AbstractEvent<Grid.IGrid> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        public trigger(gridObj: Grid.IGrid, gridID: string, ...args): void {
            this.handlers.slice(0).forEach((h) => h(gridID, gridObj));
        }
    }

    /**
     * Class that represents the the Initialized event.
     *
     * @class GridInitializedEvent
     * @extends {AbstractEvent<Grid.IGrid>}
     */
    export class GridInitializedEvent extends AbstractGridEvent {}

    /**
     * Class that represents the Filter Change event.
     *
     * @export
     * @class GridOnFilterChangeEvent
     * @extends {AbstractGridEvent}
     */
    export class GridOnFilterChangeEvent extends AbstractGridEvent {
        public trigger(
            gridObj: Grid.IGrid,
            gridID: string,
            serializedActiveFilters: string
        ): void {
            this.handlers
                .slice(0)
                .forEach((h) => h(gridID, gridObj, serializedActiveFilters));
        }
    }

    /**
     * Class that represents the SearchEnd event.
     *
     * @class GridSearchEndEvent
     * @extends {AbstractEvent<Grid.IGrid>}
     */
    export class GridSearchEndEvent extends AbstractGridEvent {}
}
