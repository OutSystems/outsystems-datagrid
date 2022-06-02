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
