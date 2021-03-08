// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Features {
    export interface IColumnSort
        extends IValidation,
            IProviderConfig<boolean>,
            IView {
        isGridSorted: boolean;
    }

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

    export class ColumnSort implements IColumnSort, IBuilder {
        private _enabled: boolean;
        private _grid: Grid.IGridWijmo;

        constructor(grid: Grid.IGridWijmo, enabled: boolean) {
            this._grid = grid;
            this._enabled = enabled;
        }
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public getViewConfig(): any {
            return this._grid.provider.itemsSource.sortDescriptions.map(
                (sortDesc) => {
                    return {
                        property: sortDesc.property,
                        ascending: sortDesc.ascending
                    };
                }
            );
        }
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public setViewConfig(state: any): void {
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

        public get isGridSorted(): boolean {
            return this._grid.provider.itemsSource.sortDescriptions.length > 0;
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
                }

                //Clean all others if shift isn't pressed
                if (!e.data.shiftKey) {
                    s.itemsSource.sortDescriptions
                        .filter((x) => x !== sd)
                        .map((x) => s.itemsSource.sortDescriptions.remove(x));
                }
            });

            if (e.cancel) {
                // Save the final state - When we cancel a sorting event, we need to force undoStack closing
                this._grid.features.undoStack.closeAction(ColumnSortAction);
            }
        }

        public build(): void {
            this._grid.provider.sortingColumn.addHandler(
                this._sortingHandler.bind(this)
            );
            this._grid.validatingAction.addHandler(
                this.validateAction.bind(this)
            );

            this.setState(this._enabled);
        }

        public setState(value: boolean): void {
            this._grid.provider.allowSorting = value
                ? wijmo.grid.AllowSorting.MultiColumn
                : wijmo.grid.AllowSorting.None;
            this._enabled = value;
        }

        public validateAction(
            action: InternalEvents.Actions /*, ctx: any*/
        ): string {
            if (this.isGridSorted) {
                if (action === InternalEvents.Actions.AddRow) {
                    return "Can't add rows when sort mode is On!";
                }
            }
        }
    }
}
