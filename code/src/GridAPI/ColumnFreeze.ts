// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.ColumnFreeze {
    /**
     * Responsable for freeze columns
     * @param gridID The grid where the action will be performed
     * @param n Number of columns to freeze, when omitted the active cell will be used, and everything to its left will be freeze
     */
    export function Freeze(gridID: string, n?: number): string {
        PerformanceAPI.SetMark('ColumnFreeze.freeze');

        const responseObj = {
            isSuccess: true,
            message: OSFramework.Enum.ErrorMessages.SuccessMessage,
            code: OSFramework.Enum.ErrorCodes.GRID_SUCCESS
        };

        if (!OSFramework.Helper.IsGridReady(gridID)) {
            responseObj.isSuccess = false;
            responseObj.message = OSFramework.Enum.ErrorMessages.Grid_NotFound;
            responseObj.code = OSFramework.Enum.ErrorCodes.CFG_GridNotFound;
            return JSON.stringify(responseObj);
        }

        try {
            const grid = GridManager.GetGridById(gridID);
            grid.features.columnFreeze.leftColumns(n);
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedFreezeColumns;
        }

        PerformanceAPI.SetMark('ColumnFreeze.freeze-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-ColumnFreeze.freeze',
            'ColumnFreeze.freeze',
            'ColumnFreeze.freeze-end'
        );

        return JSON.stringify(responseObj);
    }

    /**
     * Verifies if Grid has or not freezed columns
     * @param gridID The grid where the action will be performed
     */
    export function IsFrozen(gridID: string): string {
        PerformanceAPI.SetMark('ColumnFreeze.isFrozen');

        const responseObj = {
            isSuccess: true,
            message: OSFramework.Enum.ErrorMessages.SuccessMessage,
            code: OSFramework.Enum.ErrorCodes.GRID_SUCCESS,
            value: false
        };

        if (!OSFramework.Helper.IsGridReady(gridID)) {
            responseObj.isSuccess = false;
            responseObj.message = OSFramework.Enum.ErrorMessages.Grid_NotFound;
            responseObj.code = OSFramework.Enum.ErrorCodes.CFG_GridNotFound;
            return JSON.stringify(responseObj);
        }

        try {
            if (!OSFramework.Helper.IsGridReady(gridID)) return;
            const grid = GridManager.GetGridById(gridID);
            responseObj.value = grid.features.columnFreeze.isFrozen;
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedHasFrozenColumns;
        }

        PerformanceAPI.SetMark('ColumnFreeze.isFrozen-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-ColumnFreeze.isFrozen',
            'ColumnFreeze.isFrozen',
            'ColumnFreeze.isFrozen-end'
        );
        return JSON.stringify(responseObj);
    }

    /**
     * Responsable for free-up all columns freezed
     * @param gridID The grid where the action will be performed
     */
    export function Unfreeze(gridID: string): string {
        PerformanceAPI.SetMark('ColumnFreeze.unfreeze');

        const responseObj = {
            isSuccess: true,
            message: OSFramework.Enum.ErrorMessages.SuccessMessage,
            code: OSFramework.Enum.ErrorCodes.GRID_SUCCESS
        };

        if (!OSFramework.Helper.IsGridReady(gridID)) {
            responseObj.isSuccess = false;
            responseObj.message = OSFramework.Enum.ErrorMessages.Grid_NotFound;
            responseObj.code = OSFramework.Enum.ErrorCodes.CFG_GridNotFound;
            return JSON.stringify(responseObj);
        }
        try {
            const grid = GridManager.GetGridById(gridID);
            grid.features.columnFreeze.unfreeze();
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.Enum.ErrorCodes.API_FailedUnfreezeColumns;
        }

        PerformanceAPI.SetMark('ColumnFreeze.unfreeze-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-ColumnFreeze.unfreeze',
            'ColumnFreeze.unfreeze',
            'ColumnFreeze.unfreeze-end'
        );

        return JSON.stringify(responseObj);
    }
}
