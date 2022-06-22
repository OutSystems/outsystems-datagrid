namespace OutSystems.GridAPI.ConditionalFormat {
    /**
     * Adds new conditional format rules to the desired binding.
     *
     * @export
     * @param {string} gridID
     * @param {string} binding Column binding
     * @param {Array<OSFramework.OSStructure.ConditionalFormat>} rules Rules for conditional formatting.
     */
    export function AddConditionalFormat(
        gridID: string,
        binding: string,
        rules: Array<OSFramework.OSStructure.ConditionalFormat>
    ): void {
        GridManager.Events.Subscribe(
            gridID,
            OSFramework.Event.Grid.GridEventType.Initialized,
            (_gridId: string, gridObj: OSFramework.Grid.IGrid) => {
                PerformanceAPI.SetMark(
                    'ConditionalFormat.AddConditionalFormat'
                );
                gridObj.features.conditionalFormat.addRules(binding, rules);

                PerformanceAPI.SetMark(
                    'ConditionalFormat.AddConditionalFormat-end'
                );
                PerformanceAPI.GetMeasure(
                    '@datagrid-ConditionalFormat.AddConditionalFormat',
                    'ConditionalFormat.AddConditionalFormat',
                    'ConditionalFormat.AddConditionalFormat-end'
                );
            }
        );
    }

    /**
     * Removes rules of desired binding.
     *
     * @export
     * @param {string} gridID
     * @param {string} binding Column binding
     */
    export function RemoveConditionalFormat(
        gridID: string,
        binding: string
    ): void {
        GridManager.Events.Subscribe(
            gridID,
            OSFramework.Event.Grid.GridEventType.Initialized,
            (_gridId: string, gridObj: OSFramework.Grid.IGrid) => {
                PerformanceAPI.SetMark(
                    'ConditionalFormat.RemoveConditionalFormat'
                );
                gridObj.features.conditionalFormat.removeRules(binding);

                PerformanceAPI.SetMark(
                    'ConditionalFormat.RemoveConditionalFormat-end'
                );
                PerformanceAPI.GetMeasure(
                    '@datagrid-ConditionalFormat.RemoveConditionalFormat',
                    'ConditionalFormat.RemoveConditionalFormat',
                    'ConditionalFormat.RemoveConditionalFormat-end'
                );
            }
        );
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.ConditionalFormat {
    /**
     * Adds new conditional format rules to the desired binding.
     *
     * @export
     * @param {string} gridID
     * @param {string} binding Column binding
     * @param {Array<OSFramework.OSStructure.ConditionalFormat>} rules Rules for conditional formatting.
     */
    export function AddConditionalFormat(
        gridID: string,
        binding: string,
        rules: Array<OSFramework.OSStructure.ConditionalFormat>
    ): void {
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.ConditionalFormat.AddConditionalFormat()'`
        );
        return OutSystems.GridAPI.ConditionalFormat.AddConditionalFormat(
            gridID,
            binding,
            rules
        );
    }

    /**
     * Removes rules of desired binding.
     *
     * @export
     * @param {string} gridID
     * @param {string} binding Column binding
     */
    export function RemoveConditionalFormat(
        gridID: string,
        binding: string
    ): void {
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.ConditionalFormat.RemoveConditionalFormat()'`
        );
        return OutSystems.GridAPI.ConditionalFormat.RemoveConditionalFormat(
            gridID,
            binding
        );
    }
}
