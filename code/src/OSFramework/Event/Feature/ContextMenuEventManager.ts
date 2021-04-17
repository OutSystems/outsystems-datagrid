// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event.Feature {
    /**
     * Class that will be responsible for managing the events of the context menu.
     *
     * @export
     * @class ContextMenuEventManager
     * @extends {AbstractEventsManager<ContextMenuEventType, string>}
     */
    export class ContextMenuEventManager extends AbstractEventsManager<
        ContextMenuEventType,
        string
    > {
        private _contextMenu: Features.ContextMenu;

        constructor(contextMenu: Features.ContextMenu) {
            super();
            this._contextMenu = contextMenu;
        }

        protected getInstanceOfEventType(
            eventType: ContextMenuEventType
        ): InternalEvents.IEvent<string> {
            let event: InternalEvents.IEvent<string>;

            switch (eventType) {
                case ContextMenuEventType.Toggle:
                    event = new ToggleContextMenu();
                    break;
                default:
                    throw `The event '${eventType}' is not supported in a context menu`;
                    break;
            }
            return event;
        }

        public trigger(event: ContextMenuEventType): void {
            if (this.handlers.has(event)) {
                this.handlers
                    .get(event)
                    .trigger(
                        this._contextMenu.grid.widgetId,
                        this._contextMenu.isOpening
                    );
            }
        }
    }
}
