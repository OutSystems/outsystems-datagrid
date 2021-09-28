// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event {
    /**
     * Abstract class that will be responsible for the basic behaviours of a link, namely storing the callbacks.
     *
     * @export
     * @abstract
     * @class AbstractEvent
     * @implements {IEvent<T>}
     * @template T
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export abstract class AbstractEvent<T> implements IEvent<T> {
        private _handlers: Callbacks.Generic[] = [];

        protected get handlers(): Callbacks.Generic[] {
            return this._handlers;
        }

        public addHandler(handler: Callbacks.Generic): void {
            this._handlers.push(handler);
        }

        public hasHandlers(): boolean {
            return this._handlers.length > 0;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public removeHandler(handler: Callbacks.Generic): void {
            const index = this._handlers.findIndex((hd) => {
                return hd === handler;
            });

            if (index !== -1) {
                this._handlers.splice(index, 1);
            }
        }

        // eslint-disable-next-line  @typescript-eslint/no-unused-vars, @typescript-eslint/explicit-module-boundary-types
        public trigger(data?: T, ...args): void {
            // eslint-disable-next-line no-debugger
            this._handlers
                .slice(0)
                .forEach((h) => Helper.AsyncInvocation(h, data));
        }
    }
}
