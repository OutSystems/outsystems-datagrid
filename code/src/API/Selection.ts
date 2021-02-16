// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.Selection {
    export function GetAllSelections(gridID: string): string {
        if (!Helper.IsGridReady(gridID)) return '[]';
        const grid = GridManager.GetGridById(gridID);

        return JSON.stringify(grid.features.selection.getAllSelections());
    }

    export function GetAllSelectionsData(gridID: string): string {
        if (!Helper.IsGridReady(gridID)) return '[]';
        const grid = GridManager.GetGridById(gridID);

        return JSON.stringify(
            grid.features.selection
                .getAllSelectionsData()
                .map((p) => p.serialize())
        );
    }

    export function GetSelectedRowsCount(gridID: string): number {
        if (!Helper.IsGridReady(gridID)) return 0;
        const grid = GridManager.GetGridById(gridID);

        return grid.features.selection.getSelectedRowsCount();
    }

    export function GetSelectedRowsData(gridID: string): string {
        if (!Helper.IsGridReady(gridID)) return '[]';
        const grid = GridManager.GetGridById(gridID);

        return JSON.stringify(
            grid.features.selection
                .getSelectedRowsData()
                .map((p) => p.serialize())
        );
    }

    export function HasSelectedRows(gridID: string): boolean {
        if (!Helper.IsGridReady(gridID)) return false;
        const grid = GridManager.GetGridById(gridID);

        return grid.features.selection.hasSelectedRows();
    }
}
