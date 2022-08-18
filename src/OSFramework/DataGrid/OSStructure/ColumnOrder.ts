// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.OSStructure {
    /**
     * Representation of a generic range
     * Used to express selections, defining start and end
     */
    export interface IColumnOrder {
        binding: string;
        position: number;
        widgetId?: string;
    }
}
