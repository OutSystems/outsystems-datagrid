// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
    export class DirtyMark
        implements
            OSFramework.DataGrid.Feature.IDirtyMark,
            OSFramework.DataGrid.Interface.IBuilder
    {
        private _grid: Grid.IGridWijmo;
        private readonly _internalLabel =
            OSFramework.DataGrid.Enum.RowMetadata.DirtyMark;
        private _metadata: OSFramework.DataGrid.Interface.IRowMetadata;

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
            this._metadata = this._grid.rowMetadata;
        }

        private _addNewRowEndingHandler(rowIndex: number): void {
            this.getMetadata(rowIndex).isNew = true;
        }

        private _cellEditHandler(
            _grid: wijmo.grid.FlexGrid,
            e: wijmo.grid.CellRangeEventArgs
        ): void {
            this.saveOriginalValue(e.row, e.col);
        }

        private _formatItems(
            _grid: wijmo.grid.FlexGrid,
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

                    return this._isOriginalValue(originalValue, cellValue);
                }
            }
            return false;
        }

        private _isDirtyRow(row: number): boolean {
            if (this.hasMetadata(row)) {
                const metadata = this.getMetadata(row);

                if (metadata.isNew) return true;
                const keyArray = Array.from(metadata.originalValues.keys());

                const hasDirtyMarkCell = keyArray.some((k) => {
                    const originalValue = metadata.originalValues.get(k);
                    const cellValue = this._grid.provider.getCellData(
                        row,
                        k,
                        false
                    );

                    return this._isOriginalValue(originalValue, cellValue);
                });
                return hasDirtyMarkCell;
            }

            return false;
        }

        private _isNewRow(row: number): boolean {
            return this.hasMetadata(row) && this.getMetadata(row).isNew;
        }

        public get isGridDirty(): boolean {
            return this._grid.provider.itemsSource.sourceCollection.some(
                (_row, index) => this._isDirtyRow(index)
            );
        }

        // check if values are equal.
        // since undefined is not equal to null or an empty string, we explicity say we want them to be considered equal
        private _isOriginalValue(
            originalValue: string | number,
            cellValue: string | number
        ): boolean {
            return !_.isEqualWith(originalValue, cellValue, () => {
                if (
                    (originalValue === undefined &&
                        (cellValue === undefined ||
                            cellValue === null ||
                            cellValue === '')) ||
                    originalValue?.toString() === cellValue?.toString()
                ) {
                    return true;
                }
            });
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
        /**
         * Clears dirty marks in the given rows with the given keys list
         *
         * @param {Array<string>} rowKeys List of row identifiers on the KeyBinding field.
         * @memberof DirtyMark
         */
        public clearByRowKeys(rowKeys: Array<string>): void {
            rowKeys.forEach((element) => {
                if (element !== '') {
                    this._metadata.clearPropertyByRowKey(
                        element,
                        this._internalLabel
                    );
                }
            });
            this._grid.provider.invalidate(); //Mark to be refreshed
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public clearPropertyInRow(row: any): void {
            this._metadata.clearPropertyByRow(row, this._internalLabel);
            this._grid.provider.invalidate(); //Mark to be refreshed
        }
        /**
         * Responsible for cleaning metadata information for a given row key and property
         *
         * @param {string} key Key row reference
         * @memberof DirtyMark
         */
        public clearPropertyInRowByKey(key: string): void {
            this._metadata.clearPropertyByRowKey(key, this._internalLabel);
            this._grid.provider.invalidate(); //Mark to be refreshed
        }

        public getMetadata(
            row: number
        ): OSFramework.DataGrid.Feature.Auxiliar.DirtyMarksInfo {
            if (!this.hasMetadata(row))
                this._metadata.setMetadataByRowNumber(
                    row,
                    this._internalLabel,
                    new OSFramework.DataGrid.Feature.Auxiliar.DirtyMarksInfo()
                );

            return this._metadata.getMetadataByRowNumber(
                row,
                this._internalLabel
            ) as OSFramework.DataGrid.Feature.Auxiliar.DirtyMarksInfo;
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
                    .getMetadataByRowNumber(rowNumber, this._internalLabel)
                    .originalValues.get(binding);
            }
            // If there is no metadata we want to return undefined
            return undefined;
        }

        public hasMetadata(rowNumber: number): boolean {
            return this._metadata.hasOwnPropertyByRowNumber(
                rowNumber,
                this._internalLabel
            );
        }

        public isRowDirty(row: number): boolean {
            return this._isDirtyRow(row);
        }

        public saveOriginalValue(
            rowNumber: number,
            columnNumber: number
        ): void {
            const binding = this._grid.provider.getColumn(columnNumber).binding;

            if (
                !this._isNewRow(rowNumber) &&
                !this._hasCellInitialValue(rowNumber, binding)
            ) {
                this.getMetadata(rowNumber).originalValues.set(
                    binding,
                    this._grid.provider.getCellData(
                        rowNumber,
                        columnNumber,
                        false
                    )
                );
            }
        }
    }
}
