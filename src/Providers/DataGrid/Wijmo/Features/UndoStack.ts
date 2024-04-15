// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
	export interface IProviderUndoStack extends OSFramework.DataGrid.Feature.IUndoStack {
		closeAction<T>(T, focusGrid?: boolean);
		pushAction(action: wijmo.undo.UndoableAction);
		startAction(action: wijmo.undo.UndoableAction);
	}

	export class UndoStack implements IProviderUndoStack, OSFramework.DataGrid.Interface.IBuilder {
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
				OSFramework.DataGrid.Helper.GetElementByWidgetId(this._grid.widgetId),
				{
					maxActions: 50,
				}
			);
		}

		public clear(): void {
			this._undoStack.clear();
		}

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
		public closeAction<T>(T, focusGrid = true): void {
			this._undoStack._pendingAction instanceof T && this._undoStack.pushPendingAction();

			// due to Wijmo's breaking change, the Column Picker closes when switch focus to grid
			// so when checking or unchecking an item in Column Picker, we don't want to focus on the grid
			if (focusGrid) this._grid.provider.focus();
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
