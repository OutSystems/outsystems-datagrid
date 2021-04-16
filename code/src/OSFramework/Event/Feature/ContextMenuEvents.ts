// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace ExternalEvents {
    /**
     * Class that encapsulate the basic logic of triggering the event of opening/closing the context menu with the right parameters order.
     *
     * @class ToggleContextMenu
     * @extends {InternalEvents.AbstractEvent<string>}
     */
    export class ToggleContextMenu extends InternalEvents.AbstractEvent<string> {
        public trigger(gridID: string, isOpening: boolean): void {
            this.handlers.slice(0).forEach((h) => h(gridID, isOpening));
        }
    }
}
