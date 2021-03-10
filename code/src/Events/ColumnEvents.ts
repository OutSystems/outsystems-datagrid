// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace ExternalEvents {
    /**
     * Abstract class that encapsulates the basic logic of triggering the events with the right parameters order.
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

    /**
     * Class that encapsulates the basic logic of triggering the event with the right parameters order right after a cell changes its value.
     *
     * @class OnCellValueChange
     * @extends {InternalEvents.AbstractEvent<string>}
     */
    export class OnCellValueChange extends InternalEvents.AbstractEvent<string> {
        public trigger(
            gridID: string,
            rowNumber: number,
            columnID: string,
            newValue: string
        ): void {
            this.handlers
                .slice(0)
                .forEach((h) => h(gridID, rowNumber, columnID, newValue));
        }
    }
}
