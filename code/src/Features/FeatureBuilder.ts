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
        public validationMark: IValidationMark;
        public view: IView;
    }

    export abstract class AbstractFactoryBuilder
        implements IFeatures, IBuilder {
        private _grid: Grid.IGrid;
        protected _features: CommmonFeatures;
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
        public makeAutoRowNumber(): FeatureBuilder {
            this._makeItem(AutoRowNumber);
            return this;
        }

        public makeColumnPicker(): FeatureBuilder {
            this._makeItem(ColumnPicker);
            return this;
        }

        public makeColumnReorder(enable: boolean): FeatureBuilder {
            this._features.columnReorder = this._makeItem(
                ColumnReorder,
                enable
            );
            return this;
        }

        public makeColumnResize(enable: boolean): FeatureBuilder {
            this._features.columnResize = this._makeItem(ColumnResize, enable);
            return this;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public makeContextMenu(): FeatureBuilder {
            this._features.contextMenu = this._makeItem(ContextMenu);
            return this;
        }

        public makeDirtyMark(): FeatureBuilder {
            this._features.dirtyMark = this._makeItem(DirtyMark);
            return this;
        }

        public makeExport(): FeatureBuilder {
            this._features.export = this._makeItem(Export);
            return this;
        }

        public makeFilter(enable: boolean): FeatureBuilder {
            this._features.filter = this._makeItem(ColumnFilter, enable);
            return this;
        }

        public makeFreezePanes(): FeatureBuilder {
            this._features.columnFreeze = this._makeItem(ColumnFreeze);
            return this;
        }

        public makeGroupPanel(groupPanelId: string): FeatureBuilder {
            this._features.groupPanel = this._makeItem(
                GroupPanel,
                groupPanelId
            );
            return this;
        }

        public makePagination(pageSize: number): FeatureBuilder {
            this._features.pagination = this._makeItem(Pagination, pageSize);
            return this;
        }

        public makeRows(): FeatureBuilder {
            this._features.rows = this._makeItem(Rows);
            return this;
        }

        public makeSelection(
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

        public makeSort(enable: boolean): FeatureBuilder {
            this._features.sort = this._makeItem(ColumnSort, enable);
            return this;
        }

        public makeState(): FeatureBuilder {
            this._features.view = this._makeItem(View);
            return this;
        }

        public makeStyling(rowHeight: number): FeatureBuilder {
            this._features.styling = this._makeItem(Styling, rowHeight);
            return this;
        }

        public makeTabNavigation(enable: boolean): FeatureBuilder {
            this._features.tabNavigation = this._makeItem(
                TabNavigation,
                enable
            );
            return this;
        }

        public makeToolTip(): FeatureBuilder {
            this._makeItem(ToolTip);
            return this;
        }

        public makeUndoStack(): FeatureBuilder {
            this._features.undoStack = this._makeItem(UndoStack);
            return this;
        }

        public makeValidationMark(): FeatureBuilder {
            this._features.validationMark = this._makeItem(ValidationMark);
            return this;
        }
    }
}
