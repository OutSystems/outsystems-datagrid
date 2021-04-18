// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Grid {
    export class FlexGrid
        extends OSFramework.Grid.AbstractGrid<
            wijmo.grid.FlexGrid,
            OSFramework.Configuration.Grid.FlexGridConfig
        >
        implements IGridWijmo {
        private _fBuilder: WijmoProvider.Feature.FeatureBuilder;
        private _lineIsSingleEntity = false;
        private _rowMetadata: RowMetadata;

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        constructor(gridID: string, configs: any) {
            super(
                gridID,
                new OSFramework.Configuration.Grid.FlexGridConfig(configs)
            );
        }

        private _addColumns(cols: OSFramework.Column.IColumn[]): void {
            cols.forEach((col) => {
                super.addColumn(col);
            });

            this._buildColumns();
        }

        // eslint-disable-next-line @typescript-eslint/member-ordering
        private _buildColumns(): void {
            this.getColumns().forEach((col) => col.build());
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _getChangesString(itemsChanged: any): string {
            let tempArray = [];

            for (let index = 0; index < itemsChanged.length; ++index) {
                tempArray.push(_.cloneDeep(itemsChanged[index]));
            }

            //In-place convert data to Outsystems Format
            OSFramework.Helper.ToOSFormat(this, tempArray);

            if (this.isSingleEntity) {
                //if the line has a single entity or structure, let's flatten it, so that we avoid the developer
                //when deserializing to need to put in the JSONDeserialize in the target "List Record {ENTITY}" -> would require extra step.
                tempArray = OSFramework.Helper.FlattenArray(
                    tempArray as [JSON]
                );
            }

            return JSON.stringify(tempArray);
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

        public get rowMetadata(): OSFramework.Interface.IRowMetadata {
            return this._rowMetadata;
        }

        public addColumn(col: OSFramework.Column.IColumn): void {
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
                OSFramework.Helper.GetElementByUniqueId(this.uniqueId),
                this._getProviderConfig()
            );
            this._rowMetadata = new RowMetadata(this._provider);

            this.buildFeatures();

            this._buildColumns();

            this.finishBuild();
        }

        public buildFeatures(): void {
            this._fBuilder = new WijmoProvider.Feature.FeatureBuilder(this);

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
            const propValue = OSFramework.Enum.OS_Config_Grid[propertyName];

            switch (propValue) {
                case OSFramework.Enum.OS_Config_Grid.allowColumnSort:
                    return this.features.sort.setState(value);
                case OSFramework.Enum.OS_Config_Grid.allowFiltering:
                    return this.features.filter.setState(value);
                case OSFramework.Enum.OS_Config_Grid.rowsPerPage:
                    return this.features.pagination.changePageSize(value);
                case OSFramework.Enum.OS_Config_Grid.rowHeight:
                    return this.features.styling.changeRowHeight(value);
                case OSFramework.Enum.OS_Config_Grid.allowColumnReorder:
                    return this.features.columnReorder.setState(value);
                case OSFramework.Enum.OS_Config_Grid.allowColumnResize:
                    return this.features.columnResize.setState(value);
                case OSFramework.Enum.OS_Config_Grid.allowKeyTabNavigation:
                    return this.features.tabNavigation.setState(value);
                case OSFramework.Enum.OS_Config_Grid.allowEdit:
                    this._provider.isReadOnly = value === false;
                    return;
                case OSFramework.Enum.OS_Config_Grid.selectionMode:
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
                this.features.validationMark.clear();
            }
        }
        public dispose(): void {
            super.dispose();

            this._fBuilder.dispose();

            this._provider.dispose();
            this._provider = undefined;
        }

        public getChangesMade(): OSFramework.OSStructure.changesDone {
            const changes: OSFramework.OSStructure.changesDone = {
                hasChanges: false,
                addedLinesJSON: undefined,
                editedLinesJSON: undefined,
                removedLinesJSON: undefined,
                hasInvalidLines: false,
                invalidLinesJSON: undefined
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

                if (this._features.validationMark.invalidRows.length > 0) {
                    changes.hasInvalidLines = true;
                    changes.invalidLinesJSON = this._getChangesString(
                        this._features.validationMark.invalidRows
                    );
                }
            }
            return changes;
        }

        public getData(): JSON[] {
            return this.provider.itemsSource.sourceCollection;
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public getViewLayout(): any {
            return this._features.view.getViewLayout();
        }

        public hasResults(): boolean {
            return this._provider.collectionView.isEmpty === false;
        }

        public setCellError(/*binding: string, row: number, message: string*/): void {
            throw new Error('Method not implemented.');
        }

        public setData(data: string): boolean {
            // Use with a Date reviver to restore date fields
            const infojson = OSFramework.Helper.JSONParser(data);
            const hasMetainfo = WijmoProvider.Column.Generator.HasMetadata(
                infojson
            );
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
                        const generated = WijmoProvider.Column.Generator.ColumnGenerator(
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
                            gridData = OSFramework.Helper.FlattenArray(
                                gridData
                            );
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
                        // Check if the binding from the custom columns exist on the metadata from the original data source.
                        this.getColumns().forEach((column) => {
                            if (column.config.validateBinding === false) return;
                            // Split the binding of the column by every dot. (e.g Sample_product.Name -> ['Sample_Product', 'Name'])
                            const bindingMatches = column.config.binding.split(
                                '.'
                            );
                            let metadata = infojson.metadata;
                            bindingMatches.forEach((keyword) => {
                                // Check if the matching keyword is a property from metadata
                                if (
                                    metadata &&
                                    !metadata.hasOwnProperty(keyword)
                                ) {
                                    throw `The binding ${
                                        column.config.binding
                                    } doesn't match any valid column from the data you specified. ${'\n'} Expected format: "EntityName.FieldName". ${'\n'} For example: "Product_Sample.Name"`;
                                }
                                // If keyword is a property from metadata then use metadata[keyword] as the new metadata and iterate to the next keyword.
                                metadata = metadata[keyword];
                            });
                        });
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

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public setViewLayout(state: any): void {
            if (this.isReady) {
                this._features.view.setViewLayout(state);
            }
        }
    }
}
