// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    export class DirtyMark implements IDirtyMark, IBuilder {
        private _grid: WijmoProvider.Grid.IGridWijmo;
        private readonly _internalLabel = '__dirtyMarkFeature';
        private _metadata: WijmoProvider.Grid.IRowMetadata;

        constructor(grid: WijmoProvider.Grid.IGridWijmo) {
            this._grid = grid;
            this._metadata = this._grid.rowMetadata;
        }

        private _addNewRowEndingHandler(rowIndex: number): void {
            this.getMetadata(rowIndex).isNew = true;
        }

        private _cellEditHandler(
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
                    grid.getCellData(e.row, e.col, false)
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
            const grid = this._grid.provider;
            if (this.hasMetadata(row)) {
                const binding = grid.getColumn(col).binding;
                const cellValue = grid.getCellData(row, col, false);
                const metadata = this.getMetadata(row);

                //If the cell isNew we want to have the dirty mark
                if (metadata.isNew) return true;

                if (metadata.originalValues.has(binding)) {
                    const originalValue = metadata.originalValues.get(binding);

                    //If the original value and new value are null and undefined we don't want to have dirty mark.
                    if (originalValue === undefined) {
                        return (
                            originalValue !== cellValue && cellValue !== null
                        );
                    } else {
                        //If the cellValue and the originalValue are different we want to add the dirty mark.
                        //Even when converted to String because after edition the cells from the Dropdown Columns will have the value in string format and before edition the value of those same cells can be integers (number identifiers).
                        return (
                            originalValue !== cellValue &&
                            originalValue.toString() !== cellValue
                        );
                    }
                }
            }
            return false;
        }

        private _isDirtyRow(row: number): boolean {
            if (this.hasMetadata(row)) {
                const metadata = this.getMetadata(row);
                let notDirtyCells = 0;

                for (const k of metadata.originalValues.keys()) {
                    const cellValue = this._grid.provider.getCellData(
                        row,
                        k,
                        false
                    );
                    const originalValue = metadata.originalValues.get(k);

                    //If the original value and new value are null and undefined we don't want to have dirty mark on the cell
                    if (originalValue === undefined) {
                        if (originalValue === cellValue || cellValue === null) {
                            //Add 1 to the notDirtyCells
                            notDirtyCells++;
                        } else {
                            //If the cell is dirty then the row must be dirty
                            break;
                        }
                    } else if (originalValue !== undefined) {
                        //If the cellValue and the originalValue are equal the cell is not dirty.
                        //Even when converted to String because after edition the cells from the Dropdown Columns will have the value in string format and before edition the value of those same cells can be integers (number identifiers).
                        if (
                            originalValue === cellValue ||
                            originalValue.toString() === cellValue
                        ) {
                            //Add 1 to the notDirtyCells
                            notDirtyCells++;
                        } else {
                            //If the cell is dirty then the row must be dirty
                            break;
                        }
                    }
                }

                //If the row isNew we want to have the dirty mark
                //Or, if Total changes - equals > 0 there is at least one dirty cell on the row so we also want to have a dirty mark
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
            // Responsible for saving the original values before edition of any cell.
            // Essencial for saving the value in case the content of the cell is deleted with keyboard events (del, backspace)
            this._grid.provider.beginningEdit.addHandler(
                this._cellEditHandler.bind(this)
            );
            this._grid.provider.pastingCell.addHandler(
                this._cellEditHandler.bind(this)
            );
            this._grid.addedRows.addHandler(
                this._addNewRowEndingHandler.bind(this)
            );
            this._grid.provider.formatItem.addHandler(
                this._formatItems.bind(this)
            );
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

        /**
         * Gets the old value by looking for the rowNumber and binding to return the original value of the cell.
         * @param rowNumber Number of the row to search for the original value of the cell it belongs to.
         * @param binding Binding of the column to complement the search.
         * @returns Value of the cell before its edition.
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public getOldValue(rowNumber: number, binding: string): any {
            if (this.hasMetadata(rowNumber)) {
                return this._metadata
                    .getMetadata(rowNumber, this._internalLabel)
                    .originalValues.get(binding);
            }
            // If there is no metadata we want to return undefined
            return undefined;
        }

        public hasMetadata(row: number): boolean {
            return this._metadata.hasOwnProperty(row, this._internalLabel);
        }
    }
}
