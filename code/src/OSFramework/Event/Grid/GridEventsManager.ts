// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event.Grid {
    /**
     * Class that will be responsible for managing the events of the grid.
     *
     * @export
     * @class GridEventsManager
     * @extends {AbstractEventsManager<GridEventType, OSFramework.Grid.IGrid>}
     */
    export class GridEventsManager extends AbstractEventsManager<
        GridEventType,
        OSFramework.Grid.IGrid
    > {
        private _grid: OSFramework.Grid.IGrid;

        constructor(grid: OSFramework.Grid.IGrid) {
            super();
            this._grid = grid;
        }

        protected getInstanceOfEventType(
            eventType: GridEventType
        ): OSFramework.Event.IEvent<OSFramework.Grid.IGrid> {
            let event: OSFramework.Event.IEvent<OSFramework.Grid.IGrid>;

            switch (eventType) {
                case GridEventType.Initialized:
                    event = new GridInitializedEvent();
                    break;
                case GridEventType.OnFiltersChange:
                    event = new GridOnFiltersChangeEvent();
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

        public addHandler(
            eventType: GridEventType,
            handler: GridAPI.Callbacks.OSGrid.Event
        ): void {
            //if the grid is already ready, fire immediatly the event.
            if (eventType === GridEventType.Initialized && this._grid.isReady) {
                //make the invocation of the handler assync.
                setTimeout(() => handler(this._grid.widgetId, this._grid), 0);
            } else {
                super.addHandler(eventType, handler);
            }
        }

        public trigger(
            event: GridEventType,
            gridObj: OSFramework.Grid.IGrid,
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
            ...args
        ): void {
            if (this.handlers.has(event)) {
                this.handlers
                    .get(event)
                    .trigger(gridObj, gridObj.widgetId, ...args);
            }
        }
    }
}
