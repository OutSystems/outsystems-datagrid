// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event {
    /**
     * This class is a Manager of events. It will be used by the Grid/Columns/etc in order to support
     * the listenning of the different events supported by the parent element.
     * You can almost think of it, as the object that works underneath "document.addEventListener()" API - which will
     * be equivalent to out "GridAPI.GridManager.Events.Subscribe()".
     *
     * @export
     * @abstract
     * @class AbstractEventsManager
     * @template ET type events that this manager will be handling (e.g. GridEventType, ColumnEventTypes, ...)
     * @template D  this will the type of Data to be passed, by default to the handlers.
     */
    export abstract class AbstractEventsManager<ET, D> {
        private _handlers: Map<ET, InternalEvents.IEvent<D>>;

        constructor() {
            this._handlers = new Map<ET, InternalEvents.IEvent<D>>();
        }

        public get handlers(): Map<ET, InternalEvents.IEvent<D>> {
            return this._handlers;
        }

        public addHandler(eventType: ET, handler: Callbacks.Generic): void {
            if (this._handlers.has(eventType)) {
                this._handlers.get(eventType).addHandler(handler);
            } else {
                const ev = this.getInstanceOfEventType(eventType);
                ev.addHandler(handler);
                this._handlers.set(eventType, ev);
            }
        }

        public hasHandlers(eventType: ET): boolean {
            let returnValue = false;
            if (this._handlers.has(eventType)) {
                const event = this._handlers.get(eventType);
                returnValue = event.hasHandlers();
            }
            return returnValue;
        }

        public removeHandler(eventType: ET, handler: Callbacks.Generic): void {
            if (this._handlers.has(eventType)) {
                const event = this._handlers.get(eventType);
                event.removeHandler(handler);
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/explicit-module-boundary-types
        public trigger(eventType: ET, data?: D, ...args): void {
            if (this._handlers.has(eventType)) {
                this._handlers.get(eventType).trigger(data);
            }
        }

        /**
         * This method will be responsible for creating the correct instance of the Event
         * based in the EventType that is passed.
         *
         * @protected
         * @abstract
         * @param {ET} eventType Type of the event that will we need an instance of.
         * @returns {*}  {IEvent<D>} Instance of the event.
         * @memberof AbstractEventsManager
         */
        protected abstract getInstanceOfEventType(
            eventType: ET
        ): InternalEvents.IEvent<D>;
    }
}
