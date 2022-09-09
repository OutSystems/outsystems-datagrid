// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
    export class Mask
        implements
            OSFramework.DataGrid.Feature.IMask,
            OSFramework.DataGrid.Interface.IBuilder
    {
        private _grid: Grid.IGridWijmo;

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
        }

        private _cellEditEnded(
            grid: wijmo.grid.FlexGrid,
            e: wijmo.grid.FormatItemEventArgs
        ) {
            let mask = e.getColumn().mask;
            let value = grid.getCellData(e.row, e.col, false);
            if (
                e.panel.cellType === wijmo.grid.CellType.Cell &&
                mask !== null &&
                mask !== '' &&
                typeof(value) === "string"
            ) {
                grid.setCellData(e.row, e.col, value.replace(/\D+/g, ''), false); // store the value just with digits
            }
        }

        private _formatItems(
            grid: wijmo.grid.FlexGrid,
            e: wijmo.grid.FormatItemEventArgs
        ) {
            let mask = e.getColumn().mask;
            if (
                e.panel.cellType === wijmo.grid.CellType.Cell &&
                mask !== null &&
                mask !== '' &&
                e.cell.innerHTML !== '' &&
                !e.cell.innerHTML.includes('input')
            ) {
                let value = e.cell.innerHTML.replace(/\D+/g, ''); // remove everything that is not a digit
                e.cell.innerHTML = '';
                for (
                    let mask_it = 0, value_it = 0;
                    mask_it < mask.length && value_it < value.length;
                    mask_it++
                ) {
                    e.cell.innerHTML +=
                        mask.charAt(mask_it) == '0'
                            ? value.charAt(value_it++)
                            : mask.charAt(mask_it); // not ideal
                }
            }
        }

        public build(): void {
            this._grid.provider.formatItem.addHandler(
                this._formatItems.bind(this)
            );

            this._grid.provider.cellEditEnded.addHandler(
                this._cellEditEnded.bind(this)
            );
        }
    }
}
