/// <reference path="AbstractGrid.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Grid {
    export class GridChanges extends DS.ChangesDone {
        hasInvalidLines: boolean;
        invalidLinesJSON: string;
    }

    export interface IGridWijmo extends IGridGeneric<wijmo.grid.FlexGrid> {}

    export class FlexGrid
        extends AbstractGrid<wijmo.grid.FlexGrid, FlexGridConfig>
        implements IGridWijmo {
        private _fBuilder: Features.FeatureBuilder;
        private _rowMetadata: RowMetadata;

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        constructor(gridID: string, configs: any) {
            super(
                gridID,
                new FlexGridConfig(configs),
                new DS.ProviderDataSource()
            );
        }

        private _addColumns(cols: Column.IColumn[]): void {
            cols.forEach((col) => {
                super.addColumn(col);
            });

            // this._buildColumns();
        }

        // eslint-disable-next-line @typescript-eslint/member-ordering
        private _buildColumns(): void {
            this.getColumns().forEach((col) => col.build());
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _getProviderConfig(): any {
            if (this.hasColumnsDefined()) {
                this.config.autoGenerateColumns = false;
            }

            return this.config.getProviderConfig();
        }

        public get autoGenerate(): boolean {
            return this.provider.autoGenerateColumns;
        }

        public set autoGenerate(value: boolean) {
            this.provider.autoGenerateColumns = value;
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

            this.dataSource.build();
            this._provider.itemsSource = this.dataSource.getProviderDataSource();

            this.buildFeatures();

            this._buildColumns();

            this.finishBuild();
        }

        public buildFeatures(): void {
            this._fBuilder = new Features.FeatureBuilder(this);

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
                this.dataSource.clear();
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

        public getChangesMade(): GridChanges {
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
            const changes = this.dataSource.getChanges(GridChanges);

            if (this._features.validationMark.invalidRows.length > 0) {
                changes.hasInvalidLines = true;
                changes.invalidLinesJSON = this.dataSource.toOSFormat(this._features.validationMark.invalidRows);
            }

            return changes;
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public getViewLayout(): any {
            return this._features.view.getViewLayout();
        }

        public setCellError(/*binding: string, row: number, message: string*/): void {
            throw new Error('Method not implemented.');
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public setViewLayout(state: any): void {
            if (this.isReady) {
                this._features.view.setViewLayout(state);
            }
        }
    }
}
