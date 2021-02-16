// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.ColumnFreeze {
    /**
     * Responsable for freeze columns
     * @param gridID The grid where the action will be performed
     * @param n Number of columns to freeze, when omitted the active cell will be used, and everything to its left will be freeze
     */
    export function Freeze(gridID: string, n?: number ): void {
        if (!Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.columnFreeze.leftColumns(n);
    }

    /**
     * Verifies if Grid has or not freezed columns
     * @param gridID The grid where the action will be performed
     */
    export function IsFrozen(gridID: string): boolean {
        if (!Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        return grid.features.columnFreeze.isFrozen;
    }

    /**
     * Responsable for free-up all columns freezed
     * @param gridID The grid where the action will be performed
     */
    export function Unfreeze(gridID: string): void {
        if (!Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.columnFreeze.unfreeze();
    }
}