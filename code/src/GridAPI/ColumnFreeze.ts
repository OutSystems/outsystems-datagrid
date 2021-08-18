// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.ColumnFreeze {
    /**
     * Responsable for freeze columns
     * @param gridID The grid where the action will be performed
     * @param n Number of columns to freeze, when omitted the active cell will be used, and everything to its left will be freeze
     */
    export function Freeze(gridID: string, n?: number): void {
        PerformanceAPI.SetMark('ColumnFreeze.freeze');

        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.columnFreeze.leftColumns(n);
        PerformanceAPI.SetMark('ColumnFreeze.freeze-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-ColumnFreeze.freeze',
            'ColumnFreeze.freeze',
            'ColumnFreeze.freeze-end'
        );
    }

    /**
     * Verifies if Grid has or not freezed columns
     * @param gridID The grid where the action will be performed
     */
    export function IsFrozen(gridID: string): boolean {
        PerformanceAPI.SetMark('ColumnFreeze.isFrozen');

        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        PerformanceAPI.SetMark('ColumnFreeze.isFrozen-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-ColumnFreeze.isFrozen',
            'ColumnFreeze.isFrozen',
            'ColumnFreeze.isFrozen-end'
        );
        return grid.features.columnFreeze.isFrozen;
    }

    /**
     * Responsable for free-up all columns freezed
     * @param gridID The grid where the action will be performed
     */
    export function Unfreeze(gridID: string): void {
        PerformanceAPI.SetMark('ColumnFreeze.unfreeze');

        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.columnFreeze.unfreeze();
        PerformanceAPI.SetMark('ColumnFreeze.unfreeze-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-ColumnFreeze.unfreeze',
            'ColumnFreeze.unfreeze',
            'ColumnFreeze.unfreeze-end'
        );
    }
}
