// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Features {
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
        private _grid: Grid.IGrid;
        private _topLeftPanel: wijmo.grid.GridPanel;

        constructor(grid: Grid.IGrid) {
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

                //Without selectors merge it all!
                if (!this._grid.features.selection.hasSelectors) {
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

    export class ColumnPicker implements IBuilder, IDisposable {
        private _grid: Grid.IGridWijmo;
        private _theColumnPicker: wijmo.input.ListBox;

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
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
                    this._theColumnPicker.itemsSource = theGrid.columns.filter(
                        (p) =>
                            theGrid.itemsSource.groupDescriptions.filter(
                                (q) => q.propertyName === p.binding
                            ).length === 0
                    );

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
    }
}
