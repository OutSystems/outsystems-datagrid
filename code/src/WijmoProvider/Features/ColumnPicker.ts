// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    /**
     * Undo stack won't work when the ColumnPicker is opened.
     * The wijmo.showPopup -> _addPopupToDOM moves the element to the body element
     * UndoStack only watches to the Widget
     *
     * @class ColumnPickerAction
     * @extends {wijmo.undo.UndoableAction}
     */
    class ColumnPickerAction extends wijmo.undo.UndoableAction {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _col: any;
        private _listBox: wijmo.input.ListBox;

        constructor(
            grid: wijmo.grid.FlexGrid,
            listBox: wijmo.input.ListBox,
            binding: string,
            state: boolean
        ) {
            super(grid);

            this._listBox = listBox;
            this._col = grid.getColumn(binding);
            this._oldState = state;
        }

        /**
         * apply a saved cell value (state)
         *
         * @memberof ColumnPickerAction
         */
        public applyState(state: boolean): void {
            this._col.visible = state;
            this._listBox.loadList();
            this.target.focus();
        }

        /**
         * Close the action saving the new value
         *
         * @returns {*}  {boolean}
         * @memberof ColumnPickerAction
         */
        public close(): boolean {
            this._newState = this._col.visible;
            return this._newState !== this._oldState;
        }
    }

    /**
     * Used to merge topLeftCells
     */
    class CustomMergeManager extends wijmo.grid.MergeManager {
        private _grid: OSFramework.Grid.IGrid;
        private _topLeftPanel: wijmo.grid.GridPanel;

        constructor(grid: OSFramework.Grid.IGrid) {
            super();
            this._grid = grid;
            this._topLeftPanel = grid.provider.topLeftCells;
        }

        public getMergedRange(
            panel,
            rowIndex: number,
            colIndex: number,
            clip = true
        ): wijmo.grid.CellRange {
            //Customized just for the topLeftCells
            if (this._topLeftPanel === panel) {
                const lastRowIndex = panel.rows.length - 1;

                //Without checkbox merge it all!
                if (!this._grid.features.rowHeader.hasCheckbox) {
                    return new wijmo.grid.CellRange(
                        0,
                        0,
                        lastRowIndex,
                        panel.columns.length - 1
                    );
                }
                //With Selectors and in the last row
                else if (rowIndex !== lastRowIndex) {
                    //Ignore the last row, the select-all checkbox will be created here
                    return new wijmo.grid.CellRange(
                        0,
                        0,
                        lastRowIndex - 1,
                        panel.columns.length - 1
                    );
                }
                //Otherwise just call the original one
                else {
                    return super.getMergedRange(
                        panel,
                        rowIndex,
                        colIndex,
                        clip
                    );
                }
            } else {
                return super.getMergedRange(panel, rowIndex, colIndex, clip);
            }
        }
    }

    export class ColumnPicker
        implements
            OSFramework.Feature.IColumnPicker,
            OSFramework.Interface.IBuilder,
            OSFramework.Interface.IDisposable
    {
        private _grid: WijmoProvider.Grid.IGridWijmo;
        private _showHiddenColumns = true;
        private _theColumnPicker: wijmo.input.ListBox;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        constructor(grid: WijmoProvider.Grid.IGridWijmo) {
            this._grid = grid;
        }

        // if column is within a group, we want to display the group name as well
        // GROUP_NAME > COLUMN_NAME
        private _addGroupToColumnPicker(
            col: OSFramework.Column.IColumn,
            item: HTMLElement
        ) {
            if (col.hasParentColumn) {
                const lastChildText = item.querySelector('label').lastChild;

                if (lastChildText) {
                    const parentCol = this._grid.getColumn(col.parentColumnId);
                    lastChildText.textContent = `${parentCol.config.header} >${lastChildText.textContent}`;
                }
            }
        }

        // If column is hidden, we don't want it to be enabled
        private _configureCheckbox(
            col: OSFramework.Column.IColumn,
            item: HTMLElement
        ) {
            if (col.config.canBeHidden === false) {
                const checkbox = item.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.setAttribute('disabled', 'true');
                }
            }
        }

        private _filterAutogenColumns(column) {
            return (
                this._grid.provider.itemsSource.groupDescriptions.filter(
                    (q) => q.propertyName === column.binding
                ).length === 0
            );
        }

        private _filterColumnsToBeDisplayedOnColumnPicker(column) {
            // we don't want group columns
            if (column.columnType === OSFramework.Enum.ColumnType.Group) {
                return false;
            }

            // if user has set this to false, we don't want to display
            // columns that are not visible and whose visibility cannot be changed
            // we dont want this on autogenerated columns
            if (!this._showHiddenColumns && !column.config.autoGenerated) {
                return column.config.canBeHidden && column.config.visible;
            }
            return true;
        }

        // eslint-disable-next-line
        private _getColumnsToBeDisplayedOnColumnPicker(): any[] {
            const columns = this._grid.getColumns();
            const isAutogenerated = columns.length === 0;

            // on autogenerated grid without columns we must return provider's column instead of ours
            if (isAutogenerated) {
                return this._grid.provider.columns.filter((col) =>
                    this._filterAutogenColumns(col)
                );
            }

            return (
                columns
                    .filter((col) =>
                        this._filterColumnsToBeDisplayedOnColumnPicker(col)
                    )
                    // we don't want to display columns that are on group panel
                    .filter(
                        (col) =>
                            this._grid.provider.itemsSource.groupDescriptions.filter(
                                (q) => q.propertyName === col.config.binding
                            ).length === 0
                    )
                    .map((col) => col.provider)
            );
        }

        private _makeColumnPicker(): void {
            const theGrid = this._grid.provider;
            const picker = document.createElement('div');
            const span = document.createElement('span');

            picker.setAttribute('id', 'theColumnPicker');
            picker.classList.add('column-picker');

            span.classList.add(
                'column-picker-icon',
                'glyphicon',
                'glyphicon-cog'
            );

            theGrid.hostElement.appendChild(picker);

            theGrid.formatItem.addHandler(
                (s: wijmo.grid.FlexGrid, e: wijmo.grid.FormatItemEventArgs) => {
                    if (
                        e.panel === s.topLeftCells &&
                        e.row === 0 &&
                        e.col === 0
                    ) {
                        e.cell.appendChild(span);
                    }
                }
            );

            // create the column picker
            this._theColumnPicker = new wijmo.input.ListBox(picker, {
                checkedMemberPath: 'visible',
                displayMemberPath: 'header',
                formatItem: (
                    sender: wijmo.input.ListBox,
                    e: wijmo.input.FormatItemEventArgs
                ) => {
                    if (e && e.data && e.data.binding) {
                        const col = this._grid.getColumn(e.data.binding);
                        if (col !== undefined) {
                            this._addGroupToColumnPicker(col, e.item);
                            this._configureCheckbox(col, e.item);
                        }
                    }
                },
                //Undo Stack Enable
                itemChecked: (s: wijmo.input.ListBox) => {
                    const _item = s.selectedItem;

                    this._grid.features.undoStack.startAction(
                        new ColumnPickerAction(
                            this._grid.provider,
                            this._theColumnPicker,
                            _item.binding,
                            !_item[s.checkedMemberPath]
                        )
                    );
                    this._grid.features.undoStack.closeAction(
                        ColumnPickerAction
                    );
                },
                lostFocus: () => {
                    wijmo.hidePopup(this._theColumnPicker.hostElement);
                    theGrid.focus();
                }
            });

            wijmo.hidePopup(this._theColumnPicker.hostElement);

            const host = this._theColumnPicker.hostElement;
            const ref = theGrid.hostElement.querySelector('.wj-topleft');

            span.onclick = (e: MouseEvent) => {
                if (!host.offsetHeight) {
                    this._theColumnPicker.itemsSource =
                        this._getColumnsToBeDisplayedOnColumnPicker();

                    wijmo.showPopup(host, ref, false, true, false);
                    this._theColumnPicker.focus();
                } else {
                    wijmo.hidePopup(host, true, true);
                    theGrid.focus();
                }

                e.preventDefault();
            };
        }

        public build(): void {
            this._grid.provider.mergeManager = new CustomMergeManager(
                this._grid
            );
            this._makeColumnPicker();
        }

        public dispose(): void {
            this._theColumnPicker.dispose();
            this._theColumnPicker = undefined;
        }

        public setShowHiddenColumns(showHiddenColumns: boolean): void {
            this._showHiddenColumns = showHiddenColumns;
        }
    }
}
