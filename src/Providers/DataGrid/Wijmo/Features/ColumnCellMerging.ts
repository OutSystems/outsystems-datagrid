// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    // export class Builder extends Validation implements OSFramework.DataGrid.Interface.IBuilder {
    export class ColumnCellMerging
        implements
            OSFramework.DataGrid.Feature.IColumnCellMerging,
            OSFramework.DataGrid.Interface.IBuilder
    {
        private _grid: Grid.IGridWijmo;

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
        }

        public build(): void {
            //
        }

        /**
         * Update allowMerging's column config
         *
         * @param {string} columnID
         * @param {boolean} allowMerge
         * @memberof ColumnCellMerging
         */
        public mergeColumnCells(columnID: string, allowMerge: boolean): void {
            const column = this._grid.getColumn(columnID);
            if (column) {
                column.provider.allowMerging = allowMerge;
            } else {
                throw new Error(
                    OSFramework.DataGrid.Enum.ErrorMessages.Column_NotFound
                );
            }
        }
    }
}
