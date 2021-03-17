// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Features {
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

    export interface IColumnFilter
        extends IBuilder,
            IValidation,
            IProviderConfig<boolean>,
            IView {
        isGridFiltered: boolean;
    }

    // export class Builder extends Validation implements IBuilder {
    export class ColumnFilter implements IColumnFilter, IBuilder, IDisposable {
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
                    ExternalEvents.GridEventType.OnFilterChange
                )
            ) {
                this._grid.gridEvents.trigger(
                    ExternalEvents.GridEventType.OnFilterChange,
                    this._grid,
                    JSON.stringify(
                        ActiveFilterFactory.MakeFromActiveFilters(
                            this._grid,
                            s.filterDefinition
                        )
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
            return JSON.parse(this._filter.filterDefinition).filters.length > 0;
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

            const dateOperators = wijmo.culture.FlexGridFilter.numberOperators.filter(
                function (item) {
                    //Removing item "Does not Equal"
                    return item.op !== 1;
                }
            );

            wijmo.culture.FlexGridFilter.dateOperators = dateOperators;

            this.setState(this._enabled);
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
                ? wijmo.grid.filter.FilterType.Both
                : wijmo.grid.filter.FilterType.None;
            this._filter.showSortButtons = false;
            this._enabled = value;
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public setViewLayout(state: any): void {
            this._filter.filterDefinition = state.filterDefinition;
        }

        public validateAction(
            action: InternalEvents.Actions /*, ctx: any*/
        ): string {
            if (this.isGridFiltered) {
                if (action === InternalEvents.Actions.AddRow) {
                    return "Can't add rows when filter is On!";
                }
            }
        }
    }
}
