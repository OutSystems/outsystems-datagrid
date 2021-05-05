// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.ConditionalFormat {
    /**
     *
     *
     * @export
     * @param {string} gridID
     * @param {string} phID
     * @param {number} buttonQuantity
     */
    export function AddConditionalFormat(
        gridID: string,
        binding: string,
        rule: any
    ): void {
        GridManager.Events.Subscribe(
            GridManager.GetActiveGrid().uniqueId,
            OSFramework.Event.Grid.GridEventType.Initialized,
            (gridId: string, gridObj: OSFramework.Grid.IGrid) => {
                gridObj.features.conditionalFormat.addRule(binding, rule);
            }
        );
    }
}
