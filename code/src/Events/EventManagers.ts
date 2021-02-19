// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace ExternalEvents {
    /**
     * Events currently supported in the Grid element.
     *
     * @export
     * @enum {string}
     */
    export enum GridEventType {
        Initialized = 'Initialized',
        SearchEnded = 'SearchEnded'
    }

    /**
     * Events currently supported in the Column element.
     *
     * @export
     * @enum {number}
     */
    export enum ColumnEventType {
        ActionClick = 'ActionClick'
    }

    /**
     * Events currently supported in the Context Menu element.
     *
     * @export
     * @enum {number}
     */
    export enum ContextMenuEventType {
        Toggle = 'Toggle'
    }

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

        public removeHandler(eventType: ET, handler: Callbacks.Generic): void {
            if (this._handlers.has(eventType)) {
                const event = this._handlers.get(eventType);
                event.removeHandler(handler);
            }
        }

        public trigger(eventType: ET, data?: D): void {
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

    /**
     * Class that will be responsible for managing the events of the grid.
     *
     * @export
     * @class GridEventsManager
     * @extends {AbstractEventsManager<GridEventType, Grid.IGrid>}
     */
    export class GridEventsManager extends AbstractEventsManager<
        GridEventType,
        Grid.IGrid
    > {
        protected getInstanceOfEventType(
            eventType: GridEventType
        ): InternalEvents.IEvent<Grid.IGrid> {
            let event: InternalEvents.IEvent<Grid.IGrid>;

            switch (eventType) {
                case GridEventType.Initialized:
                    event = new GridInitializedEvent();
                    break;
                case GridEventType.SearchEnded:
                    event = new GridSearchEndEvent();
                    break;
                default:
                    throw `The event '${eventType}' is not supported in a grid`;
                    break;
            }
            return event;
        }

        public trigger(event: GridEventType, gridObj: Grid.IGrid): void {
            if (this.handlers.has(event)) {
                this.handlers.get(event).trigger(gridObj, gridObj.widgetId);
            }
        }
    }

    export class ColumnEventsManager extends AbstractEventsManager<
        ColumnEventType,
        string
    > {
        private _column: Column.IColumn;

        constructor(column: Column.IColumn) {
            super();
            this._column = column;
        }

        protected getInstanceOfEventType(
            eventType: ColumnEventType
        ): InternalEvents.IEvent<string> {
            let event: InternalEvents.IEvent<string>;

            switch (eventType) {
                case ColumnEventType.ActionClick:
                    event = new ActionColumnClick();
                    break;
                default:
                    throw `The event '${eventType}' is not supported in a column`;
                    break;
            }
            return event;
        }

        public trigger(event: ColumnEventType, line: string): void {
            if (this.handlers.has(event)) {
                this.handlers
                    .get(event)
                    .trigger(
                        this._column.grid.widgetId,
                        this._column.widgetId,
                        line
                    );
            }
        }
    }
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
                    event = new OpenContextMenu();
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
