// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    export interface IProviderUndoStack extends IUndoStack {
        closeAction<T>(T);
        pushAction(action: wijmo.undo.UndoableAction);
        startAction(action: wijmo.undo.UndoableAction);
    }

    export class UndoStack implements IProviderUndoStack, IBuilder {
        private _grid: WijmoProvider.Grid.IGridWijmo;
        private _undoStack: wijmo.undo.UndoStack;

        constructor(grid: WijmoProvider.Grid.IGridWijmo) {
            this._grid = grid;
        }

        public get stack(): wijmo.undo.UndoStack {
            return this._undoStack;
        }

        public build(): void {
            this._undoStack = new wijmo.undo.UndoStack(
                Helper.GetElementByWidgetId(this._grid.widgetId),
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

        public startAction(action: wijmo.undo.UndoableAction): void {
            this._undoStack._pendingAction = action;
        }
    }
}
