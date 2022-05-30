// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Column {
    export class GridEditAction extends wijmo.undo.UndoableAction {
        private _col: number;
        private _dataItems;
        private _grid: Grid.IGridWijmo;
        private _page: number;
        private _rng: wijmo.grid.CellRange;
        private _row: number;
        private _timeStamp: number;

        constructor(
            grid: Grid.IGridWijmo,
            // eslint-disable-next-line
            e: any
        ) {
            super(grid.provider);
            this._grid = grid;

            this._dataItems = [];

            for (
                let c = (this._rng = e.range), a = c.topRow;
                a <= c.bottomRow;
                a++
            )
                this._dataItems.push(this._grid.provider.rows[a].dataItem);

            this._oldState = this._grid.provider.getCellData(
                e.row,
                e.col,
                false
            );

            this._page =
                this._grid.provider.collectionView instanceof
                wijmo.collections.CollectionView
                    ? this._grid.provider.collectionView.pageIndex
                    : -1;
            this._row = e.row;
            this._col = e.col;
        }

        public get col(): number {
            return this._col;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public get dataItem(): any {
            return this._dataItems[0];
        }

        public get row(): number {
            return this._row;
        }

        // eslint-disable-next-line
        public applyState(e: any): void {
            // eslint-disable-next-line
            const n = this;
            const o = this._target;
            const i = o.editableCollectionView;
            if (i) {
                i instanceof wijmo.collections.CollectionView &&
                    this._page > -1 &&
                    i.moveToPage(this._page);

                o.deferUpdate(function () {
                    n._dataItems.forEach(function (t) {
                        i.editItem(t);
                        for (
                            let r = n._rng.leftCol;
                            r <= n._rng.rightCol;
                            r++
                        ) {
                            const c = o.columns[r];
                            const a = o._getBindingColumn(o.cells, n._row, c);

                            a && a._binding && a._binding.setValue(t, e);
                        }
                        i.commitEdit();
                    });
                });
            }
            o.select(o.selection.row, this._col);
            this._focusScroll();
        }

        public close(): boolean {
            const t = this._target.collectionView;
            if (t && t.currentAddItem) return !1;

            this._timeStamp = Date.now();
            this._newState = this._target.getCellData(
                this._row,
                this._col,
                false
            );
            return this._newState !== this._oldState;
        }

        // eslint-disable-next-line
        public shouldAddAsChildAction(action: any): any {
            return (
                action instanceof GridEditAction &&
                action.target === this.target &&
                action._timeStamp - this._timeStamp < 100
            );
        }
    }

    export class DropdownColumn extends AbstractProviderColumn<OSFramework.Configuration.Column.ColumnConfigDropdown> {
        private _handlerAdded: boolean;
        constructor(
            grid: OSFramework.Grid.IGrid,
            columnID: string,
            configs: JSON,
            extraConfig: JSON
        ) {
            super(
                grid,
                columnID,
                new OSFramework.Configuration.Column.ColumnConfigDropdown(
                    configs,
                    extraConfig
                )
            );
            this.config.dataMap = new wijmo.grid.DataMap([], 'key', 'text');
            this._columnEvents =
                new OSFramework.Event.Column.ColumnEventsManager(this);
            this._handlerAdded = false;
        }

        private _parentCellValueChangeHandler(
            gridID: string,
            rowNumber: number,
            columnID: string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            oldValue: any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            newValue: any
        ): void {
            // only set to blank if there is a different value
            if (oldValue !== newValue) {
                const column = this.grid.getColumn(columnID);
                const currentValue = this.grid.provider.getCellData(
                    rowNumber,
                    this.provider.index,
                    true
                );

                this.grid.features.dirtyMark.saveOriginalValue(
                    rowNumber,
                    this.provider.index
                );

                const cellRange = new wijmo.grid.CellRange(
                    rowNumber,
                    this.provider.index
                );

                // check if current parent cell has an undo action on undo stack
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const existingUndoAction: any =
                    this.grid.features.undoStack.stack._stack.find(
                        (data: GridEditAction) =>
                            data.col === column.provider.index &&
                            data.row === rowNumber
                    );

                if (existingUndoAction) {
                    // check if current child cell has an undo action on undo stack
                    const existingEditActionForColRow =
                        existingUndoAction?._actions?.find(
                            (action: GridEditAction) =>
                                action.col === this.provider.index &&
                                action.row === rowNumber
                        );

                    // only add child undo action if it doesnt already exist. we don't want duplicated actions
                    if (!existingEditActionForColRow) {
                        // add new child action into existing parent action in order
                        existingUndoAction.addChildAction(
                            new GridEditAction(
                                this.grid,
                                new wijmo.grid.CellRangeEventArgs(
                                    this.grid.provider.cells,
                                    cellRange
                                )
                            )
                        );
                    }
                }
                this.grid.provider.setCellData(
                    rowNumber,
                    this.provider.index,
                    '',
                    true
                );

                this.grid.features.validationMark.validateCell(
                    rowNumber,
                    this,
                    true
                );

                // trigger cell value change event
                if (column) {
                    this.columnEvents.trigger(
                        OSFramework.Event.Column.ColumnEventType
                            .OnCellValueChange,
                        '',
                        currentValue,
                        rowNumber
                    );
                }
            }
        }

        private _parentHandler() {
            if (this.config.parentBinding) {
                const column = this.grid.getColumn(this.config.parentBinding);

                if (column) {
                    // set child column to non mandatory, so we can set it to blank when parent changes value
                    this.provider.isRequired = false;

                    // on parent cell change subscription, to set child cell's to blank
                    column.columnEvents.addHandler(
                        OSFramework.Event.Column.ColumnEventType
                            .OnCellValueChange,
                        this._parentCellValueChangeHandler.bind(this)
                    );
                }
            }
        }

        /** Returns all the events associated to the column */
        public get columnEvents(): OSFramework.Event.Column.ColumnEventsManager {
            return this._columnEvents;
        }

        public get columnType(): OSFramework.Enum.ColumnType {
            return OSFramework.Enum.ColumnType.Dropdown;
        }

        public get providerType(): wijmo.DataType {
            return wijmo.DataType.String;
        }

        public applyConfigs(): void {
            if (this.isReady) {
                const providerConfig = this.getProviderConfig();
                delete providerConfig.dataMap;

                providerConfig.visible = this._getVisibility();

                wijmo.copy(this.provider, providerConfig);
            } else {
                console.log('applyConfigs - Column needs to be build');
            }
        }

        public build(): void {
            (
                this.config.dataMap as wijmo.grid.DataMap
            ).collectionView.sourceCollection = this.config.dropdownOptions;
            this.config.dataMapEditor = wijmo.grid.DataMapEditor.DropDownList;

            super.build();

            if (
                this.config.dropdownOptions &&
                this.config.dropdownOptions.length > 0
            ) {
                // eslint-disable-next-line no-extra-boolean-cast
                if (!!this.config.parentBinding) {
                    this.changeDisplayValues();

                    // RGRIDT-977: Wijmo has a bug that breaks filter by condition on dependent dropdowns
                    this.grid.features.filter.changeFilterType(
                        this.uniqueId,
                        wijmo.grid.filter.FilterType.Value
                    );

                    if (!this._handlerAdded) {
                        this._parentHandler();
                        this._handlerAdded = true;
                    }
                }
            }
        }

        public changeDisplayValues(): void {
            const dataMap = this.config.dataMap;
            const values = dataMap.collectionView.items;

            const parentColumn = this.grid.getColumn(this.config.parentBinding);

            if (
                parentColumn &&
                parentColumn.columnType === OSFramework.Enum.ColumnType.Dropdown
            ) {
                // override getDisplayValues method to get values that
                // correspond to the parent
                dataMap.getDisplayValues = (dataItem) => {
                    const colBinding = this.config.parentBinding.split('.');
                    let value = dataItem;
                    for (let i = 0; i < colBinding.length; i++) {
                        // in case we get undefined we want to break
                        if (
                            value === undefined &&
                            i === colBinding.length - 1
                        ) {
                            break;
                        }
                        value = value[colBinding[i]];
                    }

                    // if there is no value, we don't return anything
                    if (value) {
                        const validValues = values.filter(
                            (x) => x.parentKey === value.toString()
                        );
                        return validValues.map((value) => value.text);
                    }
                };
            }
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public changeProperty(propertyName: string, propertyValue: any): void {
            switch (propertyName) {
                case 'dropdownOptions':
                    // eslint-disable-next-line
                    const dataMap = this.config.dataMap as wijmo.grid.DataMap;
                    // eslint-disable-next-line
                    const values = JSON.parse(propertyValue) as [];
                    this.config.dropdownOptions = values;
                    dataMap.collectionView.sourceCollection = values;
                    dataMap.collectionView.refresh();

                    // eslint-disable-next-line no-extra-boolean-cast
                    if (!!this.config.parentBinding) {
                        this.changeDisplayValues();

                        // RGRIDT-977: Wijmo has a bug that breaks filter by condition on dependent dropdowns
                        this.grid.features.filter.changeFilterType(
                            this.uniqueId,
                            wijmo.grid.filter.FilterType.Value
                        );

                        if (!this._handlerAdded) {
                            this._parentHandler();
                            this._handlerAdded = true;
                        }
                    }
                    break;
                default:
                    super.changeProperty(propertyName, propertyValue);
            }
        }
    }
}
