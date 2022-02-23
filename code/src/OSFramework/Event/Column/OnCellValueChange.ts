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
            newValue: string,
            isAsync = true
        ): void {
            this.handlers.slice(0).forEach((h) => {
                // RGRIDT-1122: if column is sorted, we want on cell change event to be handled syncronally, because in some cases our validation happens before sorting occurs.
                if (isAsync) {
                    Helper.AsyncInvocation(
                        h,
                        gridID,
                        rowNumber,
                        columnID,
                        oldValue,
                        newValue
                    );
                } else {
                    Helper.SyncInvocation(
                        h,
                        gridID,
                        rowNumber,
                        columnID,
                        oldValue,
                        newValue
                    );
                }
            });
        }
    }
}
