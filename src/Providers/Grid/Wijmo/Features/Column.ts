// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    // export class Builder extends Validation implements OSFramework.Interface.IBuilder {
    export class Column
        implements OSFramework.Feature.IColumn, OSFramework.Interface.IBuilder
    {
        private _grid: Grid.IGridWijmo;

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
        }

        public build(): void {
            //
        }

        public getColumnsOrder(): OSFramework.OSStructure.IColumnOrder[] {
            const gridColumns = this._grid.getColumns();
            let columnsOrder: OSFramework.OSStructure.IColumnOrder[];
            if (gridColumns.length > 0) {
                columnsOrder = gridColumns.map((col) => {
                    return {
                        binding: col.config.binding,
                        position: col.provider.index,
                        widgetId: col.widgetId
                    };
                });
            } else {
                columnsOrder = this._grid.provider.columns.map((col) => {
                    return {
                        binding: col.binding,
                        position: col.index
                    };
                });
            }
            return columnsOrder;
        }

        public setColumnHeader(columnBinding: string, header: string): void {
            const column = this._grid.getColumn(columnBinding);

            if (column) {
                column.provider.header = header;
            } else {
                throw new Error(OSFramework.Enum.ErrorMessages.Column_NotFound);
            }
        }
    }
}
