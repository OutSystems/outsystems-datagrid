// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event.Grid {
    export class OnColumnPickerChangeEvent extends AbstractGridEvent {
        public trigger(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            gridObj: OSFramework.Grid.IGrid,
            gridID: string,
            columnId: string,
            isColumnVisible: boolean
        ): void {
            this.handlers
                .slice(0)
                .forEach((h) =>
                    Helper.AsyncInvocation(
                        h,
                        gridID,
                        gridObj,
                        columnId,
                        isColumnVisible
                    )
                );
        }
    }
}
