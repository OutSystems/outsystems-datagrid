// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.Selection {
    export function GetAllSelections(gridID: string): string {
        PerformanceAPI.SetMark('Selection.GetAllSelections');

        if (!OSFramework.Helper.IsGridReady(gridID)) return '[]';
        const grid = GridManager.GetGridById(gridID);

        PerformanceAPI.SetMark('Selection.GetAllSelections-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Selection.GetAllSelections',
            'Selection.GetAllSelections',
            'Selection.GetAllSelections-end'
        );
        return JSON.stringify(grid.features.selection.getAllSelections());
    }

    export function GetAllSelectionsData(gridID: string): string {
        PerformanceAPI.SetMark('Selection.GetAllSelectionsData');

        if (!OSFramework.Helper.IsGridReady(gridID)) return '[]';
        const grid = GridManager.GetGridById(gridID);

        PerformanceAPI.SetMark('Selection.GetAllSelectionsData-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Selection.GetAllSelectionsData',
            'Selection.GetAllSelectionsData',
            'Selection.GetAllSelectionsData-end'
        );
        return JSON.stringify(grid.features.selection.getAllSelectionsData());
    }

    export function GetCheckedRowsData(gridID: string): string {
        PerformanceAPI.SetMark('Selection.GetCheckedRowsData');

        if (!OSFramework.Helper.IsGridReady(gridID)) return '[]';
        const grid = GridManager.GetGridById(gridID);

        PerformanceAPI.SetMark('Selection.GetCheckedRowsData-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Selection.GetCheckedRowsData',
            'Selection.GetCheckedRowsData',
            'Selection.GetCheckedRowsData-end'
        );
        return JSON.stringify(grid.features.selection.getCheckedRowsData());
    }

    export function GetSelectedRowsCount(gridID: string): string {
        PerformanceAPI.SetMark('Selection.GetSelectedRowsCount');

        if (!OSFramework.Helper.IsGridReady(gridID)) return '[]';
        const grid = GridManager.GetGridById(gridID);

        PerformanceAPI.SetMark('Selection.GetSelectedRowsCount-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Selection.GetSelectedRowsCount',
            'Selection.GetSelectedRowsCount',
            'Selection.GetSelectedRowsCount-end'
        );
        return JSON.stringify(grid.features.selection.getSelectedRowsCount());
    }

    export function GetSelectedRowsData(gridID: string): string {
        PerformanceAPI.SetMark('Selection.GetSelectedRowsData');

        if (!OSFramework.Helper.IsGridReady(gridID)) return '[]';
        const grid = GridManager.GetGridById(gridID);

        PerformanceAPI.SetMark('Selection.GetSelectedRowsData-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Selection.GetSelectedRowsData',
            'Selection.GetSelectedRowsData',
            'Selection.GetSelectedRowsData-end'
        );
        return JSON.stringify(grid.features.selection.getSelectedRowsData());
    }

    export function HasSelectedRows(gridID: string): string {
        PerformanceAPI.SetMark('Selection.HasSelectedRows');

        if (!OSFramework.Helper.IsGridReady(gridID)) return '[]';
        const grid = GridManager.GetGridById(gridID);

        PerformanceAPI.SetMark('Selection.HasSelectedRows-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Selection.HasSelectedRows',
            'Selection.HasSelectedRows',
            'Selection.HasSelectedRows-end'
        );
        return JSON.stringify(grid.features.selection.hasSelectedRows());
    }
}
