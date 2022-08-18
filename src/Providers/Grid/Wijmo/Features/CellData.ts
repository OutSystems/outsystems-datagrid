// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    export class CellData implements OSFramework.Feature.ICellData {
        private _data: OSFramework.Grid.AbstractDataSource;
        private _grid: WijmoProvider.Grid.IGridWijmo;

        constructor(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            grid: WijmoProvider.Grid.IGridWijmo,
            data: OSFramework.Grid.AbstractDataSource
        ) {
            this._grid = grid;
            this._data = data;
        }

        public build(): void {
            //
        }

        public setCellData(
            rowNumber: number,
            column: OSFramework.Column.IColumn,
            value: string
        ): void {
            if (column.columnType === OSFramework.Enum.ColumnType.DateTime) {
                value = this._grid.dataSource.trimSecondsFromDate(value);
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
