// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
    export class RowHeader
        implements
            OSFramework.DataGrid.Feature.IRowHeader,
            OSFramework.DataGrid.Interface.IBuilder
    {
        private _grid: Grid.IGridWijmo;
        private _rowHeaderType: OSFramework.DataGrid.Enum.RowHeader;
        private _selectedRows: wijmo.grid.Row[];

        constructor(grid: Grid.IGridWijmo, rowHeaderType: number) {
            this._grid = grid;
            this._rowHeaderType = rowHeaderType;
        }

        public get type(): OSFramework.DataGrid.Enum.RowHeader {
            return this._rowHeaderType;
        }

        public get hasRowNumber(): boolean {
            return (
                this._rowHeaderType ===
                    OSFramework.DataGrid.Enum.RowHeader.RowNumber ||
                this._rowHeaderType ===
                    OSFramework.DataGrid.Enum.RowHeader.RowNumberAndCheckbox
            );
        }

        public get hasCheckbox(): boolean {
            return (
                this._rowHeaderType ===
                    OSFramework.DataGrid.Enum.RowHeader.RowCheckbox ||
                this._rowHeaderType ===
                    OSFramework.DataGrid.Enum.RowHeader.RowNumberAndCheckbox
            );
        }

        private _buildCheckbox(): void {
            const column = new wijmo.grid.Column();
            column.allowResizing = false;
            column.allowSorting = false;
            column.allowDragging = false;
            column.allowMerging = false;
            column.align = 'center';

            new wijmo.grid.selector.Selector(this._grid.provider, {
                itemChecked: (s, e) => {
                    /* Option 3
                     ** An array of selected rows is stored so we can verify
                     ** which rows were selected or unselected.
                     */

                    // get selected rows
                    const newSelectedRows = this._grid.provider.rows.filter(
                        (r) => r.isSelected
                    );

                    // filter the selected rows
                    const selectedRow = newSelectedRows.filter(
                        (row) =>
                            this._selectedRows.findIndex(
                                (r) => r.index === row.index
                            ) === -1
                    );

                    // filter the unselected rows
                    const unselectedRow = this._selectedRows.filter(
                        (row) =>
                            newSelectedRows.findIndex(
                                (r) => r.index === row.index
                            ) === -1
                    );

                    //
                    if (selectedRow.length === 1) {
                        this._raiseSelectionChangedEvent(
                            selectedRow[0].index,
                            true
                        );
                    } else if (unselectedRow.length === 1) {
                        this._raiseSelectionChangedEvent(
                            unselectedRow[0].index,
                            false
                        );
                    } else {
                        // need an solution for when the select all checkbox is used
                    }

                    // update the selectedRows array
                    this._selectedRows = newSelectedRows;
                }
            });
            this._grid.provider.rowHeaders.columns.insert(0, column);
        }

        private _buildRowHeader() {
            if (this.hasCheckbox) {
                this._selectedRows = [];
                this._buildCheckbox();
                // with checkbox, we want to prevent row selection on row number and
                // want to still be able to select cells.
                this._disableRowSelectionOnRowNumber();
                this._grid.provider.selectionMode =
                    wijmo.grid.SelectionMode.MultiRange;

                // if grid has checked rows, add custom class so column headers are selected as well
                this._grid.provider.formatItem.addHandler((s, e) => {
                    if (e.panel.cellType === wijmo.grid.CellType.RowHeader) {
                        const columnHeaderElement =
                            s.columnHeaders.hostElement.querySelector(
                                '.wj-cell.wj-header'
                            );

                        const rowHeaderCheckedElement =
                            s.rowHeaders.hostElement.querySelector(
                                "input[type='checkbox']:checked"
                            );

                        if (rowHeaderCheckedElement) {
                            wijmo.addClass(
                                columnHeaderElement,
                                'checked-column-header'
                            );
                        } else if (
                            wijmo.hasClass(
                                columnHeaderElement,
                                'checked-column-header'
                            )
                        ) {
                            wijmo.removeClass(
                                columnHeaderElement,
                                'checked-column-header'
                            );
                        }
                    }
                });
            }
            if (!this.hasRowNumber) {
                this._grid.features.autoRowNumber.setState(false);
            }
        }

        /**
         * Disable row number header from being clicked as we want to select rows only with checkbox
         */
        private _disableRowSelectionOnRowNumber(): void {
            this._grid.provider.hostElement
                .querySelector('.wj-rowheaders')
                .addEventListener('mousedown', (e) => e.preventDefault());
        }

        /**
         * Responsible for raise the event when the row checkbox selection changed
         * @param grid Object triggering the event
         * @param e CellRangeEventArgs, defined the current selection
         */
        private _raiseSelectionChangedEvent(row: number, isChecked: boolean) {
            const rowData = this._grid.provider.rows[row].dataItem;

            this._grid.gridEvents.trigger(
                OSFramework.DataGrid.Event.Grid.GridEventType
                    .OnCheckedRowsChange,
                this._grid,
                row,
                isChecked,
                JSON.stringify(
                    this._grid.isSingleEntity
                        ? OSFramework.DataGrid.Helper.Flatten(rowData)
                        : rowData
                )
            );
        }

        public build(): void {
            this._buildRowHeader();
        }
    }
}
