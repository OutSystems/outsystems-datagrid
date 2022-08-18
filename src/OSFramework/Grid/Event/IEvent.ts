namespace OSFramework.Event {
    /**
     * This interface is the base to all events. All events (both internal or external)
     * need to implement it.
     *
     * @export
     * @interface IEvent
     * @template D this will the type of Data to be passed, by default to the handlers.
     */
    export interface IEvent<D> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        addHandler(handler: OSFramework.Callbacks.Generic, ...args);
        hasHandlers(): boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        removeHandler(handler: OSFramework.Callbacks.Generic);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        trigger(data: D, ...args): any;
    }
}
