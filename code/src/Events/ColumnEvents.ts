// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace ExternalEvents {
    /**
     * Abstract class that encapsulate the baisc logic of triggering the events with the right parameters order.
     *
     * @abstract
     * @class AbstractColumnEvent
     * @extends {InternalEvents.AbstractEvent<string>}
     */
    abstract class AbstractColumnEvent extends InternalEvents.AbstractEvent<string> {
        public trigger(gridID: string, columnID: string, line: string): void {
            this.handlers.slice(0).forEach((h) => h(gridID, columnID, line));
        }
    }

    export class ActionColumnClick extends AbstractColumnEvent {}
}
