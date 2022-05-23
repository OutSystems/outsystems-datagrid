// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    class ColumnFilterAction extends wijmo.undo.UndoableAction {
        constructor(s: wijmo.grid.filter.FlexGridFilter) {
            super(s);

            this._oldState = s.filterDefinition;
        }

        // apply a saved cell value (state)
        public applyState(state: string): void {
            this.target.filterDefinition = state;
            this.target.grid.focus();
        }

        // close the action saving the new value
        public close(): boolean {
            this._newState = this.target.filterDefinition;
            return this._newState !== this._oldState;
        }
    }

    // export class Builder extends Validation implements OSFramework.Interface.IBuilder {
    export class ColumnFilter
        implements
            OSFramework.Feature.IColumnFilter,
            OSFramework.Interface.IBuilder,
            OSFramework.Interface.IDisposable
    {
        private _enabled: boolean;
        private _filter: wijmo.grid.filter.FlexGridFilter;
        private _grid: Grid.IGridWijmo;

        constructor(grid: Grid.IGridWijmo, enabled: boolean) {
            this._grid = grid;
            this._enabled = enabled;
        }

        private _filterChangedHandler(s: wijmo.grid.filter.FlexGridFilter) {
            this._grid.features.undoStack.closeAction(ColumnFilterAction);

            if (
                this._grid.gridEvents.hasHandlers(
                    OSFramework.Event.Grid.GridEventType.OnFiltersChange
                )
            ) {
                this._grid.gridEvents.trigger(
                    OSFramework.Event.Grid.GridEventType.OnFiltersChange,
                    this._grid,
                    Helper.FilterFactory.MakeFromActiveFilters(
                        this._grid,
                        s.filterDefinition
                    )
                );
            }
        }

        private _filterChangingHandler(s: wijmo.grid.filter.FlexGridFilter) {
            this._grid.features.undoStack.startAction(
                new ColumnFilterAction(s)
            );
        }

        public get isGridFiltered(): boolean {
            // When filter is active/applied, check isActive property
            return (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                this._filter._filters.filter(
                    (columnFilter) => columnFilter.isActive
                ).length > 0
            );
        }

        public get filterType(): wijmo.grid.filter.FilterType {
            return this._grid.config.serverSidePagination
                ? wijmo.grid.filter.FilterType.Condition
                : wijmo.grid.filter.FilterType.Both;
        }

        /**
         * Function that will activate the filter at a given column id.
         *
         * @param columnID Column Id where the Filter will be activated
         */
        public activate(columnID: string): void {
            const column = this._grid.getColumn(columnID);
            if (column) {
                this.changeFilterType(columnID, this.filterType);
            } else {
                throw new Error(
                    OSFramework.Enum.ErrorMessages.InvalidColumnIdentifier
                );
            }
        }

        /**
         * Builds the Filter feature.
         */
        public build(): void {
            this._filter = new wijmo.grid.filter.FlexGridFilter(
                this._grid.provider
            );
            this._filter.filterChanging.addHandler(
                this._filterChangingHandler.bind(this)
            );

            this._filter.filterChanged.addHandler(
                this._filterChangedHandler.bind(this)
            );

            this._grid.validatingAction.addHandler(
                this.validateAction.bind(this)
            );

            Helper.Translation.FormatDateOperators();

            this.setState(this._enabled);
        }

        /**
         * Function that will perform a Filter based on a given Condition at a given ColumnID
         *
         * @param columnId Column Id where the Filter will be performed
         * @param values Values to apply as column filter
         */
        public byCondition(
            columnId: string,
            values: OSFramework.OSStructure.FilterCondition[]
        ): void {
            const column = this._grid.getColumn(columnId);
            if (column) {
                const columnFilter = this._filter.getColumnFilter(
                    column.config.binding
                ).conditionFilter;

                if (values.length > 0) {
                    const condition1 = values[0];
                    const condition2 = values[1];

                    columnFilter.condition1.value =
                        column.columnType === OSFramework.Enum.ColumnType.Number
                            ? parseFloat(condition1.value)
                            : condition1.value;
                    columnFilter.condition1.operator =
                        wijmo.grid.filter.Operator[condition1.operatorTypeId];
                    columnFilter.and = condition1.and;

                    if (condition2) {
                        columnFilter.condition2.value = condition2.value;
                        columnFilter.condition2.operator =
                            wijmo.grid.filter.Operator[
                                condition2.operatorTypeId
                            ];
                    }

                    this._filter.apply();
                    // trigger event
                    this._filterChangedHandler(this._filter);
                }
            } else {
                throw new Error(
                    OSFramework.Enum.ErrorMessages.InvalidColumnIdentifier
                );
            }
        }

        /**
         * Function that will perform a Filter based on a given Value at a given ColumnID
         *
         * @param columnId Column Id where the Filter will be performed
         * @param values Values to apply as column filter
         */
        public byValue(columnId: string, values: Array<string>): void {
            const column = this._grid.getColumn(columnId);
            if (column) {
                const columnFilter = this._filter.getColumnFilter(
                    column.config.binding
                ).valueFilter;

                // we receive values as an array ["Brazil", "Portugal"], but wijmo expects an object
                // eg.: {Brazil: true, Portugal: true}. So let's transform this to the desired input
                columnFilter.showValues = values
                    .map((val) => {
                        if (val === null) return '';
                        return val;
                    })
                    .reduce((obj, cur) => {
                        return { ...obj, [cur]: true };
                    }, {});

                this._filter.apply();
                // trigger event
                this._filterChangedHandler(this._filter);
            } else {
                throw new Error(
                    OSFramework.Enum.ErrorMessages.InvalidColumnIdentifier
                );
            }
        }

        /**
         * Function that will perform a Filter based on a given Filter Type at a given ColumnID
         *
         * @param columnId Column Id where the Filter will be performed
         * @param filterType Filter type to apply as column filter
         */
        public changeFilterType(
            columnID: string,
            filterType: wijmo.grid.filter.FilterType
        ): void {
            const column = this._grid.getColumn(columnID);

            if (column) {
                this._filter.getColumnFilter(column.provider).filterType =
                    filterType;
            } else {
                throw new Error(
                    OSFramework.Enum.ErrorMessages.InvalidColumnIdentifier
                );
            }
        }

        /**
         * Function that will Clear a column Filter at a given ColumnID
         *
         * @param columnId Column Id where the Filter will be performed
         */
        public clear(columnID: string): void {
            const column = this._grid.getColumn(columnID);

            if (column) {
                this._filter.getColumnFilter(column.provider).clear();
                this._grid.provider.collectionView.refresh();
            } else {
                throw new Error(
                    OSFramework.Enum.ErrorMessages.InvalidColumnIdentifier
                );
            }
        }

        /**
         * Function that will deActivate the filter at a given column id.
         *
         * @param columnId Column Id where the Filter will be performed
         */
        public deactivate(columnID: string): void {
            const column = this._grid.getColumn(columnID);
            if (column) {
                this.changeFilterType(
                    columnID,
                    wijmo.grid.filter.FilterType.None
                );
            } else {
                throw new Error(
                    OSFramework.Enum.ErrorMessages.InvalidColumnIdentifier
                );
            }
        }

        /**
         * Destroy Filter feature.
         */
        public dispose(): void {
            this._filter = undefined;
        }

        /**
         * Function that returns the active filters
         *
         * @returns JSON string with the active Filters
         */
        public getViewLayout(): string {
            return this._filter.filterDefinition;
        }

        /**
         * Function that perform a column filter based on given options.
         *
         * @param columnId Column Id where the Filter will be performed
         * @param options Options that will be applied to the given column as a Filter
         * @param maxVisibleOptions Set the amount of items returned by the given filter options
         */
        public setColumnFilterOptions(
            columnID: string,
            options: Array<string>,
            maxVisibleOptions?: number
        ): void {
            if (!this._grid.config.serverSidePagination)
                throw new Error(
                    'The SetColumnFilterOptions action is meant to be used on a Grid with server-side pagination ON.'
                );

            const column = this._grid.getColumn(columnID);

            if (column) {
                // for now we only want this to work on text or dropdown columns
                if (
                    column.columnType === OSFramework.Enum.ColumnType.Text ||
                    column.columnType === OSFramework.Enum.ColumnType.Dropdown
                ) {
                    // this column will have both filter types
                    this.changeFilterType(
                        columnID,
                        wijmo.grid.filter.FilterType.Both
                    );

                    this._filter.getColumnFilter(
                        column.provider
                    ).valueFilter.uniqueValues = Array.from(
                        new Set<string>(options) // we only want unique values
                    );

                    if (maxVisibleOptions > 0)
                        this._filter.getColumnFilter(
                            column.provider
                        ).valueFilter.maxValues = maxVisibleOptions;
                } else {
                    throw new Error(
                        `The SetColumnFilterOptions client action can only be applied to Text or Dropdowncolumns.`
                    );
                }
            } else {
                throw new Error(
                    OSFramework.Enum.ErrorMessages.InvalidColumnIdentifier
                );
            }
        }

        /**
         * Fucntion that will (de)activate the filter for all columns at once.
         *
         * @param value {boolean} True => Enable columns filter, False => Disabel columns filter
         */
        public setState(value: boolean): void {
            this._filter.defaultFilterType = value
                ? this.filterType
                : wijmo.grid.filter.FilterType.None;
            this._filter.showSortButtons = false;
            this._enabled = value;
        }

        /**
         * Function that will set the filters based on a given state
         *
         * @param state the filters state to be applied
         */
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public setViewLayout(state: any): void {
            this._filter.filterDefinition = state.filterDefinition;
        }

        /**
         * Function that will validate if a given Action can be done.
         *
         * @param action Action to be validated
         * @returns If action can't be done => A string with the Error info
         */
        public validateAction(
            action: OSFramework.Event.Grid.Actions /*, ctx: any*/
        ): string {
            if (this.isGridFiltered) {
                if (action === OSFramework.Event.Grid.Actions.AddRow) {
                    return "Can't add rows when filter is On!";
                }
            }
        }
    }
}
