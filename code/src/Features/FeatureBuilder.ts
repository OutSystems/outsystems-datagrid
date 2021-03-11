// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Features {
    export interface IFeatures {
        features: CommmonFeatures;
        dispose();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export class CommmonFeatures {
        public columnFreeze: IColumnFreeze;
        public columnReorder: IColumnReorder;
        public columnResize: IColumnResize;
        public contextMenu: IContextMenu;
        public dirtyMark: IDirtyMark;
        public export: IExport;
        public filter: IColumnFilter;
        public groupPanel: IGroupPanel;
        public pagination: IPagination;
        public rows: IRows;
        public selection: ISelection;
        public sort: IColumnSort;
        public styling: IStyling;
        public tabNavigation: ITabNavigation;
        public undoStack: IUndoStack;
        public view: IView;
    }

    export abstract class AbstractFactoryBuilder
        implements IFeatures, IBuilder {
        protected _features: CommmonFeatures;
        protected _grid: Grid.IGrid;
        public _featureList: IBuilder[];

        constructor(grid: Grid.IGrid) {
            this._grid = grid;
            this._featureList = [];
            this._features = new CommmonFeatures();
        }

        // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
        private _instanceOfIDisposable(object: any): object is IDisposable {
            return 'dispose' in object;
        }

        protected _makeItem<T extends IBuilder>(
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
                this._instanceOfIDisposable(p) && (p as IDisposable).dispose();
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

        public build(): void {
            const config = this._grid.config as Grid.FlexGridConfig;

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
                ._makeSelection(config.allowRowSelector, config.selectionMode)
                ._makeState();

            super.build();
        }
    }
}
