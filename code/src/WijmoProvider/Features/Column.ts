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
            const columns = this._grid.getColumns();

            const columnsOrder: OSFramework.OSStructure.IColumnOrder[] =
                columns.map((col: OSFramework.Column.IColumn) => {
                    return {
                        binding: col.config.binding,
                        position: col.provider.index,
                        widgetId: col.widgetId
                    };
                });

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
