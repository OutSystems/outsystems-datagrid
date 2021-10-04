// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event.Grid {
    export class ValidatingAction implements IEvent<Actions> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _handlers: Callbacks.Generic[] = [];

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public addHandler(handler: Callbacks.Generic) {
            this._handlers.push(handler);
        }

        public hasHandlers(): boolean {
            return this._handlers.length > 0;
        }

        public removeHandler(handler: Callbacks.Generic): void {
            const index = this._handlers.findIndex((hd) => {
                return hd === handler;
            });

            if (index !== -1) {
                this._handlers.splice(index, 1);
            }
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public trigger(data: Actions, ctx: any): Array<string> {
            return this._handlers
                .slice(0)
                .map((h) => h(data, ctx))
                .filter((p) => p);
        }
    }
}
