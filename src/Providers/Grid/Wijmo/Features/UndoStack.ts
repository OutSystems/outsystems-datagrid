// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    export interface IProviderUndoStack extends OSFramework.Feature.IUndoStack {
        closeAction<T>(T);
        pushAction(action: wijmo.undo.UndoableAction);
        startAction(action: wijmo.undo.UndoableAction);
    }

    export class UndoStack
        implements IProviderUndoStack, OSFramework.Interface.IBuilder
    {
        private _grid: Grid.IGridWijmo;
        private _undoStack: wijmo.undo.UndoStack;

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
        }

        private _actionHandler(cb) {
            for (let index = 0; index < this._undoStack.actionCount; index++) {
                cb();
            }
        }

        public get stack(): wijmo.undo.UndoStack {
            return this._undoStack;
        }

        public build(): void {
            this._undoStack = new wijmo.undo.UndoStack(
                OSFramework.Helper.GetElementByWidgetId(this._grid.widgetId),
                {
                    maxActions: 50
                }
            );
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        public closeAction<T>(T): void {
            this._undoStack._pendingAction instanceof T &&
                this._undoStack.pushPendingAction();
            this._grid.provider.focus();
        }

        public pushAction(action: wijmo.undo.UndoableAction): void {
            this._undoStack.pushAction(action);
        }

        public redoAll(): void {
            this._actionHandler(() => {
                this._undoStack.redo();
            });
        }

        public startAction(action: wijmo.undo.UndoableAction): void {
            this._undoStack._pendingAction = action;
        }

        public undoAll(): void {
            this._actionHandler(() => {
                this._undoStack.undo();
            });
        }
    }
}
