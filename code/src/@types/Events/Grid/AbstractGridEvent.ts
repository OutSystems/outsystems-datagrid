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
    export abstract class AbstractGridEvent extends InternalEvents.AbstractEvent<Grid.IGrid> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        public trigger(gridObj: Grid.IGrid, gridID: string, ...args): void {
            this.handlers.slice(0).forEach((h) => h(gridID, gridObj));
        }
    }}