// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Features {
    type _ErrorMessage = { code: number; message: string };

    /**
     * Exposed methods for manipulating rows
     */
    export interface IRows {
        /**
         * Add new rows to the grid. If there is a selection it will add as many rows as selected. If not, it will add a row at the top.
         */
        addNewRows(): void;
        /**
         * Delete the rows that are selected.
         */
        removeSelectedRows(): void;
        /**
         * Set the private newItem to be used when a new row is added.
         */
        setNewItem(item: unknown): void;
    }

    class GridInsertRowAction extends wijmo.undo.UndoableAction {
        constructor(
            grid: wijmo.grid.FlexGrid,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            undoableItems: { datasourceIdx: number; items: any[] }
        ) {
            super(grid);
            this._oldState = { action: 'remove', ...undoableItems };
            this._newState = undoableItems;
            const cv = grid.itemsSource;
            cv.trackChanges && cv.itemsAdded.push(...undoableItems.items);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public applyState(state: any) {
            const cv = this._target.itemsSource;
            if (cv) {
                if (state.action === 'remove') {
                    //undo
                    state.items.forEach((item) => {
                        cv.remove(item);
                        cv.trackChanges && cv.itemsAdded.remove(item);
                    });
                } else {
                    //redo
                    cv.sourceCollection.splice(
                        state.datasourceIdx,
                        0,
                        ...state.items
                    );
                    cv.trackChanges && cv.itemsAdded.push(...state.items);
                }
                cv.refresh();
                cv.moveCurrentToPosition(state.datasourceIdx);
                this._target.focus();
            }
        }
    }

    export class Rows implements IBuilder, IRows {
        private _grid: Grid.IGridWijmo;
        // newItem will be set during grid's setData
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _newItem: any;

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
        }

        private _canAddRows(): boolean {
            return (
                !this._grid.features.sort.isGridSorted &&
                !this._grid.features.groupPanel.isGridGrouped &&
                !this._grid.features.filter.isGridFiltered
            );
        }

        private _canRemoveRows(): boolean {
            return (
                !this._grid.features.sort.isGridSorted &&
                !this._grid.features.groupPanel.isGridGrouped &&
                !this._grid.features.filter.isGridFiltered
            );
        }

        private _getRowsCount(): number {
            return this._grid.features.pagination.rowTotal;
        }

        private _getTopRow(): number {
            const topRow = Math.min(
                ...this._grid.features.selection
                    .getAllSelections()
                    .map((cellRange) => cellRange.topRowIndex)
            );
            // Consider the topRow 0 if there is no selection.
            return topRow === Infinity ? 0 : topRow;
        }

        public addNewRows(): _ErrorMessage {
            if (!this._canAddRows()) {
                // Return error
                return {
                    code: 201,
                    message:
                        'It seems that you have an active filter, group or sort on your columns. Remove them and try again.'
                };
            }

            if (!this._newItem) {
                return {
                    code: 400,
                    message:
                        "If you use auto generated columns and JSONSerialize, you can't add new rows. Also, if you are using columns, JSONSerialize and the grid has no data, you can't add new rows."
                };
            }

            const providerGrid = this._grid.provider;
            const dataSource = providerGrid.collectionView;
            const topRowIndex = this._getTopRow();
            // The datasource index of the selection's top row. Requires the page index and the page size.
            const dsTopRowIndex =
                topRowIndex + this._grid.features.pagination.rowStart - 1;
            // Consider the quantity 1 if there is no selection.
            const quantity =
                this._grid.features.selection.getSelectedRowsCountByCellRange() ||
                1;
            const expectedRowCount = this._getRowsCount() + quantity;
            const items = [];

            providerGrid.focus(); // In case of Undo action, the user will not need to click on the grid to undo.

            for (let i = quantity; i > 0; i--) {
                const _newItem = _.cloneDeep(this._newItem);

                dataSource.deferUpdate(() => {
                    dataSource.sourceCollection.splice(
                        dsTopRowIndex,
                        0,
                        _newItem
                    );
                });
                // Push a new item to the items list to pass it later to the Undoable action.
                items.push(_newItem);
                // Trigger the method responsible for setting the row as new in the metadata of the row
                this._grid.addedRows.trigger(topRowIndex);
            }

            // Makes sure the first cell from the recently added top row is selected.
            this._grid.features.selection.selectAndFocusFirstCell(topRowIndex);

            // Take care of the undoable action Add new rows.
            const undoableItems = { datasourceIdx: dsTopRowIndex, items };
            this._grid.features.undoStack.pushAction(
                new GridInsertRowAction(providerGrid, undoableItems)
            );

            // Make sure the count of rows is correct after adding rows.
            if (this._getRowsCount() === expectedRowCount) {
                // Return success
                return { code: 200, message: 'Success' };
            } else {
                return { code: 400, message: 'Error' };
            }
        }

        public build(): void {
            return;
        }

        public removeSelectedRows(): _ErrorMessage {
            if (!this._canRemoveRows()) {
                return {
                    code: 400,
                    message:
                        'It seems that you have an active filter, group or sort on your columns. Remove them and try again.'
                };
            }
            //This will avoid the same row being selected multiple times
            this._grid.features.selection.equalizeSelection();

            const providerGrid = this._grid.provider;
            const dataSource = providerGrid.itemsSource;
            const expectedRowCount =
                this._getRowsCount() -
                this._grid.features.selection.getSelectedRowsCountByCellRange();
            const selRanges = (this._grid.features
                .selection as IProviderSelection).getProviderAllSelections();

            // In case of Undo action, the user will not need to click on the grid to undo.
            providerGrid.focus();

            dataSource.deferUpdate(() => {
                selRanges.forEach((range) => {
                    for (
                        let row = range.bottomRow;
                        row >= range.topRow;
                        row--
                    ) {
                        // Take care of the undoable action of removing rows.
                        providerGrid.onDeletingRow(
                            new wijmo.grid.CellRangeEventArgs(
                                providerGrid.cells,
                                new wijmo.grid.CellRange(row, -1)
                            )
                        );
                        // Remove the data item from the editable collection view.
                        dataSource.remove(providerGrid.rows[row].dataItem);
                    }
                });
            });

            // Resets the selection after removing rows.
            this._grid.features.selection.selectAndFocusFirstCell();

            // Make sure the count of rows is correct after removing rows.
            if (this._getRowsCount() === expectedRowCount) {
                return { code: 200, message: 'Success' };
            } else {
                return { code: 400, message: 'Error' };
            }
        }

        public setNewItem(item: unknown): void {
            this._newItem = item;
        }
    }
}
