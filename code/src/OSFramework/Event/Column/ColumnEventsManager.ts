// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event.Column {
    /**
     * Class that will be responsible for managing the events of grid columns.
     *
     * @export
     * @class ColumnEventsManager
     * @extends {AbstractEventsManager<ColumnEventType, string>}
     */
    export class ColumnEventsManager extends AbstractEventsManager<
        ColumnEventType,
        string
    > {
        private _column: OSFramework.Column.IColumn;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        constructor(column: OSFramework.Column.IColumn) {
            super();
            this._column = column;
        }

        protected getInstanceOfEventType(
            eventType: ColumnEventType
        ): Event.IEvent<string> {
            let event: Event.IEvent<string>;

            switch (eventType) {
                case ColumnEventType.ActionClick:
                    event = new ActionColumnClick();
                    break;
                case ColumnEventType.OnCellValueChange:
                    event = new OnCellValueChange();
                    break;
                default:
                    throw `The event '${eventType}' is not supported in a column`;
                    break;
            }
            return event;
        }

        /**
         * Trigger the specific events depending on the event type specified
         * @param eventType Type of the event currently supported in the Column element.
         * @param value Value to be passed to OS in the type of a string.
         * @param rowNumber (Optional) Number of the row in which the event ocurrs.
         */
        public trigger(
            eventType: ColumnEventType,
            value: string,
            oldValue?: string,
            rowNumber?: number
        ): void {
            if (this.events.has(eventType)) {
                const handlerEvent = this.events.get(eventType);

                switch (eventType) {
                    case ColumnEventType.ActionClick:
                        handlerEvent.trigger(
                            this._column.grid.widgetId, // ID of Grid block that was clicked.
                            this._column.widgetId, // ID of Action Column block that was clicked.
                            value // In this case the value is the JSON Serialization of the line in which the action column that clicked is located.
                        );
                        break;
                    case ColumnEventType.OnCellValueChange:
                        handlerEvent.trigger(
                            this._column.grid.widgetId, // ID of Grid block where the cell value has changed.
                            this._column.widgetId, // ID of the Column block in which the cell value has changed.
                            rowNumber, // Number of the row in which the cell value has changed.
                            oldValue, // Value of the cell before its value has changed (Old)
                            value // Value of the cell after its value has changed (New)
                        );
                        break;
                    default:
                        throw `The event '${eventType}' is not supported in a column`;
                        break;
                }
            }
        }
    }
}
