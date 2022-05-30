// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event.Column {
    /**
     * Class that encapsulates the basic logic of triggering the event with the right parameters order right after a cell changes its value.
     *
     * @class OnCellValueChange
     * @extends AbstractColumnEvent
     */
    export class OnCellValueChange extends AbstractColumnEvent {
        public trigger(
            gridID: string,
            columnID: string,
            rowNumber: number,
            oldValue: string,
            newValue: string
        ): void {
            this.handlers.slice(0).forEach((h) => {
                Helper.SyncInvocation(
                    h,
                    gridID,
                    rowNumber,
                    columnID,
                    oldValue,
                    newValue
                );
            });
        }
    }
}
