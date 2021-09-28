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
    export abstract class AbstractGridEvent extends OSFramework.Event
        .AbstractEvent<OSFramework.Grid.IGrid> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        public trigger(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            gridObj: OSFramework.Grid.IGrid,
            gridID: string,
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-unused-vars
            ...args
        ): void {
            this.handlers
                .slice(0)
                .forEach((h) => Helper.AsyncInvocation(h, gridID, gridObj));
        }
    }
}
