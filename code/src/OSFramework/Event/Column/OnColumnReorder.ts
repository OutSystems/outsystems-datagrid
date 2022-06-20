// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event.Column {
    /**
     * Class that encapsulates the basic logic of triggering the event with the right parameters order right after a cell changes its value.
     *
     * @class OnColumnReorder
     * @extends AbstractColumnEvent
     */
    export class OnColumnReorder extends AbstractColumnEvent {
        public trigger(
            gridID: string,
            columnID: string,
            columnIndex: number
        ): void {
            this.handlers.slice(0).forEach((h) => {
                Helper.SyncInvocation(h, gridID, columnID, columnIndex);
            });
        }
    }
}
