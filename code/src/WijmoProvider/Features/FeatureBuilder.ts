// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    export interface IFeatures {
        features: OSFramework.Feature.ExposedFeatures;
        dispose();
    }

    export abstract class AbstractFactoryBuilder
        implements IFeatures, OSFramework.Interface.IBuilder
    {
        protected _features: OSFramework.Feature.ExposedFeatures;
        protected _grid: OSFramework.Grid.IGrid;
        public _featureList: OSFramework.Interface.IBuilder[];

        constructor(grid: OSFramework.Grid.IGrid) {
            this._grid = grid;
            this._featureList = [];
            this._features = new OSFramework.Feature.ExposedFeatures();
        }

        // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
        private _instanceOfIDisposable(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            object: any
        ): object is OSFramework.Interface.IDisposable {
            return 'dispose' in object;
        }

        protected _makeItem<T extends OSFramework.Interface.IBuilder>(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            c: new (...args: any) => T,
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
            ...args
        ): T {
            const o = new c(this._grid, ...args);
            this._featureList.push(o);
            return o;
        }

        public get features(): OSFramework.Feature.ExposedFeatures {
            return this._features;
        }

        public build(): void {
            this._featureList.forEach((p) => p.build());
        }

        public dispose(): void {
            this._featureList.forEach((p) => {
                this._instanceOfIDisposable(p) &&
                    (p as OSFramework.Interface.IDisposable).dispose();
                p = undefined;
            });
        }
    }

    export class FeatureBuilder extends AbstractFactoryBuilder {
        private _makeAutoRowNumber(): FeatureBuilder {
            this._features.autoRowNumber = this._makeItem(AutoRowNumber);
            return this;
        }

        private _makeCalculatedField(): FeatureBuilder {
            this._features.calculatedField = this._makeItem(CalculatedField);
            return this;
        }

        private _makeCellData(): FeatureBuilder {
            this._features.cellData = this._makeItem(CellData);
            return this;
        }

        private _makeCellStyle(): FeatureBuilder {
            this._features.cellStyle = this._makeItem(CellStyle);
            return this;
        }

        private _makeColumnAggregate(enable: boolean): FeatureBuilder {
            this._features.columnAggregate = this._makeItem(
                ColumnAggregate,
                enable
            );
            return this;
        }

        private _makeColumnMergeCells(): FeatureBuilder {
            this._features.columnMergeCells = this._makeItem(ColumnCellMerging);
            return this;
        }

        private _makeColumnPicker(): FeatureBuilder {
            this._features.columnPicker = this._makeItem(ColumnPicker);
            return this;
        }

        private _makeColumnReorder(enable: boolean): FeatureBuilder {
            this._features.columnReorder = this._makeItem(
                ColumnReorder,
                enable
            );
            return this;
        }

        private _makeColumnResize(enable: boolean): FeatureBuilder {
            this._features.columnResize = this._makeItem(ColumnResize, enable);
            return this;
        }

        private _makeConditionalFormat(): FeatureBuilder {
            this._features.conditionalFormat =
                this._makeItem(ConditionalFormat);
            return this;
        }

        private _makeContextMenu(): FeatureBuilder {
            this._features.contextMenu = this._makeItem(ContextMenu);
            return this;
        }

        private _makeDirtyMark(): FeatureBuilder {
            this._features.dirtyMark = this._makeItem(DirtyMark);
            return this;
        }

        private _makeExport(): FeatureBuilder {
            this._features.export = this._makeItem(Export);
            return this;
        }

        private _makeFilter(enable: boolean): FeatureBuilder {
            this._features.filter = this._makeItem(ColumnFilter, enable);
            return this;
        }

        private _makeFreezePanes(): FeatureBuilder {
            this._features.columnFreeze = this._makeItem(ColumnFreeze);
            return this;
        }

        private _makeGroupPanel(groupPanelId: string): FeatureBuilder {
            this._features.groupPanel = this._makeItem(
                GroupPanel,
                groupPanelId
            );
            return this;
        }

        private _makePagination(pageSize: number): FeatureBuilder {
            this._features.pagination = this._makeItem(Pagination, pageSize);
            return this;
        }

        private _makeRowHeader(rowHeader: number): FeatureBuilder {
            this._features.rowHeader = this._makeItem(RowHeader, rowHeader);
            return this;
        }

        private _makeRows(): FeatureBuilder {
            this._features.rows = this._makeItem(Rows);
            return this;
        }

        private _makeSelection(
            allowRowSelector: boolean,
            selectionMode: number
        ): FeatureBuilder {
            this._features.selection = this._makeItem(
                Selection,
                allowRowSelector,
                selectionMode
            );
            return this;
        }

        private _makeSort(enable: boolean): FeatureBuilder {
            this._features.sort = this._makeItem(ColumnSort, enable);
            return this;
        }

        private _makeState(): FeatureBuilder {
            this._features.view = this._makeItem(View);
            return this;
        }

        private _makeStyling(rowHeight: number): FeatureBuilder {
            this._features.styling = this._makeItem(Styling, rowHeight);
            return this;
        }

        private _makeTabNavigation(enable: boolean): FeatureBuilder {
            this._features.tabNavigation = this._makeItem(
                TabNavigation,
                enable
            );
            return this;
        }

        private _makeToolTip(): FeatureBuilder {
            this._makeItem(ToolTip);
            return this;
        }

        private _makeUndoStack(): FeatureBuilder {
            this._features.undoStack = this._makeItem(UndoStack);
            return this;
        }

        private _makeValidationMark(): FeatureBuilder {
            this._features.validationMark = this._makeItem(ValidationMark);
            return this;
        }

        public build(): void {
            const config = this._grid
                .config as OSFramework.Configuration.Grid.FlexGridConfig;

            this._makeDirtyMark()
                ._makeFilter(config.allowFiltering)
                ._makeFreezePanes()
                ._makeContextMenu()
                ._makeRows()
                ._makeExport()
                ._makeGroupPanel(config.groupPanelId)
                ._makeCellData()
                ._makeCellStyle()
                ._makeToolTip()
                ._makePagination(config.rowsPerPage)
                ._makeSort(config.allowColumnSort)
                ._makeColumnReorder(config.allowColumnReorder)
                ._makeColumnResize(config.allowColumnResize)
                ._makeTabNavigation(config.allowKeyTabNavigation)
                ._makeAutoRowNumber()
                ._makeStyling(config.rowHeight)
                ._makeUndoStack()
                ._makeValidationMark()
                ._makeSelection(config.allowRowSelector, config.selectionMode)
                ._makeState()
                ._makeConditionalFormat()
                ._makeCalculatedField()
                ._makeRowHeader(config.rowHeader)
                ._makeColumnPicker()
                ._makeColumnAggregate(config.showAggregateValues)
                ._makeColumnMergeCells();

            super.build();
        }
    }
}
