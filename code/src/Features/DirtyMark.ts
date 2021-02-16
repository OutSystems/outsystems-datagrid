// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Features {
    export interface IDirtyMark {
        clear(): void;
        // clearByRow(row: number): void;
    }

    class DirtyMarksInfo {
        public isDirtyRow: boolean;
        public isNew: boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public originalValues: Map<string, any>;

        constructor() {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.originalValues = new Map<string, any>();
        }
    }

    export class DirtyMark implements IDirtyMark, IBuilder {
        private _grid: Grid.IGridWijmo;
        private readonly _internalLabel = '__dirtyMarkFeature';
        private _metadata: Grid.IRowMetadata;

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
            this._metadata = this._grid.rowMetadata;
        }

        private _addNewRowEndingHandler(rowIndex: number): void {
            this.getMetadata(rowIndex).isNew = true;
        }
        private _cellEditEndingHandler(
            grid: wijmo.grid.FlexGrid,
            e: wijmo.grid.CellRangeEventArgs
        ): void {
            const binding = grid.getColumn(e.col).binding;

            if (
                !this._isNewRow(e.row) &&
                !this._hasCellInitialValue(e.row, binding)
            ) {
                this.getMetadata(e.row).originalValues.set(
                    binding,
                    grid.getCellData(e.row, e.col, true)
                );
            }
        }

        private _formatItems(
            grid: wijmo.grid.FlexGrid,
            e: wijmo.grid.FormatItemEventArgs
        ) {
            if (
                e.panel.cellType === wijmo.grid.CellType.Cell &&
                this._isDirtyCell(e.row, e.col)
            ) {
                wijmo.addClass(e.cell, 'dirty-mark');
            } else if (
                e.panel.cellType === wijmo.grid.CellType.RowHeader &&
                this._isDirtyRow(e.row)
            ) {
                wijmo.addClass(e.cell, 'dirty-mark');
            }
        }

        private _hasCellInitialValue(row: number, binding: string): boolean {
            return (
                this.hasMetadata(row) &&
                this.getMetadata(row).originalValues.has(binding)
            );
        }

        private _isDirtyCell(row: number, col: number): boolean {
            const s = this._grid.provider;

            if (this.hasMetadata(row)) {
                const binding = s.getColumn(col).binding;
                const currValue = s.getCellData(row, col, true);
                const metadata = this.getMetadata(row);

                return (
                    metadata.isNew ||
                    (metadata.originalValues.has(binding) &&
                        metadata.originalValues.get(binding) !== currValue)
                );
            }

            return false;
        }

        private _isDirtyRow(row: number): boolean {
            if (this.hasMetadata(row)) {
                const metadata = this.getMetadata(row);
                let notDirtyCells = 0;

                //Couldn't trigger the editEnded on UndoStack, so we need to validate all the row's columns to verify if something have changed
                for (const k of metadata.originalValues.keys()) {
                    //If original equals to cellValue
                    if (
                        this._grid.provider.getCellData(row, k, true) ===
                        metadata.originalValues.get(k)
                    )
                        //Add 1 to the the equals
                        notDirtyCells++;
                    //One not equal is false and the mark should be shown
                    else break;
                }

                //If Total changes - equals > 0 there is some dirty register on the row
                return (
                    metadata.isNew ||
                    metadata.originalValues.size - notDirtyCells > 0
                );
            }

            return false;
        }

        private _isNewRow(row: number): boolean {
            return this.hasMetadata(row) && this.getMetadata(row).isNew;
        }

        public build(): void {
            this._grid.provider.cellEditEnding.addHandler(
                this._cellEditEndingHandler.bind(this)
            );
            this._grid.provider.pastingCell.addHandler(
                this._cellEditEndingHandler.bind(this)
            );
            this._grid.addedRows.addHandler(
                this._addNewRowEndingHandler.bind(this)
            );
            this._grid.provider.formatItem.addHandler(this._formatItems.bind(this));
        }

        public clear(): void {
            this._metadata.clearProperty(this._internalLabel);
            this._grid.provider.invalidate(); //Mark to be refreshed
        }

        // public clearByRow(row: number): void {
        //     this._metadata.clearPropertyByRow(row, this._internalLabel);
        //     this._grid.grid.invalidate(); //Mark to be refreshed
        // }

        public getMetadata(row: number): DirtyMarksInfo {
            if (!this.hasMetadata(row))
                this._metadata.setMetadata(
                    row,
                    this._internalLabel,
                    new DirtyMarksInfo()
                );

            return this._metadata.getMetadata(
                row,
                this._internalLabel
            ) as DirtyMarksInfo;
        }

        public hasMetadata(row: number): boolean {
            return this._metadata.hasOwnProperty(row, this._internalLabel);
        }
    }
}
