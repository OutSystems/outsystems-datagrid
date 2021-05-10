// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    export class CellStyle
        implements
            OSFramework.Interface.IBuilder,
            OSFramework.Feature.ICellStyle {
        private _grid: WijmoProvider.Grid.IGridWijmo;
        private readonly _internalLabel = '__cellStyle';
        private _metadata: OSFramework.Interface.IRowMetadata;

        constructor(grid: WijmoProvider.Grid.IGridWijmo) {
            this._grid = grid;
            this._metadata = this._grid.rowMetadata;
        }

        private _formatItems(
            grid: wijmo.grid.FlexGrid,
            e: wijmo.grid.FormatItemEventArgs
        ) {
            if (
                e.panel.cellType === wijmo.grid.CellType.Cell &&
                this.getMetadata(e.row).cssClass.size > 0 &&
                this.getMetadata(e.row).cssClass.get(
                    this._grid.provider.getColumn(e.col).binding
                )
            ) {
                wijmo.addClass(
                    e.cell,
                    this.getMetadata(e.row).cssClass.get(
                        this._grid.provider.getColumn(e.col).binding
                    )
                );
            }
        }

        public addClass(
            binding: string,
            rowNumber: number,
            className: string
        ): void {
            this.getMetadata(rowNumber).addClass(binding, className);
        }
        public build(): void {
            this._grid.provider.formatItem.addHandler(
                this._formatItems.bind(this)
            );
        }

        public clear(): void {
            this._metadata.clearProperty(this._internalLabel);
            this._grid.provider.invalidate(); //Mark to be refreshed
        }

        public getMetadata(
            row: number
        ): OSFramework.Feature.Auxiliar.CellStyleInfo {
            if (!this.hasMetadata(row))
                this._metadata.setMetadata(
                    row,
                    this._internalLabel,
                    new OSFramework.Feature.Auxiliar.CellStyleInfo()
                );

            return this._metadata.getMetadata(
                row,
                this._internalLabel
            ) as OSFramework.Feature.Auxiliar.CellStyleInfo;
        }

        public hasMetadata(row: number): boolean {
            return this._metadata.hasOwnProperty(row, this._internalLabel);
        }

        public removeClass(rowNumber: number, binding: string): void {
            this.getMetadata(rowNumber).removeClass(binding);
        }
    }
}
