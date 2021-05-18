// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Helper {
    export function IsGridReady(gridID: string): boolean {
        try {
            const grid = GridAPI.GridManager.GetGridById(gridID);
            return grid.isReady;
        } catch (error) {
            return false;
        }
    }
}
