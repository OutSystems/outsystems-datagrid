// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Features {
    export class AutoRowNumber implements IBuilder, IProviderConfig<boolean> {
        private _enabled: boolean; //Indicates where the feature is activate or not
        private _grid: Grid.IGridWijmo;

        constructor(grid: Grid.IGridWijmo, enabled = true) {
            this._grid = grid;
            this._enabled = enabled;
        }

        public build(): void {
            this._grid.provider.formatItem.addHandler(
                (s: wijmo.grid.FlexGrid, e: wijmo.grid.FormatItemEventArgs) => {
                    if (
                        this._enabled &&
                        e.panel.cellType === wijmo.grid.CellType.RowHeader &&
                        e.col === 0
                    ) {
                        const firstRow = this._grid.features.pagination
                            .rowStart;
                        e.cell.textContent = (firstRow + e.row).toString();
                    }
                }
            );
        }

        public setState(value: boolean): void {
            this._enabled = value;
        }
    }
}
