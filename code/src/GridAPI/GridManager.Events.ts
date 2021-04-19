// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.GridManager.Events {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    const _pendingEvents: Map<
        string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { cb: any; event: OSFramework.Event.Grid.GridEventType }[]
    > = new Map<
        string,
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        { cb: any; event: OSFramework.Event.Grid.GridEventType }[]
    >();

    /**
     * API method to subscribe to events of a specific grid.
     *
     * @export
     * @param {string} gridID grid in which to attach to an event.
     * @param {OSFramework.Event.Grid.GridEventType} eventName event to which attach to.
     * @param {GridAPI.Callbacks.OSGrid.Event} callback to be invoked qhen the event occurs.
     */
    export function Subscribe(
        gridID: string,
        eventName: OSFramework.Event.Grid.GridEventType,
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        callback: OSFramework.Callbacks.OSGrid.Event
    ): void {
        const grid = GetGridById(gridID);
        if (grid === undefined) {
            if (_pendingEvents.has(gridID)) {
                _pendingEvents.get(gridID).push({
                    event: eventName,
                    cb: callback
                });
            } else {
                _pendingEvents.set(gridID, [
                    {
                        event: eventName,
                        cb: callback
                    }
                ]);
            }
        } else {
            grid.gridEvents.addHandler(eventName, callback);
        }
    }

    /**
     * API method to check if there are pending events to a specific grid.
     *
     * @export
     * @param {string} gridID grid that is ready for events to be attached to.
     */
    export function CheckPendingEvents(gridID: string): void {
        if (_pendingEvents.has(gridID)) {
            const grid = GetGridById(gridID);
            _pendingEvents.get(gridID).forEach((obj) => {
                grid.gridEvents.addHandler(obj.event, obj.cb);
            });
            _pendingEvents.delete(gridID);
        }
    }

    export function Unsubscribe(
        gridID: string,
        eventName: OSFramework.Event.Grid.GridEventType,
        // eslint-disable-next-line
        callback: OSFramework.Callbacks.OSGrid.Event
    ): void {
        const grid = GetGridById(gridID, false);
        if (grid !== undefined) {
            grid.gridEvents.removeHandler(eventName, callback);
        } else {
            if (_pendingEvents.has(gridID)) {
                const index = _pendingEvents
                    .get(gridID)
                    .findIndex((element) => {
                        return (
                            element.event === eventName &&
                            element.cb === callback
                        );
                    });
                if (index !== -1) {
                    _pendingEvents.get(gridID).splice(index, 1);
                }
            }
        }
    }
}
