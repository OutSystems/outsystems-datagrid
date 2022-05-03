// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    class CssClassInfo {
        /**
         * Contains all CSS classes from a specific row.
         */
        public cssClass: Array<string>;

        constructor() {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.cssClass = new Array<string>();
        }

        /** Add class to the cssClass array */
        public addClass(cssClass: string): void {
            // If the className is not on the array of classes from the row, than push it to the array.
            if (this.hasCssClass(cssClass) === false) {
                this.cssClass.push(cssClass);
            }
        }

        /** Checks if class exists in the cssClass array */
        public hasCssClass(cssClass: string): boolean {
            return this.cssClass.indexOf(cssClass) !== -1;
        }

        /** Remove all classes from the cssClass array */
        public removeAllClasses(): void {
            this.cssClass = [];
        }

        /** Remove a single class from the cssClass array */
        public removeClass(cssClass: string): void {
            if (this.hasCssClass(cssClass)) {
                this.cssClass.splice(this.cssClass.indexOf(cssClass), 1);
            }
        }
    }

    export class GridInsertRowAction extends wijmo.undo.UndoableAction {
        private _grid: Grid.IGridWijmo;

        constructor(
            grid: Grid.IGridWijmo,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            undoableItems: { datasourceIdx: number; items: any[] }
        ) {
            super(grid.provider);
            this._grid = grid;
            this._oldState = { action: 'remove', ...undoableItems };
            this._newState = undoableItems;
            const collectionView = grid.provider.itemsSource;
            collectionView.trackChanges &&
                collectionView.itemsAdded.push(...undoableItems.items);
        }
        // eslint-disable-next-line
        public applyState(state: any): void {
            const collectionView = this._target.itemsSource;
            if (collectionView) {
                if (state.action === 'remove') {
                    //undo
                    state.items.forEach((item) => {
                        collectionView.remove(item);
                        collectionView.trackChanges &&
                            collectionView.itemsAdded.remove(item);
                    });
                } else {
                    //redo
                    collectionView.sourceCollection.splice(
                        state.datasourceIdx,
                        0,
                        ...state.items
                    );
                    collectionView.trackChanges &&
                        collectionView.itemsAdded.push(...state.items);
                }
                collectionView.refresh();
                collectionView.moveCurrentToPosition(state.datasourceIdx);
                this._target.focus();

                if (
                    this._grid.gridEvents.hasHandlers(
                        OSFramework.Event.Grid.GridEventType.OnDataChange
                    )
                ) {
                    const dataChanges =
                        new OSFramework.OSStructure.DataChanges();
                    dataChanges.changedRows = state.items;
                    dataChanges.totalRows =
                        this._grid.features.pagination.rowTotal;
                    this._grid.gridEvents.trigger(
                        OSFramework.Event.Grid.GridEventType.OnDataChange,
                        this._grid,
                        dataChanges
                    );
                }
            }
        }
    }

    export class GridRemoveRowAction extends wijmo.undo.UndoableAction {
        private _grid: Grid.IGridWijmo;

        constructor(
            grid: Grid.IGridWijmo,
            // eslint-disable-next-line
            undoableItems: any
        ) {
            super(grid.provider);
            this._grid = grid;
            this._oldState = { action: 'insert', items: [...undoableItems] };
            this._newState = undoableItems;
        }

        private _addItemToCollectionView(collectionView, item) {
            if (collectionView.itemsRemoved.indexOf(item.item) === -1) {
                collectionView.sourceCollection.splice(item.datasourceIdx, 1);
                collectionView.trackChanges &&
                    collectionView.itemsRemoved.push(item.item);
            }
        }

        private _removeItemFromCollectionView(collectionView, item) {
            if (collectionView.itemsRemoved.indexOf(item.item) > -1) {
                collectionView.sourceCollection.splice(
                    item.datasourceIdx,
                    0,
                    item.item
                );
                collectionView.trackChanges &&
                    collectionView.itemsRemoved.remove(item.item);
            }
        }
        // eslint-disable-next-line
        public applyState(state: any): void {
            const collectionView = this._target.itemsSource;
            if (collectionView) {
                if (state.action === 'insert') {
                    state.items
                        .sort((a, b) => a.datasourceIdx - b.datasourceIdx)
                        .forEach((item) => {
                            this._removeItemFromCollectionView(
                                collectionView,
                                item
                            );
                        });
                } else {
                    //redo
                    state.forEach((item) => {
                        this._addItemToCollectionView(collectionView, item);
                    });
                }
                collectionView.refresh();
                collectionView.moveCurrentToPosition(
                    collectionView.currentPosition
                );
                this._target.focus();

                if (
                    this._grid.gridEvents.hasHandlers(
                        OSFramework.Event.Grid.GridEventType.OnDataChange
                    )
                ) {
                    const dataChanges =
                        new OSFramework.OSStructure.DataChanges();
                    dataChanges.changedRows =
                        state.items || state.map((state) => state.item);
                    dataChanges.totalRows =
                        this._grid.features.pagination.rowTotal;
                    this._grid.gridEvents.trigger(
                        OSFramework.Event.Grid.GridEventType.OnDataChange,
                        this._grid,
                        dataChanges
                    );
                }
            }
        }
    }

    export class Rows
        implements OSFramework.Interface.IBuilder, OSFramework.Feature.IRows
    {
        private _grid: Grid.IGridWijmo;

        /** This is going to be used as a label for the css classes saved on the metadata of the Row */
        private readonly _internalLabel = '__rowCssClass';

        private _metadata: OSFramework.Interface.IRowMetadata;

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
            this._metadata = this._grid.rowMetadata;
        }

        /**
         * Check if it is possible to add rows to the grid.
         * @returns Boolean indicating if it is possible to add rows to the grid.
         */
        private _canAddRows(): boolean {
            return (
                !this._grid.features.sort.isGridSorted &&
                !this._grid.features.groupPanel.isGridGrouped &&
                !this._grid.features.filter.isGridFiltered
            );
        }

        /**
         * Check if it is possible to remove rows from the grid.
         * @returns Boolean indicating if it is possible to remove rows from the grid.
         */
        private _canRemoveRows(): boolean {
            return (
                !this._grid.features.sort.isGridSorted &&
                !this._grid.features.groupPanel.isGridGrouped &&
                !this._grid.features.filter.isGridFiltered
            );
        }

        /**
         * Handler for the formatItems event
         */
        private _formatItems(
            grid: wijmo.grid.FlexGrid,
            e: wijmo.grid.FormatItemEventArgs
        ) {
            if (
                e.panel.cellType === wijmo.grid.CellType.Cell &&
                this.getMetadata(e.row).cssClass.length > 0
            ) {
                wijmo.addClass(
                    e.cell,
                    this.getMetadata(e.row).cssClass.join(' ')
                );
            }
        }

        /**
         * Get all the rows from the grid, including rows from other pages.
         * @returns Sum of rows from all the pages from the grid.
         */
        private _getRowsCount(): number {
            return this._grid.features.pagination.rowTotal;
        }

        /**
         * Get the index of the row from the top of the current selection.
         * @returns Index of the top row from the current selection.
         */
        private _getTopRow(): number {
            const topRow = Math.min(
                ...this._grid.features.selection
                    .getAllSelections()
                    .value.map((cellRange) => cellRange.topRowIndex)
            );
            // Consider the topRow 0 if there is no selection.
            return topRow === Infinity ? 0 : topRow;
        }

        /**
         * Add a CSS class to a specific row from the grid.
         * @param rowNumber Number of the row in which the class is going to be added.
         * @param className CSS class to add to the row.
         */
        public addClass(
            rowNumber: number,
            className: string,
            refresh = false
        ): void {
            this.getMetadata(rowNumber).addClass(className);
            if (refresh) {
                this._grid.provider.invalidate(); //Mark to be refreshed
            }
        }

        /**
         * Add a new row to the grid with all cells empty.
         * @returns ReturnMessage containing the resulting code from the adding rows and the error message in case of failure.
         */
        public addNewRows(): void {
            if (!this._canAddRows()) {
                throw new Error(
                    OSFramework.Enum.ErrorMessages.AddRowWithActiveFilterOrSort
                );
            }

            const providerGrid = this._grid.provider;
            const topRowIndex = this._getTopRow();
            // The datasource index of the selection's top row. Requires the page index and the page size.
            let dsTopRowIndex =
                topRowIndex + this._grid.features.pagination.rowStart - 1;
            // we don't want negative indices.
            dsTopRowIndex = dsTopRowIndex > 0 ? dsTopRowIndex : 0;
            // Consider the quantity 1 if there is no selection.
            const quantity =
                this._grid.features.selection.getSelectedRowsCountByCellRange() ||
                1;
            const expectedRowCount = this._getRowsCount() + quantity;
            //Take the selection off the grid so it is possible to add rows when a cell is in edit mode
            providerGrid.select(-1, -1);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let items = new Array<any>(quantity).fill(_.cloneDeep({}));

            providerGrid.focus(); // In case of Undo action, the user will not need to click on the grid to undo.

            this._grid.dataSource.addRow(dsTopRowIndex, items);

            // Trigger the event of adding the new row that will add the dirty mark to the added row
            for (let index = 0; index < quantity; index++) {
                this._grid.addedRows.trigger(topRowIndex + index);
            }

            // Trigger the method responsible for setting the row as new in the metadata of the row
            this._grid.addedRows.trigger(topRowIndex);

            // Makes sure the first cell from the recently added top row is selected.
            this._grid.features.selection.selectAndFocusFirstCell(topRowIndex);

            // Take care of the undoable action Add new rows.
            // The new created row data must be retrieved from the source collection to be added to add items list
            items = this._grid.provider.collectionView.sourceCollection.slice(
                dsTopRowIndex,
                dsTopRowIndex + quantity
            );
            const undoableItems = { datasourceIdx: dsTopRowIndex, items };
            this._grid.features.undoStack.pushAction(
                new GridInsertRowAction(this._grid, undoableItems)
            );

            // Make sure the count of rows is correct after adding rows.
            if (this._getRowsCount() === expectedRowCount) {
                if (
                    this._grid.gridEvents.hasHandlers(
                        OSFramework.Event.Grid.GridEventType.OnDataChange
                    )
                ) {
                    const dataChanges =
                        new OSFramework.OSStructure.DataChanges();

                    dataChanges.changedRows = items;
                    dataChanges.totalRows = this._getRowsCount();

                    this._grid.gridEvents.trigger(
                        OSFramework.Event.Grid.GridEventType.OnDataChange,
                        this._grid,
                        dataChanges
                    );
                }
            } else {
                throw new Error(
                    OSFramework.Enum.ErrorMessages.AddRowErrorMessage
                );
            }
        }

        public build(): void {
            this._grid.provider.formatItem.addHandler(
                this._formatItems.bind(this)
            );
        }

        /** Clears all the cssClass metadata associated to the rows */
        public clear(): void {
            this._metadata.clearProperty(this._internalLabel);
            this._grid.provider.invalidate(); //Mark to be refreshed
        }

        /**
         * Gets the metadata associated to the cssClasses for a specific row.
         * @param rowNumber Number of the row to check if there is any metadata associated to the cssClasses.
         * @returns CssClass of the row specified.
         */
        public getMetadata(rowNumber: number): CssClassInfo {
            if (!this.hasMetadata(rowNumber))
                this._metadata.setMetadataByRowNumber(
                    rowNumber,
                    this._internalLabel,
                    new CssClassInfo()
                );

            return this._metadata.getMetadataByRowNumber(
                rowNumber,
                this._internalLabel
            ) as CssClassInfo;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public getRowData(rowNumber: number): any {
            const row = this._grid.isSingleEntity
                ? OSFramework.Helper.Flatten(
                      this._grid.provider.rows[rowNumber]?.dataItem
                  )
                : this._grid.provider.rows[rowNumber].dataItem;

            if (!row) {
                throw new Error(OSFramework.Enum.ErrorMessages.Row_NotFound);
            }
            return row;
        }

        /**
         * Indicates if a specific row has any metadata associated to the cssClasses.
         * @param rowNumber Number of the row to check if there is any metadata associated to the cssClasses.
         * @returns Boolean that indicates whether a specific row has metadata associated to the cssClasses.
         */
        public hasMetadata(rowNumber: number): boolean {
            return this._metadata.hasOwnPropertyByRowNumber(
                rowNumber,
                this._internalLabel
            );
        }

        /**
         * Remove all CSS classes from a specific row on the grid.
         * @param rowNumber Number of the row in which the class is going to be removed.
         */
        public removeAllClasses(rowNumber: number): void {
            const row = this.getMetadata(rowNumber);

            if (!row) {
                throw new Error(OSFramework.Enum.ErrorMessages.Row_NotFound);
            }

            row.removeAllClasses();
            this._grid.provider.invalidate(); //Mark to be refreshed
        }

        /**
         * Remove a CSS class from a specific row on the grid.
         * @param rowNumber Number of the row in which all CSS classes are going to be removed.
         * @param className CSS class to remove from the row.
         */
        public removeClass(
            rowNumber: number,
            className: string,
            refresh = false
        ): void {
            const row = this.getMetadata(rowNumber);
            if (!row) {
                throw new Error(OSFramework.Enum.ErrorMessages.Row_NotFound);
            }
            row.removeClass(className);
            if (refresh) {
                this._grid.provider.invalidate(); //Mark to be refreshed
            }
        }

        /**
         * Remove all selected rows from the grid.
         * @returns ReturnMessage containing the resulting code from the removing rows and the error message in case of failure.
         */
        public removeSelectedRows(): OSFramework.OSStructure.ReturnMessage {
            if (!this._canRemoveRows()) {
                return {
                    code: OSFramework.Enum.ErrorCodes.API_UnableToRemoveRow,
                    message:
                        OSFramework.Enum.ErrorMessages
                            .AddRowWithActiveFilterOrSort,
                    isSuccess: false
                };
            }
            //This will avoid the same row being selected multiple times
            this._grid.features.selection.equalizeSelection();

            const providerGrid = this._grid.provider;
            const dataSource = providerGrid.itemsSource;
            const expectedRowCount =
                this._getRowsCount() -
                this._grid.features.selection.getSelectedRowsCountByCellRange();
            const selRanges = (
                this._grid.features.selection as IProviderSelection
            ).getProviderAllSelections();

            // In case of Undo action, the user will not need to click on the grid to undo.
            providerGrid.focus();

            const deletedRowsList = [];
            const undoableItems = [];

            dataSource.deferUpdate(() => {
                selRanges.forEach((range) => {
                    for (
                        let row = range.bottomRow;
                        row >= range.topRow;
                        row--
                    ) {
                        const undoableItem = {
                            datasourceIdx: row,
                            item: providerGrid.rows[row].dataItem
                        };
                        undoableItems.push(undoableItem);

                        deletedRowsList.push(providerGrid.rows[row].dataItem);
                        // Remove the data item from the editable collection view.
                        dataSource.remove(providerGrid.rows[row].dataItem);
                        // Removed rows should be valid
                        this._grid.features.validationMark.setRowStatus(
                            row,
                            true
                        );
                    }
                    this._grid.features.undoStack.pushAction(
                        new GridRemoveRowAction(this._grid, undoableItems)
                    );
                });
            });

            // Resets the selection after removing rows.
            this._grid.features.selection.selectAndFocusFirstCell();

            // Make sure the count of rows is correct after removing rows.
            if (this._getRowsCount() === expectedRowCount) {
                if (
                    this._grid.gridEvents.hasHandlers(
                        OSFramework.Event.Grid.GridEventType.OnDataChange
                    )
                ) {
                    const dataChanges =
                        new OSFramework.OSStructure.DataChanges();

                    dataChanges.changedRows = deletedRowsList;
                    dataChanges.totalRows = this._getRowsCount();

                    this._grid.gridEvents.trigger(
                        OSFramework.Event.Grid.GridEventType.OnDataChange,
                        this._grid,
                        dataChanges
                    );
                }

                return {
                    message: OSFramework.Enum.ErrorMessages.SuccessMessage,
                    isSuccess: true,
                    code: OSFramework.Enum.ErrorCodes.GRID_SUCCESS
                };
            } else {
                return {
                    code: OSFramework.Enum.ErrorCodes.API_FailedRemoveRow,
                    message: 'Error',
                    isSuccess: false
                };
            }
        }
    }
}
