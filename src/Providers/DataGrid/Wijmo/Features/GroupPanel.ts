// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    class GroupPanelAction extends wijmo.undo.UndoableAction {
        private _grid: wijmo.grid.FlexGrid;

        constructor(
            grid: wijmo.grid.FlexGrid,
            o?: Array<wijmo.collections.PropertyGroupDescription>
        ) {
            super(grid.itemsSource.groupDescriptions);

            this._grid = grid;
            this._oldState = o || [];
        }

        // apply a saved cell value (state)
        public applyState(
            state: Array<wijmo.collections.PropertyGroupDescription>
        ): void {
            this._grid.collectionView.deferUpdate(() => {
                this.target.map(
                    (p) => (this._grid.getColumn(p.propertyName).visible = true)
                );
                this.target.clear();

                state.map((p) => {
                    this.target.push(p);
                    this._grid.getColumn(p.propertyName).visible = false;
                });
            });
            this._grid.focus();
        }

        // close the action saving the new value
        public close(): boolean {
            this._newState = this.target.slice();
            return this._newState !== this._oldState;
        }
    }

    // export class Builder extends Validation implements OSFramework.Interface.IBuilder {
    export class GroupPanel
        implements
            OSFramework.Feature.IGroupPanel,
            OSFramework.Interface.IBuilder,
            OSFramework.Interface.IDisposable
    {
        private _currGroupDescription: Array<wijmo.collections.PropertyGroupDescription>;
        private _grid: Grid.IGridWijmo;
        private _groupPanel: wijmo.grid.grouppanel.GroupPanel;
        private _panelId: string;

        constructor(grid: Grid.IGridWijmo, panelId: string) {
            this._grid = grid;
            this._panelId = panelId;
        }

        private _drop(e: DragEvent) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            if (this._dragCol && this._dragCol.binding.startsWith('$')) return;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            this._dragMarker
                ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore
                  this._moveGroup(this._dragMarker, e)
                : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore
                  this._dragCol && this._addGroup(this._dragCol, e);
        }

        public addColumnsToGroupPanel(bindingList: string): void {
            const groupDescriptions =
                this._grid.provider.collectionView.groupDescriptions; // Group array
            const columnList = JSON.parse(bindingList);
            const source = this._grid.provider.itemsSource;
            source.deferUpdate(() => {
                for (const binding of columnList) {
                    const column = this._grid.getColumn(binding);
                    if (column) {
                        if (
                            this.columnInGroupPanel(column.config.binding) ===
                            false
                        ) {
                            const groupDescription =
                                new wijmo.collections.PropertyGroupDescription(
                                    column.config.binding
                                );

                            groupDescriptions.push(groupDescription);
                            column.provider.visible = false;
                        }
                    } else {
                        throw new Error(
                            OSFramework.Enum.ErrorMessages.InvalidColumnIdentifier
                        );
                    }
                }
            });
        }

        public build(): void {
            // override wijmo's group panel drop in order to prevent calculated columns being grouped
            wijmo.grid.grouppanel.GroupPanel.prototype._drop = this._drop;

            this._groupPanel = new wijmo.grid.grouppanel.GroupPanel(
                OSFramework.Helper.GetElementByUniqueId(this._panelId)
            );
            this._groupPanel.grid = this._grid.provider;
            this._groupPanel.maxGroups = -1;

            this._grid.validatingAction.addHandler(
                this.validateAction.bind(this)
            );

            //this way we can easily handle the "x" to remove items from grouppanel
            this._grid.provider.itemsSource.groupDescriptions.collectionChanged.addHandler(
                (
                    o: wijmo.collections.ObservableArray /*,
                    e: wijmo.collections.NotifyCollectionChangedEventArgs*/
                ) => {
                    //Add and close to the Stack the global value with the last config
                    this._grid.features.undoStack.startAction(
                        new GroupPanelAction(
                            this._grid.provider,
                            this._currGroupDescription
                        )
                    );
                    this._grid.features.undoStack.closeAction(GroupPanelAction);

                    //Updates the global variable wih the current config
                    this._currGroupDescription = o.slice();
                }
            );
        }

        public columnInGroupPanel(binding: string): boolean {
            const groupDescriptions =
                this._grid.provider.collectionView.groupDescriptions; // Group array
            return groupDescriptions.some(
                (element: wijmo.collections.PropertyGroupDescription) =>
                    element.propertyName === binding
            );
        }

        public dispose(): void {
            this._groupPanel.dispose();
            this._groupPanel = undefined;
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public getViewLayout(): any {
            return this._grid.provider.itemsSource.groupDescriptions.map(
                (gd) => {
                    return { property: gd.propertyName };
                }
            );
        }

        public setAggregate(binding: string, aggregate: wijmo.Aggregate): void {
            const column = this._grid.getColumn(binding);

            if (column) {
                if (!wijmo.Aggregate[aggregate]) {
                    throw new Error(
                        OSFramework.Enum.ErrorMessages.Aggregate_NotFound
                    );
                }

                column.provider.aggregate = wijmo.Aggregate[aggregate];
            } else {
                throw new Error(
                    OSFramework.Enum.ErrorMessages.InvalidColumnIdentifier
                );
            }
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public setViewLayout(state: any): void {
            const source = this._grid.provider.itemsSource;
            source.deferUpdate(function () {
                source.groupDescriptions.clear();

                state.groupDescriptions.forEach((element) => {
                    source.groupDescriptions.push(
                        new wijmo.collections.PropertyGroupDescription(
                            element.property
                        )
                    );
                });
            });
        }

        public validateAction(
            action: OSFramework.Event.Grid.Actions /*, ctx: any*/
        ): string {
            if (this.isGridGrouped) {
                if (action === OSFramework.Event.Grid.Actions.AddRow) {
                    return "Can't add rows when group is On!";
                }
            }
        }

        public get isGridGrouped(): boolean {
            return this._grid.provider.itemsSource.groupDescriptions.length > 0;
        }
    }
}
