// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.ConditionalFormat {
    /**
     *
     *
     * @export
     * @param {string} gridID
     * @param {string} binding
     * @param {number} rule
     */
    export function AddConditionalFormat(
        gridID: string,
        binding: string,
        rule: Array<OSFramework.OSStructure.ConditionalFormat>
    ): void {
        GridManager.Events.Subscribe(
            gridID,
            OSFramework.Event.Grid.GridEventType.Initialized,
            (gridId: string, gridObj: OSFramework.Grid.IGrid) => {
                gridObj.features.conditionalFormat.addRule(binding, rule);
            }
        );
    }
}
