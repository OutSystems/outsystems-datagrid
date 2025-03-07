// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
	class GroupPanelAction extends wijmo.undo.UndoableAction {
		private _grid: wijmo.grid.FlexGrid;

		constructor(grid: wijmo.grid.FlexGrid, o?: Array<wijmo.collections.PropertyGroupDescription>) {
			super(grid.itemsSource.groupDescriptions);

			this._grid = grid;
			this._oldState = o || [];
		}

		// apply a saved cell value (state)
		public applyState(state: Array<wijmo.collections.PropertyGroupDescription>): void {
			this._grid.collectionView.deferUpdate(() => {
				this.target.map((p) => (this._grid.getColumn(p.propertyName).visible = true));
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

	// export class Builder extends Validation implements OSFramework.DataGrid.Interface.IBuilder {
	export class GroupPanel
		implements
			OSFramework.DataGrid.Feature.IGroupPanel,
			OSFramework.DataGrid.Interface.IBuilder,
			OSFramework.DataGrid.Interface.IDisposable
	{
		private _currGroupDescription: Array<wijmo.collections.PropertyGroupDescription>;
		private _grid: Grid.IGridWijmo;
		private _groupPanel: wijmo.grid.grouppanel.GroupPanel;
		private _panelId: string;

		constructor(grid: Grid.IGridWijmo, panelId: string) {
			this._grid = grid;
			this._panelId = panelId;
			this._currGroupDescription = new Array<wijmo.collections.PropertyGroupDescription>();
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
			const groupDescriptions = this._grid.provider.collectionView.groupDescriptions; // Group array
			const columnList = JSON.parse(bindingList);
			const source = this._grid.provider.itemsSource;
			source.deferUpdate(() => {
				for (const binding of columnList) {
					const column = this._grid.getColumn(binding);
					if (column) {
						if (this.columnInGroupPanel(column.config.binding) === false) {
							const groupDescription = new wijmo.collections.PropertyGroupDescription(
								column.config.binding
							);

							groupDescriptions.push(groupDescription);
							column.provider.visible = false;
						}
					} else {
						throw new Error(OSFramework.DataGrid.Enum.ErrorMessages.InvalidColumnIdentifier);
					}
				}
			});
		}

		public build(): void {
			// override wijmo's group panel drop in order to prevent calculated columns being grouped
			wijmo.grid.grouppanel.GroupPanel.prototype._drop = this._drop;

			this._groupPanel = new wijmo.grid.grouppanel.GroupPanel(
				OSFramework.DataGrid.Helper.GetElementByUniqueId(this._panelId)
			);
			this._groupPanel.grid = this._grid.provider;
			this._groupPanel.maxGroups = -1;

			this._grid.validatingAction.addHandler(this.validateAction.bind(this));

			//this way we can easily handle the "x" to remove items from grouppanel
			this._grid.provider.itemsSource.groupDescriptions.collectionChanged.addHandler(
				(
					o: wijmo.collections.ObservableArray /*,
                    e: wijmo.collections.NotifyCollectionChangedEventArgs*/
				) => {
					const grid = this._grid;

					//Add and close to the Stack the global value with the last config
					grid.features.undoStack.startAction(
						new GroupPanelAction(grid.provider, this._currGroupDescription)
					);
					grid.features.undoStack.closeAction(GroupPanelAction);

					const oldGroupDescription = this._currGroupDescription;

					// Workaround for HTML tags and encoded symbols being exported in CSV when the Grid present Grouped Columns. (WJM-35579)
					// Loop through the columns just added to the Group Panel and set isContentHtml to true.
					o.forEach(function (groupDesc: wijmo.collections.PropertyGroupDescription) {
						if (!oldGroupDescription.includes(groupDesc)) {
							const col = grid.provider.getColumn(groupDesc.propertyName);
							if (col) {
								col.isContentHtml = true;
							}
						}
					});

					// Loop through the group descriptions just removed from the Group Panel and set isContentHtml to false.
					oldGroupDescription.forEach(function (groupDesc: wijmo.collections.PropertyGroupDescription) {
						if (!o.includes(groupDesc)) {
							const col = grid.provider.getColumn(groupDesc.propertyName);
							if (col) {
								col.isContentHtml = false;
							}
						}
					});

					//Updates the global variable wih the current config
					this._currGroupDescription = o.slice();
				}
			);
		}

		public columnInGroupPanel(binding: string): boolean {
			const groupDescriptions = this._grid.provider.collectionView.groupDescriptions; // Group array
			return groupDescriptions.some(
				(element: wijmo.collections.PropertyGroupDescription) => element.propertyName === binding
			);
		}

		public dispose(): void {
			this._groupPanel.dispose();
			this._groupPanel = undefined;
		}

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		public getViewLayout(): any {
			return this._grid.provider.itemsSource.groupDescriptions.map((gd) => {
				return { property: gd.propertyName };
			});
		}

		public removeColumnsFromGroupPanel(bindingList: string): void {
			const groupDescriptions = this._grid.provider.collectionView.groupDescriptions; // Group array
			const columnList = JSON.parse(bindingList);
			const source = this._grid.provider.itemsSource;

			source.deferUpdate(() => {
				for (const binding of columnList) {
					const column = this._grid.getColumn(binding);
					if (column) {
						// Find the index of the group description for the column's binding
						const index = groupDescriptions.findIndex((gd) => {
							if (gd instanceof wijmo.collections.PropertyGroupDescription) {
								return gd.propertyName === column.config.binding;
							}
							return false;
						});

						// If the group description exists, remove it
						if (index > -1) {
							groupDescriptions.splice(index, 1);
							// Make the column visible again
							column.provider.visible = true;
						}
					} else {
						throw new Error(OSFramework.DataGrid.Enum.ErrorMessages.InvalidColumnIdentifier);
					}
				}
			});
		}

		public setAggregate(binding: string, aggregate: wijmo.Aggregate): void {
			const column = this._grid.getColumn(binding);

			if (column) {
				if (!wijmo.Aggregate[aggregate]) {
					throw new Error(OSFramework.DataGrid.Enum.ErrorMessages.Aggregate_NotFound);
				}

				column.provider.aggregate = aggregate;
			} else {
				throw new Error(OSFramework.DataGrid.Enum.ErrorMessages.InvalidColumnIdentifier);
			}
		}

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		public setViewLayout(state: any): void {
			const source = this._grid.provider.itemsSource;
			source.deferUpdate(function () {
				source.groupDescriptions.clear();

				state.groupDescriptions.forEach((element) => {
					source.groupDescriptions.push(new wijmo.collections.PropertyGroupDescription(element.property));
				});
			});
		}

		public validateAction(action: OSFramework.DataGrid.Event.Grid.Actions /*, ctx: any*/): string {
			if (this.isGridGrouped) {
				if (action === OSFramework.DataGrid.Event.Grid.Actions.AddRow) {
					return "Can't add rows when group is On!";
				}
			}
		}

		public get isGridGrouped(): boolean {
			return this._grid.provider.itemsSource.groupDescriptions.length > 0;
		}
	}
}
