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
        private _contextMenu: OSFramework.Feature.IContextMenu;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        constructor(contextMenu: OSFramework.Feature.IContextMenu) {
            super();
            this._contextMenu = contextMenu;
        }

        protected getInstanceOfEventType(
            eventType: ContextMenuEventType
        ): Event.IEvent<string> {
            let event: Event.IEvent<string>;

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
            if (this.events.has(event)) {
                this.events
                    .get(event)
                    .trigger(
                        this._contextMenu.grid.widgetId,
                        this._contextMenu.isOpening,
                        this._contextMenu.columnUniqueId
                    );
            }
        }
    }
}
