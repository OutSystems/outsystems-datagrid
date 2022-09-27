namespace OutSystems.GridAPI.Selection {
    export function GetAllSelections(gridID: string): string {
        Performance.SetMark('Selection.GetAllSelections');

        if (!OSFramework.DataGrid.Helper.IsGridReady(gridID)) return '[]';
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

        if (!OSFramework.DataGrid.Helper.IsGridReady(gridID)) return '[]';
        const grid = GridManager.GetGridById(gridID);

        Performance.SetMark('Selection.GetAllSelectionsData-end');
        Performance.GetMeasure(
            '@datagrid-Selection.GetAllSelectionsData',
            'Selection.GetAllSelectionsData',
            'Selection.GetAllSelectionsData-end'
        );
        return JSON.stringify(grid.features.selection.getAllSelectionsData());
    }

    export function GetCheckedRowsData(gridID: string): string {
        Performance.SetMark('Selection.GetCheckedRowsData');

        if (!OSFramework.DataGrid.Helper.IsGridReady(gridID)) return '[]';
        const grid = GridManager.GetGridById(gridID);

        Performance.SetMark('Selection.GetCheckedRowsData-end');
        Performance.GetMeasure(
            '@datagrid-Selection.GetCheckedRowsData',
            'Selection.GetCheckedRowsData',
            'Selection.GetCheckedRowsData-end'
        );
        return JSON.stringify(grid.features.selection.getCheckedRowsData());
    }

    export function GetSelectedRowsCount(gridID: string): string {
        Performance.SetMark('Selection.GetSelectedRowsCount');

        if (!OSFramework.DataGrid.Helper.IsGridReady(gridID)) return '[]';
        const grid = GridManager.GetGridById(gridID);

        Performance.SetMark('Selection.GetSelectedRowsCount-end');
        Performance.GetMeasure(
            '@datagrid-Selection.GetSelectedRowsCount',
            'Selection.GetSelectedRowsCount',
            'Selection.GetSelectedRowsCount-end'
        );
        return JSON.stringify(grid.features.selection.getSelectedRowsCount());
    }

    export function GetSelectedRowsData(gridID: string): string {
        Performance.SetMark('Selection.GetSelectedRowsData');

        if (!OSFramework.DataGrid.Helper.IsGridReady(gridID)) return '[]';
        const grid = GridManager.GetGridById(gridID);

        Performance.SetMark('Selection.GetSelectedRowsData-end');
        Performance.GetMeasure(
            '@datagrid-Selection.GetSelectedRowsData',
            'Selection.GetSelectedRowsData',
            'Selection.GetSelectedRowsData-end'
        );
        return JSON.stringify(grid.features.selection.getSelectedRowsData());
    }

    export function GetSelectionSum(gridID: string): string {
        Performance.SetMark('Selection.GetSelectionSum');

        if (!OSFramework.DataGrid.Helper.IsGridReady(gridID)) return '[]';
        const grid = GridManager.GetGridById(gridID);

        Performance.SetMark('Selection.GetSelectionSum-end');
        Performance.GetMeasure(
            '@datagrid-Selection.GetSelectionSum',
            'Selection.GetSelectionSum',
            'Selection.GetSelectionSum-end'
        );
        return JSON.stringify(grid.features.selection.getSelectionSum());
    }

    export function HasSelectedRows(gridID: string): string {
        Performance.SetMark('Selection.HasSelectedRows');

        if (!OSFramework.DataGrid.Helper.IsGridReady(gridID)) return '[]';
        const grid = GridManager.GetGridById(gridID);

        Performance.SetMark('Selection.HasSelectedRows-end');
        Performance.GetMeasure(
            '@datagrid-Selection.HasSelectedRows',
            'Selection.HasSelectedRows',
            'Selection.HasSelectedRows-end'
        );
        return JSON.stringify(grid.features.selection.hasSelectedRows());
    }

    export function SetRowAsSelected(
        gridID: string,
        rowsIndex: number[],
        isSelected = true
    ): string {
        Performance.SetMark('Selection.SelectRows');

        if (!OSFramework.DataGrid.Helper.IsGridReady(gridID)) return '[]';
        const grid = GridManager.GetGridById(gridID);

        Performance.SetMark('Selection.SelectRows-end');
        Performance.GetMeasure(
            '@datagrid-Selection.SelectRows',
            'Selection.SelectRows',
            'Selection.SelectRows-end'
        );
        return JSON.stringify(
            grid.features.selection.setRowAsSelected(rowsIndex, isSelected)
        );
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.Selection {
    export function GetAllSelections(gridID: string): string {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Selection.GetAllSelections()'`
        );
        return OutSystems.GridAPI.Selection.GetAllSelections(gridID);
    }

    export function GetAllSelectionsData(gridID: string): string {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Selection.GetAllSelectionsData()'`
        );
        return OutSystems.GridAPI.Selection.GetAllSelectionsData(gridID);
    }

    export function GetCheckedRowsData(gridID: string): string {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Selection.GetCheckedRowsData()'`
        );
        return OutSystems.GridAPI.Selection.GetCheckedRowsData(gridID);
    }

    export function GetSelectedRowsCount(gridID: string): string {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Selection.GetSelectedRowsCount()'`
        );
        return OutSystems.GridAPI.Selection.GetSelectedRowsCount(gridID);
    }

    export function GetSelectedRowsData(gridID: string): string {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Selection.GetSelectedRowsData()'`
        );
        return OutSystems.GridAPI.Selection.GetSelectedRowsData(gridID);
    }

    export function HasSelectedRows(gridID: string): string {
        OSFramework.DataGrid.Helper.LogWarningMessage(
            `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Selection.HasSelectedRows()'`
        );
        return OutSystems.GridAPI.Selection.HasSelectedRows(gridID);
    }
}
