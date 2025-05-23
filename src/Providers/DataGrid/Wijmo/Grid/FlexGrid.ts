// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Grid {
	export class FlexGrid
		extends OSFramework.DataGrid.Grid.AbstractGrid<
			wijmo.grid.FlexGrid,
			OSFramework.DataGrid.Configuration.Grid.FlexGridConfig
		>
		implements IGridWijmo
	{
		private _fBuilder: Feature.FeatureBuilder;

		private _resizedColumnHandler: OSFramework.DataGrid.Callbacks.Generic;
		private _rowMetadata: RowMetadata;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(gridID: string, configs: any) {
			super(
				gridID,
				new OSFramework.DataGrid.Configuration.Grid.FlexGridConfig(configs),
				new Grid.ProviderDataSource(),
				new Column.ColumnGenerator()
			);
		}

		/**
		 * This action performs a workaround for an issue related with
		 * Safari 14.* version. The paint doesn't get triggered by the
		 * scroll on the grid.
		 *
		 * @private
		 * @memberof FlexGrid
		 */
		private _safari14workaround(): void {
			if (/^((?!chrome|android).).*Version\/14.*safari/i.test(navigator.userAgent)) {
				this._provider.updatedView.addHandler(
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					(grid: wijmo.grid.FlexGrid, e: wijmo.EventArgs) => {
						//removes previous tranform
						grid._root.style.transform = '';
						//this is the "fake" transform that forces Safari to repaint the grid area
						grid._root.style.transform = 'translateZ(0)';
					}
				);
				console.log('The fix for Safari 14 has been applied.');
			}
		}

		// eslint-disable-next-line @typescript-eslint/member-ordering
		private _buildColumns(): void {
			this.getColumns().forEach((col) => col.build());
		}

		// Remove rows with given keys from data source
		private _clearDataSourceByKeys(rowKeys) {
			rowKeys.forEach((element) => {
				const row = this.provider.rows.find(
					(item) => _.get(item.dataItem, this.config.keyBinding).toString() === element
				);
				if (!row) {
					throw new Error(OSFramework.DataGrid.Enum.ErrorMessages.Row_NotFound);
				}
				this._provider.itemsSource.itemsEdited.remove(row.dataItem);
				this._provider.itemsSource.itemsRemoved.remove(row.dataItem);
				this._provider.itemsSource.itemsAdded.remove(row.dataItem);
			});
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _getProviderConfig(): any {
			if (this.hasColumnsDefined()) {
				this.config.autoGenerateColumns = false;
			}

			return this.config.getProviderConfig();
		}

		private _updateColumnWidth(grid: wijmo.grid.FlexGrid, event: wijmo.grid.CellRangeEventArgs): void {
			const columnProvider = event.getColumn();
			const columnOS = this.getColumn(columnProvider.binding);
			if (columnOS) {
				columnOS.config.width = columnProvider.width;
			}
		}

		public get autoGenerate(): boolean {
			return this.provider.autoGenerateColumns;
		}

		public set autoGenerate(value: boolean) {
			this.provider.autoGenerateColumns = value;
		}

		public get rowMetadata(): OSFramework.DataGrid.Interface.IRowMetadata {
			return this._rowMetadata;
		}

		public addColumn(col: OSFramework.DataGrid.Column.IColumn): Promise<void> {
			super.addColumn(col);

			if (this.isReady) {
				//OS takes a while to set the WidgetId
				return OSFramework.DataGrid.Helper.AsyncInvocationPromise(col.build.bind(col));
			}
		}

		public build(): void {
			super.build();

			this._provider = new wijmo.grid.FlexGrid(
				OSFramework.DataGrid.Helper.GetElementByUniqueId(this.uniqueId),
				this._getProviderConfig()
			);
			this._provider.itemsSource = this.dataSource.getProviderDataSource();
			this._rowMetadata = new RowMetadata(this._provider, this.config);

			this.buildFeatures();

			this._buildColumns();

			this._provider.itemsSource.calculatedFields = this.features.calculatedField.calculatedFields;

			this._resizedColumnHandler = this._updateColumnWidth.bind(this);
			this._provider.resizedColumn.addHandler(this._resizedColumnHandler);

			this._safari14workaround();

			this.finishBuild();
		}

		public buildFeatures(): void {
			this._fBuilder = new Feature.FeatureBuilder(this);

			this._features = this._fBuilder.features;

			this._fBuilder.build();
		}

		public changeColumnProperty(
			columnID: string,
			propertyName: string,
			// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
			propertyValue: any
		): void {
			const column = this.getColumn(columnID);

			if (!column) {
				console.log(
					`changeColumnProperty - column id:${columnID} not found. \nAutogenerated colums won't work here!`
				);
			} else {
				column.changeProperty(propertyName, propertyValue);
			}
		}

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		public changeProperty(propertyName: string, value: any): void {
			const propValue = OSFramework.DataGrid.Enum.OS_Config_Grid[propertyName];

			switch (propValue) {
				case OSFramework.DataGrid.Enum.OS_Config_Grid.allowColumnSort:
					return this.features.sort.setState(value);
				case OSFramework.DataGrid.Enum.OS_Config_Grid.allowFiltering:
					return this.features.filter.setState(value);
				case OSFramework.DataGrid.Enum.OS_Config_Grid.rowsPerPage:
					return this.features.pagination.changePageSize(value);
				case OSFramework.DataGrid.Enum.OS_Config_Grid.rowHeight:
					return this.features.styling.changeRowHeight(value);
				case OSFramework.DataGrid.Enum.OS_Config_Grid.allowColumnReorder:
					return this.features.gridReorder.setState(value);
				case OSFramework.DataGrid.Enum.OS_Config_Grid.allowColumnResize:
					return this.features.columnResize.setState(value);
				case OSFramework.DataGrid.Enum.OS_Config_Grid.allowKeyTabNavigation:
					return this.features.tabNavigation.setState(value);
				case OSFramework.DataGrid.Enum.OS_Config_Grid.allowEdit:
					this._provider.isReadOnly = value === false;
					return;
				case OSFramework.DataGrid.Enum.OS_Config_Grid.selectionMode:
					this.features.selection.setState(value);
					return;
				case OSFramework.DataGrid.Enum.OS_Config_Grid.showAggregateValues:
					this.features.columnAggregate.setState(value);
					return;
				default:
					throw Error(`changeProperty - Property '${propertyName}' can't be changed.`);
			}
		}
		/**
		 * Function that will mark all changes as saved.
		 *
		 * @param {boolean} forceClearValidationMarks determines whether or not we should clean the validation marks.
		 * @memberof FlexGrid
		 */
		public clearAllChanges(forceClearValidationMarks: boolean): void {
			if (this.isReady) {
				this.dataSource.clear();
				if (forceClearValidationMarks) {
					this.features.validationMark.clear();
					this.features.dirtyMark.clear();
				} else {
					const rowList = this._provider.itemsSource as wijmo.collections.CollectionView;
					rowList.sourceCollection.forEach((element) => {
						if (this.features.validationMark.isInvalidRow(element) === false) {
							this.features.dirtyMark.clearPropertyInRow(element);
						}
					});
				}
			}
		}
		/**
		 * Mark a group of Data Grid lines with given keys (from the KeyBinding field) as saved in the database.
		 *
		 * @param {Array<string>} rowKeys List of row identifiers on the KeyBinding field.
		 * @param {boolean} forceClearValidationMarks determines whether or not we should clean the validation marks.
		 * @memberof FlexGrid
		 */
		public clearAllChangesByRowKeys(rowKeys: Array<string>, forceClearValidationMarks: boolean): void {
			//if the row keys array is empty we will throw an error
			if (rowKeys.length === 0) {
				throw new Error(OSFramework.DataGrid.Enum.ErrorMessages.Row_EmptyList);
			}
			//if the row keys array as empty keys we will throw an error
			if (rowKeys.indexOf('') > -1 || rowKeys.indexOf(null) > -1 || rowKeys.indexOf(undefined) > -1) {
				throw new Error(OSFramework.DataGrid.Enum.ErrorMessages.Row_ListEmptyValues);
			}

			if (this.isReady) {
				this._clearDataSourceByKeys(rowKeys);

				if (forceClearValidationMarks) {
					this.features.validationMark.clearByRowKeys(rowKeys);
					this.features.dirtyMark.clearByRowKeys(rowKeys);
				} else {
					rowKeys.forEach((element) => {
						const row = this.provider.rows.findIndex(
							(item) => _.get(item.dataItem, this.config.keyBinding).toString() === element
						);

						if (row === -1) {
							throw new Error(OSFramework.DataGrid.Enum.ErrorMessages.Row_NotFound);
						}

						if (this.features.validationMark.isInvalidRowByKey(element) === false) {
							this.features.dirtyMark.clearPropertyInRowByKey(element);
						}
					});
				}
			}
		}

		public clearChanges(): void {
			if (this.isReady) {
				this.features.undoStack.undoAll();
				this.dataSource.clear();
				this.features.validationMark.clear();
			}
		}

		public dispose(): void {
			super.dispose();

			this._fBuilder.dispose();

			this._provider.resizedColumn.removeHandler(this._resizedColumnHandler);

			this._provider.dispose();
			this._provider = undefined;
		}

		public getChangesMade(): OSFramework.DataGrid.OSStructure.GridChanges {
			// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
			const changes = this.dataSource.getChanges(OSFramework.DataGrid.OSStructure.GridChanges);

			if (this._features.validationMark.invalidRows.size > 0) {
				changes.hasInvalidLines = true;
				changes.invalidLinesJSON = this.dataSource.toOSFormat(
					Array.from(this._features.validationMark.invalidRows)
				);
			}

			return changes;
		}

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		public getViewLayout(): string {
			return this._features.view.getViewLayout();
		}

		public setCellError(/*binding: string, row: number, message: string*/): void {
			throw new Error('Method not implemented.');
		}

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		public setViewLayout(state: any): any {
			if (this.isReady) {
				return this._features.view.setViewLayout(state);
			}
		}
	}
}
