// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.Selection {
    export function GetAllSelections(gridID: string): string {
        Performance.SetMark('Selection.GetAllSelections');

        if (!OSFramework.Helper.IsGridReady(gridID)) return '[]';
        const grid = GridManager.GetGridById(gridID);

        Performance.SetMark('Selection.GetAllSelections-end');
        Performance.GetMeasure(
            '@datagrid-Selection.GetAllSelections',
            'Selection.GetAllSelections',
            'Selection.GetAllSelections-end'
        );
        return JSON.stringify(grid.features.selection.getAllSelections());
    }

    export function GetAllSelectionsData(gridID: string): string {
        Performance.SetMark('Selection.GetAllSelectionsData');

        if (!OSFramework.Helper.IsGridReady(gridID)) return '[]';
        const grid = GridManager.GetGridById(gridID);

        Performance.SetMark('Selection.GetAllSelectionsData-end');
        Performance.GetMeasure(
            '@datagrid-Selection.GetAllSelectionsData',
            'Selection.GetAllSelectionsData',
            'Selection.GetAllSelectionsData-end'
        );
        return JSON.stringify(
            grid.features.selection
                .getAllSelectionsData()
                .map((p) => p.serialize())
        );
    }

    export function GetSelectedRowsCount(gridID: string): number {
        Performance.SetMark('Selection.GetSelectedRowsCount');

        if (!OSFramework.Helper.IsGridReady(gridID)) return 0;
        const grid = GridManager.GetGridById(gridID);

        Performance.SetMark('Selection.GetSelectedRowsCount-end');
        Performance.GetMeasure(
            '@datagrid-Selection.GetSelectedRowsCount',
            'Selection.GetSelectedRowsCount',
            'Selection.GetSelectedRowsCount-end'
        );
        return grid.features.selection.getSelectedRowsCount();
    }

    export function GetSelectedRowsData(gridID: string): string {
        Performance.SetMark('Selection.GetSelectedRowsData');

        if (!OSFramework.Helper.IsGridReady(gridID)) return '[]';
        const grid = GridManager.GetGridById(gridID);

        Performance.SetMark('Selection.GetSelectedRowsData-end');
        Performance.GetMeasure(
            '@datagrid-Selection.GetSelectedRowsData',
            'Selection.GetSelectedRowsData',
            'Selection.GetSelectedRowsData-end'
        );
        return JSON.stringify(
            grid.features.selection
                .getSelectedRowsData()
                .map((p) => p.serialize())
        );
    }

    export function HasSelectedRows(gridID: string): boolean {
        Performance.SetMark('Selection.HasSelectedRows');

        if (!OSFramework.Helper.IsGridReady(gridID)) return false;
        const grid = GridManager.GetGridById(gridID);

        Performance.SetMark('Selection.HasSelectedRows-end');
        Performance.GetMeasure(
            '@datagrid-Selection.HasSelectedRows',
            'Selection.HasSelectedRows',
            'Selection.HasSelectedRows-end'
        );
        return grid.features.selection.hasSelectedRows();
    }
}
