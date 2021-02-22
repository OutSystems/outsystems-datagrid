// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace ExternalEvents {
    /**
     * Abstract class that encapsulate the baisc logic of triggering the events with the right parameters order.
     *
     * @abstract
     * @class AbstractContextMenuEvent
     * @extends {InternalEvents.AbstractEvent<string>}
     */
    abstract class AbstractContextMenuEvent extends InternalEvents.AbstractEvent<string> {
        public trigger(gridID: string, isOpening: boolean): void {
            this.handlers.slice(0).forEach((h) => h(gridID, isOpening));
        }
    }

    export class ToggleContextMenu extends AbstractContextMenuEvent {}
}
