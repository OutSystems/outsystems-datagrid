// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    export interface IFeatures {
        features: CommmonFeatures;
        dispose();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export class CommmonFeatures {
        public columnFreeze: OSFramework.Feature.IColumnFreeze;
        public columnReorder: OSFramework.Feature.IColumnReorder;
        public columnResize: OSFramework.Feature.IColumnResize;
        public contextMenu: OSFramework.Feature.IContextMenu;
        public dirtyMark: OSFramework.Feature.IDirtyMark;
        public export: OSFramework.Feature.IExport;
        public filter: OSFramework.Feature.IColumnFilter;
        public groupPanel: OSFramework.Feature.IGroupPanel;
        public pagination: OSFramework.Feature.IPagination;
        public rows: OSFramework.Feature.IRows;
        public selection: OSFramework.Feature.ISelection;
        public sort: OSFramework.Feature.IColumnSort;
        public styling: OSFramework.Feature.IStyling;
        public tabNavigation: OSFramework.Feature.ITabNavigation;
        public undoStack: OSFramework.Feature.IUndoStack;
        public validationMark: OSFramework.Feature.IValidationMark;
        public view: OSFramework.Feature.IView;
    }

    export abstract class AbstractFactoryBuilder
        implements IFeatures, OSFramework.Interface.IBuilder {
        protected _features: CommmonFeatures;
        protected _grid: OSFramework.Grid.IGrid;
        public _featureList: OSFramework.Interface.IBuilder[];

        constructor(grid: OSFramework.Grid.IGrid) {
            this._grid = grid;
            this._featureList = [];
            this._features = new CommmonFeatures();
        }

        // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
        private _instanceOfIDisposable(object: any): object is OSFramework.Interface.IDisposable {
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

        public get features(): CommmonFeatures {
            return this._features;
        }

        public build(): void {
            this._featureList.forEach((p) => p.build());
        }

        public dispose(): void {
            this._featureList.forEach((p) => {
                this._instanceOfIDisposable(p) && (p as OSFramework.Interface.IDisposable).dispose();
                p = undefined;
            });
        }
    }

    export class FeatureBuilder extends AbstractFactoryBuilder {
        private _makeAutoRowNumber(): FeatureBuilder {
            this._makeItem(AutoRowNumber);
            return this;
        }

        private _makeColumnPicker(): FeatureBuilder {
            this._makeItem(ColumnPicker);
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
            const config = this._grid.config as WijmoProvider.Grid.FlexGridConfig;

            this._makeDirtyMark()
                ._makeFilter(config.allowFiltering)
                ._makeFreezePanes()
                ._makeContextMenu()
                ._makeRows()
                ._makeExport()
                ._makeGroupPanel(config.groupPanelId)
                ._makeColumnPicker()
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
                ._makeState();

            super.build();
        }
    }
}
