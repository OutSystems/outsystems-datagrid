// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    class ColumnSortAction extends wijmo.undo.UndoableAction {
        constructor(s: wijmo.grid.FlexGrid) {
            super(s);

            this._oldState = s.itemsSource.sortDescriptions.slice();
        }

        // apply a saved cell value (state)
        public applyState(state: []): void {
            const n = this._target.collectionView;
            n &&
                n.deferUpdate(() => {
                    const e = n.sortDescriptions;
                    e.clear();
                    state.forEach((t) => e.push(t));
                });
            this._target.focus();
        }

        // close the action saving the new value
        public close(): boolean {
            this._newState = this.target.itemsSource.sortDescriptions.slice();
            return this._newState !== this._oldState;
        }
    }

    export class ColumnSort
        implements
            OSFramework.Feature.IColumnSort,
            OSFramework.Interface.IBuilder
    {
        private _enabled: boolean;
        private _grid: Grid.IGridWijmo;
        private _hasUnsortState = true;

        constructor(grid: Grid.IGridWijmo, enabled: boolean) {
            this._grid = grid;
            this._enabled = enabled;
        }

        public get isGridSorted(): boolean {
            return this._grid.provider.itemsSource.sortDescriptions.length > 0;
        }

        /**
         * Converts wijmo sortDescriptions into our ActiveSort structure
         * @param sortDescriptions wijmo sort descriptions
         * @returns Array of ActiveSort
         */
        private _makeActiveSort(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            sortDescriptions: any
        ): Array<OSFramework.OSStructure.ActiveSort> {
            const activeSorts = new Array<OSFramework.OSStructure.ActiveSort>();

            if (sortDescriptions && sortDescriptions.length) {
                sortDescriptions.map((sd) => {
                    const sort = new OSFramework.OSStructure.ActiveSort();
                    const column = this._grid.getColumn(sd.property);
                    sort.binding = sd.property;
                    sort.columnId = (column && column.widgetId) || '';
                    sort.sorting = sd.ascending
                        ? OSFramework.OSStructure.Sorting.Ascending
                        : OSFramework.OSStructure.Sorting.Descending;

                    activeSorts.push(sort);
                });
            }

            return activeSorts;
        }

        /**
         * Does the reset of the sorting on the third click.
         *
         * @private
         * @param {wijmo.grid.FlexGrid} s
         * @param {wijmo.grid.CellRangeEventArgs} e
         * @memberof ColumnSort
         */
        private _sortedHandler(
            s: wijmo.grid.FlexGrid,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            e: wijmo.grid.CellRangeEventArgs
        ) {
            const col = s.getColumn(e.col);
            const index = col.currentSortIndex;
            const sd = s.itemsSource.sortDescriptions[index];
            //Clean all others if shift isn't pressed
            if (!e.data.shiftKey) {
                s.itemsSource.sortDescriptions
                    .filter((x) => x !== sd)
                    .map((x) => s.itemsSource.sortDescriptions.remove(x));
            }

            if (
                this._grid.gridEvents.hasHandlers(
                    OSFramework.Event.Grid.GridEventType.OnSortChange
                )
            ) {
                this._grid.gridEvents.trigger(
                    OSFramework.Event.Grid.GridEventType.OnSortChange,
                    this._grid,
                    this._makeActiveSort(s.itemsSource.sortDescriptions)
                );
            }
        }

        /**
         * Does the reset of the sorting on the third click.
         *
         * @private
         * @param {wijmo.grid.FlexGrid} s
         * @param {wijmo.grid.CellRangeEventArgs} e
         * @memberof ColumnSort
         */
        private _sortingHandler(
            s: wijmo.grid.FlexGrid,
            e: wijmo.grid.CellRangeEventArgs
        ) {
            const col = s.getColumn(e.col);
            const index = col.currentSortIndex;
            const sd = s.itemsSource.sortDescriptions[index];

            if (this._hasUnsortState) {
                s.itemsSource.deferUpdate(() => {
                    //Remove on the third click (or when its sort on desc mode)
                    if (sd && !sd.ascending) {
                        //Add current state before remove it
                        this._grid.features.undoStack.startAction(
                            new ColumnSortAction(this._grid.provider)
                        );

                        //Remove on the third click
                        s.itemsSource.sortDescriptions.splice(index, 1);

                        //Cancel the default behavior
                        e.cancel = true;

                        this._grid.gridEvents.trigger(
                            OSFramework.Event.Grid.GridEventType.OnSortChange,
                            this._grid,
                            this._makeActiveSort(s.itemsSource.sortDescriptions)
                        );
                    }
                });
            }

            if (e.cancel) {
                // Save the final state - When we cancel a sorting event, we need to force undoStack closing
                this._grid.features.undoStack.closeAction(ColumnSortAction);
            }
        }

        public build(): void {
            this._grid.provider.sortingColumn.addHandler(
                this._sortingHandler.bind(this)
            );
            this._grid.provider.sortedColumn.addHandler(
                this._sortedHandler.bind(this)
            );
            this._grid.validatingAction.addHandler(
                this.validateAction.bind(this)
            );

            this.setState(this._enabled);
        }

        /**
         *Function that clears sort of grid
         */
        public clear(): void {
            this._grid.provider.collectionView.sortDescriptions.clear();
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public getViewLayout(): any {
            return this._grid.provider.itemsSource.sortDescriptions.map(
                (sortDesc) => {
                    return {
                        property: sortDesc.property,
                        ascending: sortDesc.ascending
                    };
                }
            );
        }

        public isColumnSorted(columnID: string): boolean {
            const column = this._grid.getColumn(columnID);

            if (!column) return false;

            return (
                this._grid.provider.itemsSource.sortDescriptions.find(
                    (col) => col.property === column.config.binding
                ) !== undefined
            );
        }

        public setState(value: boolean): void {
            this._grid.provider.allowSorting = value
                ? wijmo.grid.AllowSorting.MultiColumn
                : wijmo.grid.AllowSorting.None;
            this._enabled = value;
        }

        public setUnsortState(state: boolean): void {
            this._hasUnsortState = state;
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public setViewLayout(state: any): void {
            const source = this._grid.provider.itemsSource;
            source.deferUpdate(function () {
                source.sortDescriptions.clear();
                for (let i = 0; i < state.sortDescriptions.length; i++) {
                    const sortDesc = state.sortDescriptions[i];
                    source.sortDescriptions.push(
                        new wijmo.collections.SortDescription(
                            sortDesc.property,
                            sortDesc.ascending
                        )
                    );
                }
            });
        }
        /**
         *Function that sorts a Grid column based in its ID and on a sorting
         *
         * @param {string} columnID
         * @param {OSFramework.OSStructure.Sorting} sorting
         * @memberof ColumnSort
         */
        public sortColumn(
            columnID: string,
            sorting: OSFramework.OSStructure.Sorting
        ): void {
            const column = this._grid.getColumn(columnID);
            const ascending =
                OSFramework.OSStructure.Sorting[sorting] ===
                OSFramework.OSStructure.Sorting.Ascending;

            if (column) {
                // check if column has sort active
                const existingColumnSort =
                    this._grid.provider.itemsSource.sortDescriptions.find(
                        (sd) => sd.property === column.config.binding
                    );
                // if there is sort active on column, we must remove it
                if (existingColumnSort) {
                    this._grid.provider.itemsSource.sortDescriptions.remove(
                        existingColumnSort
                    );
                }

                this._grid.provider.itemsSource.sortDescriptions.push(
                    new wijmo.collections.SortDescription(
                        column.config.binding,
                        ascending
                    )
                );
            } else {
                throw new Error(
                    OSFramework.Enum.ErrorMessages.InvalidColumnIdentifier
                );
            }
        }

        public validateAction(
            action: OSFramework.Event.Grid.Actions /*, ctx: any*/
        ): string {
            if (this.isGridSorted) {
                if (action === OSFramework.Event.Grid.Actions.AddRow) {
                    return "Can't add rows when sort mode is On!";
                }
            }
        }
    }
}
