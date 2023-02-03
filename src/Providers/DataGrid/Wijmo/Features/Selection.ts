// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
    /**
     * Define non-generic methods containing provider code
     */
    export interface IProviderSelection
        extends OSFramework.DataGrid.Feature.ISelection {
        getProviderAllSelections(): wijmo.grid.CellRange[];
    }

    export class Selection
        implements IProviderSelection, OSFramework.DataGrid.Interface.IBuilder
    {
        private _grid: Grid.IGridWijmo;
        private _hasSelectors: boolean;
        private readonly _internalLabel = '__rowSelection';
        private _metadata: OSFramework.DataGrid.Interface.IRowMetadata;
        private _selectionMode: wijmo.grid.SelectionMode;

        /**
         * Selection constructor
         * @param grid IGridWijmo object
         * @param hasSelectors Defines if Row-Checkboxes should be created
         * @param selectionMode The current selection mode
         */
        constructor(
            grid: Grid.IGridWijmo,
            hasSelectors = false,
            selectionMode = wijmo.grid.SelectionMode.MultiRange
        ) {
            this._grid = grid;

            this._selectionMode = selectionMode;
            this._hasSelectors = hasSelectors;
            this._metadata = this._grid.rowMetadata;
        }

        public get hasSelectors(): boolean {
            return this._hasSelectors;
        }

        private _getCheckedRows(): number[] {
            return this._grid.provider.rows
                .filter((p) => p.isSelected)
                .map((p) => p.index);
        }

        /**
         * Responsible for adding metadata on checked rows
         * @param grid Object triggering the event
         * @param e CellRangeEventArgs, defined the current selection
         */
        private _selectionChanged(
            grid: wijmo.grid.FlexGrid,
            e: wijmo.grid.CellRangeEventArgs
        ) {
            if (e.row >= 0) {
                const isSelected = grid.rows[e.row]?.isSelected;
                this.getMetadata(e.row).isChecked = isSelected;
            }
        }

        /**
         * Responsible for maintain unique selections, user can't have the same range selected twice
         * @param grid Object triggering the event
         * @param e CellRangeEventArgs, defined the current selection
         */
        private _selectionChanging(
            grid: wijmo.grid.FlexGrid,
            e: wijmo.grid.CellRangeEventArgs
        ) {
            //This method just makes sense for MultiRange
            if (grid.selectionMode !== wijmo.grid.SelectionMode.MultiRange)
                return;
            const curr = e.range;
            const selectedRanges = grid._selHdl.extendedSelection;

            //Traverses the array of selected-ranges
            for (let i = selectedRanges.length - 1; i >= 0; i--) {
                //Check intersection
                if (curr.intersects(selectedRanges[i])) {
                    selectedRanges.removeAt(i);
                }
            }
        }

        /**
         * Responsible for checking rows based on metadata.
         * @param grid Object triggering the event
         * @param e CellRangeEventArgs, defined the current selection
         */
        private _updatingView(grid: wijmo.grid.FlexGrid) {
            grid.rows.forEach((row) => {
                row.isSelected = this.getMetadata(row.index).isChecked;
            });
        }

        public build(): void {
            //Set SelectionMode after defining Selectors, because wijmo will redefine them
            this.setState(this._selectionMode);

            this._grid.provider.selectionChanging.removeHandler(
                this._selectionChanging
            );
            this._grid.provider.selectionChanging.addHandler(
                this._selectionChanging
            );

            this._grid.provider.selectionChanged.addHandler(
                this._selectionChanged.bind(this)
            );

            if (this._grid.features.rowHeader.hasCheckbox) {
                this._grid.provider.updatingView.addHandler(
                    this._updatingView.bind(this)
                );
            }

            this._grid.provider.copying.addHandler(
                this.equalizeSelection.bind(this)
            );
        }

        public clear(): void {
            //As wijmo handles the selections in different objects considering the multiple wijmo.grid.SelectionMode
            //To simply clear all selections a lot more complex code would be here...
            //So I end up removing and re-applying the selection mode to clear things out
            this._grid.provider.selectionMode = wijmo.grid.SelectionMode.None;
            this._grid.provider.selectionMode = this._selectionMode;
        }

        public contains(
            rng: number | wijmo.grid.CellRange,
            col1?: number,
            row2?: number,
            col2?: number
        ): boolean {
            let range: wijmo.grid.CellRange;

            if (wijmo.isNumber(rng)) {
                range = new wijmo.grid.CellRange(rng, col1, row2, col2);
            } else {
                range = rng;
            }

            return this.getProviderAllSelections().some((p) =>
                p.intersects(range)
            );
        }

        public equalizeSelection(): OSFramework.DataGrid.OSStructure.CellRange[] {
            //This method just makes sense for MultiRange or for grid's without checked rows
            if (
                this._grid.provider.selectionMode !==
                    wijmo.grid.SelectionMode.MultiRange ||
                this.hasCheckedRows()
            )
                return;
            const grid = this._grid.provider; //Auxiliar for grid
            let leftCol = grid.columns.length - 1; //Set to max-length to facilitate Math.min
            let rightCol = -1; //Set to -1 to facilitate Math.max

            //When NO row is selected, find most left and right column looking to selectedRanges
            this.getProviderAllSelections().forEach((p) => {
                leftCol = Math.min(leftCol, p.leftCol, p.rightCol);
                rightCol = Math.max(rightCol, p.leftCol, p.rightCol);
            });

            //Adjusting structure
            grid.deferUpdate(() => {
                //Auxiliar to save combined ranges
                const rangesToRemove: wijmo.grid.CellRange[] = [];
                const activeSelection = grid._selHdl.selection;
                const selectedRanges = grid._selHdl.extendedSelection;

                //Traverse array looking for range intersection
                //Current selection in the first place prevent it from being deleted
                [activeSelection, ...selectedRanges.slice()]
                    .map((p) => {
                        p.setRange(p.topRow, leftCol, p.bottomRow, rightCol);
                        return p;
                    })
                    .forEach((curr, index, array) => {
                        //When marked to remove ignore
                        if (rangesToRemove.filter((p) => p === curr).length > 0)
                            return;

                        for (let i = index + 1; i < array.length; i++) {
                            //Verify intersection
                            if (curr.intersects(array[i])) {
                                //Combine intersection with current selection
                                const combined = curr.combine(array[i]);

                                //Update current
                                curr.setRange(
                                    combined.topRow,
                                    combined.leftCol,
                                    combined.bottomRow,
                                    combined.rightCol
                                );

                                //Mark intersection to be removed
                                rangesToRemove.push(array[i]);
                            }
                        }
                    });

                //Remove combined ranges
                rangesToRemove.forEach((p) => selectedRanges.remove(p));
            });

            return grid.selectedRanges
                .sort(
                    (a, b) => a.bottomRow - b.bottomRow || a.topRow - b.topRow
                )
                .map((p) =>
                    Helper.CellRangeFactory.MakeFromProviderCellRange(p)
                );
        }

        public getActiveCell(): OSFramework.DataGrid.OSStructure.CellRange {
            const currSelection = this._grid.provider.selection;

            if (currSelection && currSelection.isValid)
                //currSelection has the last range selected
                //properties row and col maintain the last cell selected or in a range, where the mouse button was released
                return Helper.CellRangeFactory.MakeFromCoordinates(
                    currSelection.row,
                    currSelection.col
                );
            else return undefined;
        }

        public getAllSelections(): OSFramework.DataGrid.OSStructure.ReturnMessage {
            try {
                const getAllSelections = this.getProviderAllSelections().map(
                    (p) => Helper.CellRangeFactory.MakeFromProviderCellRange(p)
                );

                return {
                    value: getAllSelections,
                    isSuccess: true,
                    message:
                        OSFramework.DataGrid.Enum.ErrorMessages.SuccessMessage,
                    code: OSFramework.DataGrid.Enum.ErrorCodes.GRID_SUCCESS
                };
            } catch (error) {
                return {
                    value: [],
                    isSuccess: false,
                    message: error.message,
                    code: OSFramework.DataGrid.Enum.ErrorCodes
                        .API_FailedGetAllSelections
                };
            }
        }

        public getAllSelectionsData(): OSFramework.DataGrid.OSStructure.ReturnMessage {
            try {
                const rowColumn = new Map<
                    number,
                    OSFramework.DataGrid.OSStructure.RowData
                >();
                const rowColumnArr: OSFramework.DataGrid.OSStructure.RowData[] =
                    [];

                this.getProviderAllSelections().map((range) => {
                    const bindings = Array(range.rightCol - range.leftCol + 1)
                        .fill(0)
                        .map((_, idx) =>
                            this._grid.provider.getColumn(range.leftCol + idx)
                        )
                        .filter((p) => p.isVisible)
                        .map((p) => p.binding);

                    Array(range.bottomRow - range.topRow + 1)
                        .fill(0)
                        .map((_, idx) => range.topRow + idx)
                        .map((rowIndex) => {
                            let curr = rowColumn.get(rowIndex);

                            if (!curr) {
                                curr =
                                    new OSFramework.DataGrid.OSStructure.RowData(
                                        this._grid,
                                        rowIndex,
                                        this._grid.provider.rows[
                                            rowIndex
                                        ].dataItem
                                    );

                                rowColumnArr.push(curr);
                                rowColumn.set(rowIndex, curr);
                            }

                            curr.selected.push(
                                ...bindings.map(
                                    (binding) =>
                                        new OSFramework.DataGrid.OSStructure.BindingValue(
                                            binding,
                                            this._grid.provider.getCellData(
                                                rowIndex,
                                                binding,
                                                false
                                            )
                                        )
                                )
                            );
                        });
                });

                rowColumn.clear();
                return {
                    value: rowColumnArr.map((p) => p.serialize()),
                    isSuccess: true,
                    message:
                        OSFramework.DataGrid.Enum.ErrorMessages.SuccessMessage,
                    code: OSFramework.DataGrid.Enum.ErrorCodes.GRID_SUCCESS
                };
            } catch (error) {
                return {
                    value: [],
                    isSuccess: false,
                    message: error.message,
                    code: OSFramework.DataGrid.Enum.ErrorCodes
                        .API_FailedGetAllSelectionsData
                };
            }
        }

        public getCheckedRowsData(): OSFramework.DataGrid.OSStructure.ReturnMessage {
            try {
                const allCheckedRows =
                    this._grid.provider.itemsSource.sourceCollection.filter(
                        (item) =>
                            item?.__osRowMetadata?.get(this._internalLabel)
                                ?.isChecked === true
                    );

                const allCheckedRowsArr = allCheckedRows.map(
                    (dataItem) =>
                        new OSFramework.DataGrid.OSStructure.CheckedRowData(
                            this._grid,
                            dataItem
                        )
                );

                return {
                    value: allCheckedRowsArr.map((p) => p.serialize()),
                    isSuccess: true,
                    message:
                        OSFramework.DataGrid.Enum.ErrorMessages.SuccessMessage,
                    code: OSFramework.DataGrid.Enum.ErrorCodes.GRID_SUCCESS
                };
            } catch (error) {
                return {
                    value: [],
                    isSuccess: false,
                    message: error.message,
                    code: OSFramework.DataGrid.Enum.ErrorCodes
                        .API_FailedGetCheckedRowsData
                };
            }
        }

        public getMetadata(
            rowNumber: number
        ): OSFramework.DataGrid.Feature.Auxiliar.RowSelection {
            if (!this.hasMetadata(rowNumber)) {
                this._metadata.setMetadataByRowNumber(
                    rowNumber,
                    this._internalLabel,
                    new OSFramework.DataGrid.Feature.Auxiliar.RowSelection()
                );
            }
            return this._metadata.getMetadataByRowNumber(
                rowNumber,
                this._internalLabel
            ) as OSFramework.DataGrid.Feature.Auxiliar.RowSelection;
        }

        public getProviderAllSelections(): wijmo.grid.CellRange[] {
            const ranges: wijmo.grid.CellRange[] = [];
            const maxCol = this._grid.provider.columns.length - 1;

            ranges.push(
                ...this._grid.provider.selectedRanges.filter((p) => p.isValid)
            );

            const selectedRows: Array<number> = this._getCheckedRows(); // get checked rows index
            const selectedRowsRanges: Array<wijmo.grid.CellRange> = [];
            let finalRange: Array<wijmo.grid.CellRange> = [];

            // create a range for each row
            selectedRows.forEach((rowIndex) => {
                const rowRange = new wijmo.grid.CellRange(
                    rowIndex,
                    0,
                    rowIndex,
                    maxCol
                );

                // add the row range created to selectedRowsRanges array
                selectedRowsRanges.push(rowRange);
            });

            // if it the grid has checkboxes, then just return the row ranges
            if (this._grid.features.rowHeader.hasCheckbox) {
                finalRange = selectedRowsRanges;
            }

            // otherwise, if it has selected rows, then merge it with the selected ranges
            else if (selectedRows.length > 0) {
                ranges.forEach((range) => {
                    selectedRowsRanges.forEach((rowRange) => {
                        // for each range, check if it intersects the checked row
                        if (range !== null && range.intersects(rowRange)) {
                            let row1 = range.row;
                            let row2 = range.row2;
                            if (range.row > range.row2) {
                                row1 = range.row2;
                                row2 = range.row;
                            }

                            // if the range starts before the checked row,
                            // create a new subsection of range from where it starts until the selected row index - 1
                            // and add it to the finalRange array
                            if (row1 < rowRange.row) {
                                finalRange.push(
                                    new wijmo.grid.CellRange(
                                        row1,
                                        range.col,
                                        rowRange.row - 1,
                                        range.col2
                                    )
                                );
                            }

                            // if the range finishes after the checked row,
                            // create a new subsection of range from the selected row index + 1 until where it finishes
                            // we want to use this range for the next iteration
                            if (row2 > rowRange.row) {
                                range = new wijmo.grid.CellRange(
                                    rowRange.row + 1,
                                    range.col,
                                    row2,
                                    range.col2
                                );
                            }
                            // otherwise, there is not more range to cover, so set it null
                            else {
                                range = null;
                            }
                        }
                    });

                    // if it is not null, we push the remaining subsection of the range into the finalRange array
                    if (range) finalRange.push(range);
                });

                // now that we are sure that the row ranges don't have intersections between the selected ranges,
                // we can merge both arrays
                finalRange = [...selectedRowsRanges, ...finalRange];
            }

            // otherwise, just return the selected ranges
            else {
                finalRange = ranges;
            }

            return finalRange;
        }

        public getSelectedRows(): number[] {
            const rows: number[] = [];
            const maxCol = this._grid.provider.columns.length - 1;

            this.getProviderAllSelections()
                .filter((p) => p.leftCol === 0 && p.rightCol === maxCol)
                .map((range) => {
                    rows.push(
                        ...Array(range.bottomRow - range.topRow + 1)
                            .fill(0)
                            .map((_, idx) => range.topRow + idx)
                    );
                });

            // Return only unique indexes (check if there are duplicated indexes)
            // Duplicate indexes could be retuned when the mouse and ctrl was used for selection
            return rows.filter((item, index) => rows.indexOf(item) === index);
        }

        public getSelectedRowsCount(): OSFramework.DataGrid.OSStructure.ReturnMessage {
            try {
                return {
                    value: this.getSelectedRows().length,
                    isSuccess: true,
                    message:
                        OSFramework.DataGrid.Enum.ErrorMessages.SuccessMessage,
                    code: OSFramework.DataGrid.Enum.ErrorCodes.GRID_SUCCESS
                };
            } catch (error) {
                return {
                    value: null,
                    isSuccess: false,
                    message: error.message,
                    code: OSFramework.DataGrid.Enum.ErrorCodes
                        .API_FailedGetSelectedRowsCount
                };
            }
        }

        public getSelectedRowsCountByCellRange(): number {
            //Runs the equalize to garantee that the same row is not selected more than once
            this.equalizeSelection();
            return this.getAllSelections().value.reduce(
                (acc, sel) => acc + (sel.bottomRowIndex - sel.topRowIndex + 1),
                0
            );
        }

        public getSelectedRowsData(): OSFramework.DataGrid.OSStructure.ReturnMessage {
            try {
                const selectedRows = this.getSelectedRows().map(
                    (rowIndex) =>
                        new OSFramework.DataGrid.OSStructure.RowData(
                            this._grid,
                            rowIndex,
                            this._grid.provider.rows[rowIndex].dataItem
                        )
                );
                return {
                    value: selectedRows
                        .map((p) => p.serialize())
                        // we want to return dataItem as an object instead of an array,
                        .map(({ rowIndex, selected, dataItem }) => {
                            const _dataItem = { ...dataItem[0] };

                            return {
                                rowIndex,
                                selected,
                                dataItem: JSON.stringify(_dataItem)
                            };
                        }),
                    isSuccess: true,
                    message:
                        OSFramework.DataGrid.Enum.ErrorMessages.SuccessMessage,
                    code: OSFramework.DataGrid.Enum.ErrorCodes.GRID_SUCCESS
                };
            } catch (error) {
                return {
                    value: [],
                    isSuccess: false,
                    message: error.message,
                    code: OSFramework.DataGrid.Enum.ErrorCodes
                        .API_FailedGetSelectedRowsData
                };
            }
        }

        public getSelectionAverage(): OSFramework.DataGrid.OSStructure.ReturnMessage {
            let _count = 0;
            let _sum = 0;
            const _grid = this._grid;
            const _items = this.getAllSelectionsData().value;
            try {
                for (const item of _items) {
                    item.selected.forEach((element) => {
                        const columnType = _grid.getColumn(
                            element.binding
                        ).columnType;
                        if (
                            columnType ===
                                OSFramework.DataGrid.Enum.ColumnType.Number ||
                            columnType ===
                                OSFramework.DataGrid.Enum.ColumnType.Currency ||
                            columnType ===
                                OSFramework.DataGrid.Enum.ColumnType.Calculated
                        ) {
                            _sum = _sum + element.value;
                            _count++;
                        }
                    });
                }
                return {
                    value: _sum > 0 ? _sum / _count : null,
                    isSuccess: false,
                    message:
                        OSFramework.DataGrid.Enum.ErrorMessages.SuccessMessage,
                    code: OSFramework.DataGrid.Enum.ErrorCodes.GRID_SUCCESS
                };
            } catch (error) {
                return {
                    value: null,
                    isSuccess: false,
                    message: error.message,
                    code: OSFramework.DataGrid.Enum.ErrorCodes
                        .API_FailedGetSelectionAverage
                };
            }
        }

        // Calculate the number o selected cells based on getAllSelectionsData method
        public getSelectionCellCount(): number {
            let selectionCellCount = 0;
            this.getAllSelectionsData().value.forEach((cell) => {
                selectionCellCount = selectionCellCount + cell.selected.length;
            });
            return selectionCellCount;
        }

        // Method to get the count of selected cells on Grid
        public getSelectionCount(): OSFramework.DataGrid.OSStructure.ReturnMessage {
            try {
                return {
                    value: this.getSelectionCellCount(),
                    isSuccess: true,
                    message:
                        OSFramework.DataGrid.Enum.ErrorMessages.SuccessMessage,
                    code: OSFramework.DataGrid.Enum.ErrorCodes.GRID_SUCCESS
                };
            } catch (error) {
                return {
                    value: null,
                    isSuccess: false,
                    message: error.message,
                    code: OSFramework.DataGrid.Enum.ErrorCodes
                        .API_FailedGetSelectionCount
                };
            }
        }

        public getSelectionMaxMin(
            isMax: boolean
        ): OSFramework.DataGrid.OSStructure.ReturnMessage {
            let _max = -Infinity;
            let _min = Infinity;
            const _grid = this._grid;
            const _items = this.getAllSelectionsData().value;
            try {
                for (const item of _items) {
                    item.selected.forEach((element) => {
                        const columnType = _grid.getColumn(
                            element.binding
                        ).columnType;
                        if (
                            columnType ===
                                OSFramework.DataGrid.Enum.ColumnType.Number ||
                            columnType ===
                                OSFramework.DataGrid.Enum.ColumnType.Currency ||
                            columnType ===
                                OSFramework.DataGrid.Enum.ColumnType.Calculated
                        ) {
                            _min = Math.min(_min, element.value);
                            _max = Math.max(_max, element.value);
                        }
                    });
                }
                return {
                    value: isMax ? _max : _min,
                    isSuccess: true,
                    message:
                        OSFramework.DataGrid.Enum.ErrorMessages.SuccessMessage,
                    code: OSFramework.DataGrid.Enum.ErrorCodes.GRID_SUCCESS
                };
            } catch (error) {
                return {
                    value: null,
                    isSuccess: false,
                    message: error.message,
                    code: isMax
                        ? OSFramework.DataGrid.Enum.ErrorCodes
                              .API_FailedGetSelectionMax
                        : OSFramework.DataGrid.Enum.ErrorCodes
                              .API_FailedGetSelectionMin
                };
            }
        }

        public getSelectionSum(): OSFramework.DataGrid.OSStructure.ReturnMessage {
            try {
                let sum = 0;
                this.getAllSelectionsData().value.forEach((row) => {
                    row.selected.forEach((col) => {
                        if (
                            this._grid.getColumn(col.binding).columnType ===
                                OSFramework.DataGrid.Enum.ColumnType.Currency ||
                            this._grid.getColumn(col.binding).columnType ===
                                OSFramework.DataGrid.Enum.ColumnType.Number ||
                            this._grid.getColumn(col.binding).columnType ===
                                OSFramework.DataGrid.Enum.ColumnType.Calculated
                        ) {
                            sum += col.value;
                        }
                    });
                });

                return {
                    value: sum,
                    isSuccess: true,
                    message:
                        OSFramework.DataGrid.Enum.ErrorMessages.SuccessMessage,
                    code: OSFramework.DataGrid.Enum.ErrorCodes.GRID_SUCCESS
                };
            } catch (error) {
                return {
                    value: [],
                    isSuccess: false,
                    message: error.message,
                    code: OSFramework.DataGrid.Enum.ErrorCodes
                        .API_FailedGetSelectionSum
                };
            }
        }

        public hasCheckedRows(): boolean {
            return this.getCheckedRowsData().value.length > 0;
        }

        public hasMetadata(rowNumber: number): boolean {
            return this._metadata.hasOwnPropertyByRowNumber(
                rowNumber,
                this._internalLabel
            );
        }

        public hasSelectedRows(): OSFramework.DataGrid.OSStructure.ReturnMessage {
            try {
                return {
                    value: this.getSelectedRows().length > 0,
                    isSuccess: true,
                    message:
                        OSFramework.DataGrid.Enum.ErrorMessages.SuccessMessage,
                    code: OSFramework.DataGrid.Enum.ErrorCodes.GRID_SUCCESS
                };
            } catch (error) {
                return {
                    value: undefined,
                    isSuccess: false,
                    message: error.message,
                    code: OSFramework.DataGrid.Enum.ErrorCodes
                        .API_FailedHasSelectedRows
                };
            }
        }

        public hasValidSelection(): boolean {
            return this._grid.provider.selection.isValid;
        }

        // eslint-disable-next-line @typescript-eslint/no-inferrable-types
        public selectAndFocusFirstCell(rowIndex: number = 0): void {
            this._grid.provider.select(
                new wijmo.grid.CellRange(rowIndex, 0, rowIndex, 0),
                true
            );
        }

        public setRowAsSelected(
            rowsIndex: number[],
            isSelected = true
        ): OSFramework.DataGrid.OSStructure.ReturnMessage {
            try {
                if (this._grid.features.rowHeader.hasCheckbox) {
                    return {
                        value: undefined,
                        isSuccess: false,
                        message:
                            OSFramework.DataGrid.Enum.ErrorMessages
                                .SetRowAsSelected,
                        code: OSFramework.DataGrid.Enum.ErrorCodes
                            .API_FailedSetRowAsSelected
                    };
                }

                rowsIndex.forEach((index) => {
                    this._grid.provider.rows[index].isSelected = isSelected;
                });

                return {
                    value: rowsIndex,
                    isSuccess: true,
                    message:
                        OSFramework.DataGrid.Enum.ErrorMessages.SuccessMessage,
                    code: OSFramework.DataGrid.Enum.ErrorCodes.GRID_SUCCESS
                };
            } catch (error) {
                return {
                    value: undefined,
                    isSuccess: false,
                    message: error.message,
                    code: OSFramework.DataGrid.Enum.ErrorCodes
                        .API_FailedSetRowAsSelected
                };
            }
        }

        public setState(value: wijmo.grid.SelectionMode): void {
            // wijmo.grid.SelectionMode.ListBox, Row and RowRange not supported yet,
            // there is a conflict with wijmo.grid.selector.Selector
            if (
                value === wijmo.grid.SelectionMode.ListBox ||
                value === wijmo.grid.SelectionMode.Row ||
                value === wijmo.grid.SelectionMode.RowRange
            ) {
                throw new Error(
                    `Selection Feature - Unsupported selectionMode '${value}'!`
                );
            }
            this._selectionMode = value;
            this._grid.provider.selectionMode = value;
        }
    }
}
