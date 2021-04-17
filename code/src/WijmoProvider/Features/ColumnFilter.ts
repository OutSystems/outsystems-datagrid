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
    export class ColumnFilter implements IColumnFilter, OSFramework.Interface.IBuilder, OSFramework.Interface.IDisposable {
        private _enabled: boolean;
        private _filter: wijmo.grid.filter.FlexGridFilter;
        private _grid: WijmoProvider.Grid.IGridWijmo;

        constructor(grid: WijmoProvider.Grid.IGridWijmo, enabled: boolean) {
            this._grid = grid;
            this._enabled = enabled;
        }

        private _filterChangedHandler(s: wijmo.grid.filter.FlexGridFilter) {
            this._grid.features.undoStack.closeAction(ColumnFilterAction);

            if (
                this._grid.gridEvents.hasHandlers(
                    OSFramework.Event.GridEventType.OnFiltersChange
                )
            ) {
                this._grid.gridEvents.trigger(
                    OSFramework.Event.GridEventType.OnFiltersChange,
                    this._grid,
                    WijmoProvider.Helper.FilterFactory.MakeFromActiveFilters(
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
            return JSON.parse(this._filter.filterDefinition).filters.length > 0;
        }
        public activate(columID: string): void {
            const column = GridAPI.ColumnManager.GetColumnById(columID);

            this._filter.getColumnFilter(column.provider).filterType =
                wijmo.grid.filter.FilterType.Both;
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

        public clear(columID: string): void {
            const column = GridAPI.ColumnManager.GetColumnById(columID);

            this._filter.getColumnFilter(column.provider).clear();
            this._grid.provider.collectionView.refresh();
        }

        public deactivate(columID: string): void {
            const column = GridAPI.ColumnManager.GetColumnById(columID);

            this._filter.getColumnFilter(column.provider).filterType =
                wijmo.grid.filter.FilterType.None;
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
            action: OSFramework.Event.Actions /*, ctx: any*/
        ): string {
            if (this.isGridFiltered) {
                if (action === OSFramework.Event.Actions.AddRow) {
                    return "Can't add rows when filter is On!";
                }
            }
        }
    }
}
