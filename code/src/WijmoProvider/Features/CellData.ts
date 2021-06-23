// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    export class CellData implements OSFramework.Feature.ICellData {
        private _grid: WijmoProvider.Grid.IGridWijmo;

        constructor(grid: WijmoProvider.Grid.IGridWijmo) {
            this._grid = grid;
        }

        public build(): void {
            //
        }

        public setCellData(
            rowNumber: number,
            columnID: string,
            value: string
        ): void {
            const column = GridAPI.ColumnManager.GetColumnById(columnID);

            if (column.columnType === OSFramework.Enum.ColumnType.DateTime) {
                // value
            }

            this._grid.provider.setCellData(
                rowNumber,
                column.provider.index,
                value,
                true
            );
        }
    }
}
