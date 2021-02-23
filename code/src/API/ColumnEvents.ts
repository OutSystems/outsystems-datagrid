// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.ColumnManager.Events {
    /**
     * API method to subscribe to events of a specific column.
     *
     * @export
     * @param {string} columnID column in which to attach to an event.
     * @param {InternalEvents.ColumnEventType} eventName event to which attach to.
     * @param {Callbacks.OSColumn.ClickEvent} callback to be invoked qhen the event occurs.
     */
    export function Subscribe(
        columnID: string,
        eventName: ExternalEvents.ColumnEventType,
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        callback: Callbacks.OSColumn.ClickEvent
    ): void {
        const column = GetColumnById(columnID);
        column.columnEvents.addHandler(eventName, callback);
        //TODO: [RGRIDT-636] in case the column is not found we should trigger an error.
    }
}
