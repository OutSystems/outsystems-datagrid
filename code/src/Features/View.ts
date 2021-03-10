// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Features {
    /**
     * Defines the Save and Load layout feature
     */
    export class View implements IBuilder, IView {
        private _grid: Grid.IGridWijmo;

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
        }

        /**
         * Internal method used to apply configurations to columns
         * @param state The provider config received used to load view
         */
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        private _reloadColumns(state: any) {
            const config = JSON.parse(state.columns);
            let i = 0; //Used to control the appearance of saved columns

            config.columns.forEach((providerConfing) => {
                // * We build the columns based on OS configuration, than we load the configurations for the available columns
                //   This should avoid errors like, a binding isn't present on the grid, or the developer have to remove some column (for securety maybe)
                // * Different from the web version, new columns (inserted by the developer after the user "SaveConfig") will now appear on the grid, as rightmost columns
                if (this._grid.columns.has(providerConfing.binding)) {
                    const col = this._grid.columns.get(providerConfing.binding);
                    const position = col.provider.index;

                    //Update the config based on columnsLayout
                    col.config.updateConfig(providerConfing);
                    //Refresh column configuration
                    col.refresh();

                    //Move the column to the saved position
                    this._grid.provider.columns.moveElement(position, i++);
                }
            });
        }

        public build(): void {
            //No need to build
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public getViewLayout(): any {
            const state = {
                columns: this._grid.provider.columnLayout,
                filterDefinition: this._grid.features.filter.getViewLayout(),
                groupDescriptions: this._grid.features.groupPanel.getViewLayout(),
                sortDescriptions: this._grid.features.sort.getViewLayout()
            };

            return JSON.stringify(state);
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public setViewLayout(state: any): void {
            const config = JSON.parse(state);
            this._grid.provider.deferUpdate(() => {
                this._reloadColumns(config);
                this._grid.features.filter.setViewLayout(config);
                this._grid.features.groupPanel.setViewLayout(config);
                this._grid.features.sort.setViewLayout(config);
            });
        }
    }
}
