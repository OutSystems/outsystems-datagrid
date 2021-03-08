// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Features {
    export class View implements IBuilder, IView {
        private _grid: Grid.IGridWijmo;

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
        }
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public getViewConfig(): any {
            const state = {
                columns: this._grid.provider.columnLayout,
                filterDefinition: this._grid.features.filter.getViewConfig(),
                groupDescriptions: this._grid.features.groupPanel.getViewConfig(),
                sortDescriptions: this._grid.features.sort.getViewConfig()
            };

            return state;
        }
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public setViewConfig(state: any): void {
            this._grid.provider.columns.collectionChanged.addHandler(this._reloadColumns.bind(this));

            this._grid.provider.deferUpdate(() => {
                this._grid.provider.columnLayout = state;//state.columns;
                // this._grid.features.filter.setViewConfig(state);
                // this._grid.features.groupPanel.setViewConfig(state);
                // this._grid.features.sort.setViewConfig(state);
            });
        }

        private _reloadColumns(
            colums: wijmo.collections.ObservableArray<wijmo.grid.Column>, 
            notify: wijmo.collections.NotifyCollectionChangedEventArgs<wijmo.grid.Column>, 
            self?: any) {
            
            colums.forEach(p => {
                if (this._grid.columns.has(p.binding)) {
                    let col = this._grid.columns.get(p.binding);
                    col.provider = p;
                    col.refreshConfig();
                }
                else {
                    //TODO: Layout pode ter mudado, o que faremos nesse caso??
                    
                    //Op1: Imagine que a coluna salva nao mais esteja na pagina, mas esteja no antigo config salvo
                    //Op2: Imagine que hajam novas colunas no grid, e o config salvo esteja diferente. O user nao tera a nova coluna
                    //     Aplicara layout coluna a coluna?
                    //     Salvar um hash dos bindings ordenados, e comparar com o layout a aplicar?
                }
            });

            this._grid.provider.columns.collectionChanged.removeHandler(this._reloadColumns.bind(this));
        }

        public build(): void {}
    }
}
