// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Features {
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

    export interface IGroupPanel extends IValidation {
        isGridGrouped: boolean;
    }

    // export class Builder extends Validation implements IBuilder {
    export class GroupPanel implements IGroupPanel, IBuilder, IDisposable {
        private _currGroupDescription: Array<wijmo.collections.PropertyGroupDescription>;
        private _grid: Grid.IGridWijmo;
        private _groupPanel: wijmo.grid.grouppanel.GroupPanel;
        private _panelId: string;

        constructor(grid: Grid.IGridWijmo, panelId: string) {
            this._grid = grid;
            this._panelId = panelId;
        }

        public build(): void {
            this._groupPanel = new wijmo.grid.grouppanel.GroupPanel(
                Helper.GetElementByUniqueId(this._panelId)
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

        public dispose(): void {
            this._groupPanel.dispose();
            this._groupPanel = undefined;
        }

        public validateAction(
            action: InternalEvents.Actions /*, ctx: any*/
        ): string {
            if (this.isGridGrouped) {
                if (action === InternalEvents.Actions.AddRow) {
                    return "Can't add rows when group is On!";
                }
            }
        }

        public get isGridGrouped(): boolean {
            return this._grid.provider.itemsSource.groupDescriptions.length > 0;
        }
    }
}
