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
            return (
                JSON.parse(this._filter.filterDefinition).filters.filter(
                    (x) => x.filterType !== 0
                ).length > 0
            );
        }

        public get filterType(): wijmo.grid.filter.FilterType {
            return this._grid.config.serverSidePagination
                ? wijmo.grid.filter.FilterType.Condition
                : wijmo.grid.filter.FilterType.Both;
        }

        public activate(columnID: string): void {
            this.changeFilterType(columnID, this.filterType);
        }

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

            const dateOperators =
                wijmo.culture.FlexGridFilter.numberOperators.filter(function (
                    item
                ) {
                    //Removing item "Does not Equal"
                    return item.op !== 1;
                });

            wijmo.culture.FlexGridFilter.dateOperators = dateOperators;

            this.setState(this._enabled);
        }

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
                            ? parseInt(condition1.value)
                            : condition1.value;
                    columnFilter.condition1.operator =
                        wijmo.grid.filter.Operator[condition1.operatorTypeId];
                    columnFilter.and = condition1.and;

                    if (condition2) {
                        columnFilter.condition1.value = condition2.value;
                        columnFilter.condition1.operator =
                            wijmo.grid.filter.Operator[
                                condition2.operatorTypeId
                            ];
                    }

                    this._filter.apply();
                    // trigger event
                    this._filterChangedHandler(this._filter);
                }
            }
        }

        public byValue(columnId: string, values: Array<string>): void {
            const column = this._grid.getColumn(columnId);
            if (column) {
                const columnFilter = this._filter.getColumnFilter(
                    column.config.binding
                ).valueFilter;

                // we receive values as an array ["Brazil", "Portugal"], but wijmo expects an object
                // eg.: {Brazil: true, Portugal: true}. So let's transform this to the desired input
                columnFilter.showValues = values.reduce((obj, cur) => {
                    return { ...obj, [cur]: true };
                }, {});

                this._filter.apply();
                // trigger event
                this._filterChangedHandler(this._filter);
            }
        }

        public changeFilterType(
            columnID: string,
            filterType: wijmo.grid.filter.FilterType
        ): void {
            const column = GridAPI.ColumnManager.GetColumnById(columnID);

            if (column) {
                this._filter.getColumnFilter(column.provider).filterType =
                    filterType;
            }
        }

        public clear(columnID: string): void {
            const column = GridAPI.ColumnManager.GetColumnById(columnID);

            this._filter.getColumnFilter(column.provider).clear();
            this._grid.provider.collectionView.refresh();
        }

        public deactivate(columnID: string): void {
            this.changeFilterType(columnID, wijmo.grid.filter.FilterType.None);
        }

        public dispose(): void {
            this._filter = undefined;
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public getViewLayout(): any {
            return this._filter.filterDefinition;
        }

        public setState(value: boolean): void {
            this._filter.defaultFilterType = value
                ? this.filterType
                : wijmo.grid.filter.FilterType.None;
            this._filter.showSortButtons = false;
            this._enabled = value;
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public setViewLayout(state: any): void {
            this._filter.filterDefinition = state.filterDefinition;
        }

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
