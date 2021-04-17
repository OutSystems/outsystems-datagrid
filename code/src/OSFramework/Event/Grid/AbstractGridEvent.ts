// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event.Grid {
    /**
     * Class that will make sure that the trigger invokes the handlers
     * with the correct parameters.
     *
     * @abstract
     * @class AbstractGridEvent
     * @extends {AbstractEvent<OSFramework.Grid.IGrid>}
     */
    export abstract class AbstractGridEvent extends OSFramework.Event.AbstractEvent<OSFramework.Grid.IGrid> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        public trigger(gridObj: OSFramework.Grid.IGrid, gridID: string, ...args): void {
            this.handlers.slice(0).forEach((h) => h(gridID, gridObj));
        }
    }
}
