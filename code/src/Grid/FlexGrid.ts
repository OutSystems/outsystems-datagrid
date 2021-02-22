// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Grid {
    export interface IGridWijmo extends IGridGeneric<wijmo.grid.FlexGrid> {}

    export class FlexGrid
        extends AbstractGrid<wijmo.grid.FlexGrid, FlexGridConfig>
        implements IGridWijmo {
        private _fBuilder: Features.FeatureBuilder;
        private _lineIsSingleEntity = false;
        private _rowMetadata: RowMetadata;

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        constructor(gridID: string, configs: any) {
            super(gridID, new FlexGridConfig(configs));
        }

        private _addColumns(cols: Column.IColumn[]): void {
            cols.forEach((col) => {
                this.columns.set(col.config.binding, col);
            });

            this._buildColumns();
        }

        // eslint-disable-next-line @typescript-eslint/member-ordering
        private _buildColumns(): void {
            this.columns.forEach((col) => col.build());
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _getChangesString(itemsChanged: any): string {
            let tempArray = [];

            for (let index = 0; index < itemsChanged.length; ++index) {
                tempArray.push(_.clone(itemsChanged[index]));
                //let's remove our metadata from the information that we'll sent back
                delete tempArray[tempArray.length - 1].__osRowMetada;
            }

            if (this.isSingleEntity) {
                //if the line has a single entity or structure, let's flatten it, so that we avoid the developer
                //when deserializing to need to put in the JSONDeserialize in the target "List Record {ENTITY}" -> would require extra step.
                tempArray = Helper.FlattenArray(tempArray as [JSON]);
            }

            return JSON.stringify(Helper.ToOSFormat(this, tempArray));
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _getProviderConfig(): any {
            if (this.hasColumnsDefined()) {
                this.config.autoGenerateColumns = false;
            }

            this.config.itemsSource = new wijmo.collections.CollectionView([]);
            this.config.itemsSource.trackChanges = true;

            return this.config.getProviderConfig();
        }

        /**
         * Parse JSON and get the structure of the new item.
         * @param json
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _parseNewItem(json: JSON): any {
            const parsedNewItem = _.cloneDeep(json);
            const converter = (object) => {
                Object.keys(object).forEach((key) => {
                    if (typeof object[key] === 'object') converter(object[key]);
                    else object[key] = undefined;
                });
            };

            converter(parsedNewItem);

            return parsedNewItem;
        }

        public get autoGenerate(): boolean {
            return this.provider.autoGenerateColumns;
        }

        public set autoGenerate(value: boolean) {
            this.provider.autoGenerateColumns = value;
        }

        //TODO: [RGRIDT-635] refactor this code.
        public get isSingleEntity(): boolean {
            return this._lineIsSingleEntity;
        }

        public get rowMetadata(): IRowMetadata {
            return this._rowMetadata;
        }

        public addColumn(col: Column.IColumn): void {
            super.addColumn(col);

            if (this.isReady) {
                //OS takes a while to set the WidgetId
                setTimeout(() => {
                    col.build();
                }, 0);
            }
        }

        public build(): void {
            super.build();

            this._provider = new wijmo.grid.FlexGrid(
                Helper.GetElementByUniqueId(this.uniqueId),
                this._getProviderConfig()
            );
            this._rowMetadata = new RowMetadata(this._provider);

            this.buildFeatures();

            this._buildColumns();

            this.finishBuild();
        }

        public buildFeatures(): void {
            this._fBuilder = new Features.FeatureBuilder(this);

            this._fBuilder
                .makeDirtyMark()
                .makeFilter(this.config.allowFiltering)
                .makeFreezePanes()
                .makeContextMenu()
                .makeRows()
                .makeExport()
                .makeGroupPanel(this.config.groupPanelId)
                .makeColumnPicker()
                .makeToolTip()
                .makePagination(this.config.rowsPerPage)
                .makeSort(this.config.allowColumnSort)
                .makeColumnReorder(this.config.allowColumnReorder)
                .makeColumnResize(this.config.allowColumnResize)
                .makeTabNavigation(this.config.allowKeyTabNavigation)
                .makeAutoRowNumber()
                .makeStyling(this.config.rowHeight)
                .makeUndoStack()
                .makeSelection(
                    this.config.allowRowSelector,
                    this.config.selectionMode
                )
                .build();

            this._features = this._fBuilder.features;
        }

        public changeColumnProperty(
            columnID: string,
            propertyName: string,
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
            propertyValue: any
        ): void {
            let column = this.columns.get(columnID);

            if (!column) {
                //Try to search using other Ids
                column = _.toArray(this.columns)
                    .map((p) => p[1])
                    .find((p) => p && p.equalsToID(columnID));
            }

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
            const propValue = OS_Config_Grid[propertyName];

            switch (propValue) {
                case OS_Config_Grid.allowColumnSort:
                    return this.features.sort.setState(value);
                case OS_Config_Grid.allowFiltering:
                    return this.features.filter.setState(value);
                case OS_Config_Grid.rowsPerPage:
                    return this.features.pagination.changePageSize(value);
                case OS_Config_Grid.rowHeight:
                    return this.features.styling.changeRowHeight(value);
                case OS_Config_Grid.allowColumnReorder:
                    return this.features.columnReorder.setState(value);
                case OS_Config_Grid.allowColumnResize:
                    return this.features.columnResize.setState(value);
                case OS_Config_Grid.allowKeyTabNavigation:
                    return this.features.tabNavigation.setState(value);
                case OS_Config_Grid.allowEdit:
                    this._provider.isReadOnly = value === false;
                    return;
                case OS_Config_Grid.selectionMode:
                    this.features.selection.setState(value);
                    return;
                default:
                    throw Error(
                        `changeProperty - Property '${propertyName}' can't be changed.`
                    );
            }
        }
        public clearAllChanges(): void {
            if (this.isReady) {
                this.provider.itemsSource.clearChanges();
                this.features.dirtyMark.clear();
            }
        }
        public dispose(): void {
            super.dispose();

            this._fBuilder.dispose();

            this._provider.dispose();
            this._provider = undefined;
        }

        public getChangesMade(): changesDone {
            const changes: changesDone = {
                hasChanges: false,
                addedLinesJSON: undefined,
                editedLinesJSON: undefined,
                removedLinesJSON: undefined
            };

            if (this.isReady) {
                const itemsSource = this.provider.itemsSource;

                if (itemsSource.itemsAdded.length > 0) {
                    changes.hasChanges = true;
                    changes.addedLinesJSON = this._getChangesString(
                        itemsSource.itemsAdded
                    );
                }

                if (itemsSource.itemsEdited.length > 0) {
                    changes.hasChanges = true;
                    changes.editedLinesJSON = this._getChangesString(
                        itemsSource.itemsEdited
                    );
                }

                if (itemsSource.itemsRemoved.length > 0) {
                    changes.hasChanges = true;
                    changes.removedLinesJSON = this._getChangesString(
                        itemsSource.itemsRemoved
                    );
                }
            }
            return changes;
        }

        public getData(): JSON[] {
            return this.provider.itemsSource.sourceCollection;
        }

        public hasResults(): boolean {
            return this._provider.collectionView.isEmpty === false;
        }

        public setCellError(/*binding: string, row: number, message: string*/): void {
            throw new Error('Method not implemented.');
        }

        public setData(data: string): boolean {
            // Use with a Date reviver to restore date fields
            const infojson = Helper.JSONParser(data);
            const hasMetainfo = Column.Generator.HasMetadata(infojson);
            let gridData = hasMetainfo ? infojson.data : infojson;

            if (this.isReady) {
                if (gridData.length > 0) {
                    //if the grid we have data, lets see if a line has more than one "entity" per line.
                    this._lineIsSingleEntity =
                        Object.keys(gridData[0]).length === 1;
                }
                if (!this.hasColumnsDefined()) {
                    //let's auto generate the columns
                    if (hasMetainfo) {
                        //if we have meta information about the columns, let's NOT use wijmo generator
                        this.autoGenerate = false;
                        const generated = Column.Generator.ColumnGenerator(
                            this,
                            infojson,
                            this.config.allowEdit
                        );
                        if (generated.length > 0) {
                            this._addColumns(generated);
                        }
                        this.features.rows.setNewItem(
                            this._parseNewItem(infojson.metadata)
                        );
                    } else {
                        //if the grid is read-only, then we'll flatten the array and use wijmo generator
                        if (this.provider.isReadOnly) {
                            gridData = Helper.FlattenArray(gridData);
                        } else {
                            //if the grid is marked as editable, and is to be auto generated, we do not support (because of the save)
                            throw new Error(
                                'You cannot use JSONSerialize and make the grid editable. Please use ArrangeData action for this scenario.'
                            );
                        }
                    }
                } else {
                    if (hasMetainfo) {
                        this.features.rows.setNewItem(
                            this._parseNewItem(infojson.metadata)
                        );
                    } else {
                        // If it hasn't meta info, then we need to get the first data.
                        // Mandatory: Needs to have data (1 row at least)
                        if (infojson.length > 0) {
                            this.features.rows.setNewItem(
                                this._parseNewItem(infojson[0])
                            );
                        }
                    }
                }

                this.provider.itemsSource.sourceCollection = gridData;
                return true;
            }

            return false;
        }
    }
}
