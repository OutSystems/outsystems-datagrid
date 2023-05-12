namespace OutSystems.GridAPI.ConditionalFormat {
    /**
     * Adds new conditional format rules to the desired binding.
     *
     * @export
     * @param {string} gridID
     * @param {string} binding Column binding
     * @param {Array<OSFramework.DataGrid.OSStructure.ConditionalFormat>} rules Rules for conditional formatting.
     */
    export function AddConditionalFormat(
        gridID: string,
        binding: string,
        rules: Array<OSFramework.DataGrid.OSStructure.ConditionalFormat>
    ): void {
        GridManager.Events.Subscribe(
            gridID,
            OSFramework.DataGrid.Event.Grid.GridEventType.Initialized,
            (_gridId: string, gridObj: OSFramework.DataGrid.Grid.IGrid) => {
                Performance.SetMark('ConditionalFormat.AddConditionalFormat');
                gridObj.features.conditionalFormat.addRules(binding, rules);

                Performance.SetMark(
                    'ConditionalFormat.AddConditionalFormat-end'
                );
                Performance.GetMeasure(
                    '@datagrid-ConditionalFormat.AddConditionalFormat',
                    'ConditionalFormat.AddConditionalFormat',
                    'ConditionalFormat.AddConditionalFormat-end'
                );
            }
        );
    }

    /**
     * Adds new conditional format rules to the desired aggregate binding.
     *
     * @export
     * @param {string} gridID
     * @param {string} binding Column binding
     * @param {string} rules Rules for conditional formatting.
     */
    export function SetNumberAggregateConditionalFormatting(
        gridID: string,
        columnID: string,
        conditionalFormat: string
    ): string {
        Performance.SetMark(
            'ColumnManager.SetNumberAggregateConditionalFormatting'
        );
        const result = Auxiliary.CreateApiResponse({
            gridID,
            errorCode:
                OSFramework.DataGrid.Enum.ErrorCodes
                    .API_FailedSetNumberAggregateConditionalFormatting,
            callback: () => {
                const grid = GridManager.GetGridById(gridID);

                grid.features.columnAggregate.setConditionalFormat(
                    columnID,
                    conditionalFormat
                );
            }
        });

        Performance.SetMark(
            'ColumnManager.SetNumberAggregateConditionalFormatting-end'
        );
        Performance.GetMeasure(
            '@datagrid-ColumnManager.SetNumberAggregateConditionalFormatting',
            'ColumnManager.SetNumberAggregateConditionalFormatting',
            'ColumnManager.SetNumberAggregateConditionalFormatting-end'
        );

        return result;
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
            OSFramework.DataGrid.Event.Grid.GridEventType.Initialized,
            (_gridId: string, gridObj: OSFramework.DataGrid.Grid.IGrid) => {
                Performance.SetMark(
                    'ConditionalFormat.RemoveConditionalFormat'
                );
                gridObj.features.conditionalFormat.removeRules(binding);

                Performance.SetMark(
                    'ConditionalFormat.RemoveConditionalFormat-end'
                );
                Performance.GetMeasure(
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
     * @param {Array<OSFramework.DataGrid.OSStructure.ConditionalFormat>} rules Rules for conditional formatting.
     */
    export function AddConditionalFormat(
        gridID: string,
        binding: string,
        rules: Array<OSFramework.DataGrid.OSStructure.ConditionalFormat>
    ): void {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.ConditionalFormat.AddConditionalFormat()'`
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
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.ConditionalFormat.RemoveConditionalFormat()'`
        );
        return OutSystems.GridAPI.ConditionalFormat.RemoveConditionalFormat(
            gridID,
            binding
        );
    }
}
