// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Features {
    /**
     * Exposed methods for UndoStack feature
     */
    export interface IUndoStack {
        /**
         * Close a pending action, has to be call after the startAction and after the desired changed
         * @param T  Type of the Pending action, used to verify if the pending action waiting to be closed has the same type
         */
        closeAction<T>(T);
        /**
         * Sometimes we just need to push an action that already define its undo/redo state
         * @param action Action to be pushed into the stack
         */
        pushAction(action: unknown);
        /**
         * Start an action, normally executed before the changes is made
         * @param action Instance of an action
         */
        startAction(action: unknown);
    }

    export interface IProviderUndoStack extends IUndoStack {
        closeAction<T>(T);
        pushAction(action: wijmo.undo.UndoableAction);
        startAction(action: wijmo.undo.UndoableAction);
    }

    export class UndoStack implements IProviderUndoStack, IBuilder {
        private _grid: Grid.IGridWijmo;
        private _undoStack: wijmo.undo.UndoStack;

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
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
