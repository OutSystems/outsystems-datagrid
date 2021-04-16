namespace ExternalEvents {
    /**
     * Abstract class that encapsulates the basic logic of triggering the events with the right parameters order.
     *
     * @abstract
     * @class AbstractColumnEvent
     * @extends {InternalEvents.AbstractEvent<string>}
     */
    export abstract class AbstractColumnEvent extends InternalEvents.AbstractEvent<string> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public trigger(gridID: string, columnID: string, ...args: any): void {
            this.handlers.slice(0).forEach((h) => h(gridID, columnID, ...args));
        }
    }
}