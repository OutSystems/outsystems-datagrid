// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    class GroupDefinition {
        public align: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public children: Array<any>;
        public collapseTo: string;
        public header: string;
        public isCollapsed: boolean;
    }
    /**
     * Defines the Save and Load layout feature
     */
    export class View
        implements OSFramework.Interface.IBuilder, OSFramework.Feature.IView
    {
        private _grid: Grid.IGridWijmo;

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
        }

        /**
         * Returns the column layout
         */
        private _getColumnLayout(): string {
            //Today we save only visible and width
            //Properties that the user can manipulate on his side, everything else should come from the OS
            //The column position consider its position inside the array
            return JSON.stringify(
                this._grid.provider.columns.map((p) => {
                    return {
                        binding: p.binding,
                        visible: p.visible === undefined ? true : p.visible,
                        width: p.width
                    };
                })
            );
        }

        /**
         * Returns the groups layout
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _getGroupDefinition(col: any): Array<any> {
            const children = [];

            for (let i = 0; i < col.length; i++) {
                const obj = new GroupDefinition();
                obj.header = col[i].header;
                if (col[i]._type === null) {
                    obj.isCollapsed = col[i].isCollapsed;
                    obj.collapseTo = col[i].collapseTo;
                    obj.align = col[i].align;
                }

                if (col[i].columns && col[i].columns.length > 0) {
                    obj.children = [];
                    obj.children.push(this._getGroupDefinition(col[i].columns));
                }
                children.push(obj);
            }
            return children;
        }

        /**
         * Internal method used to apply configurations to columns
         * @param state The provider config received used to load view
         */
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        private _reloadColumns(state: any) {
            const config = JSON.parse(state.columns);
            let i = 0; //Used to control the appearance of saved columns

            config.forEach((providerConfing) => {
                // * We build the columns based on OS configuration, than we load the configurations for the available columns
                //   This should avoid errors like, a binding isn't present on the grid, or the developer have to remove some column (for securety maybe)
                // * Different from the web version, new columns (inserted by the developer after the user "SaveConfig") will now appear on the grid, as rightmost columns
                if (this._grid.hasColumn(providerConfing.binding)) {
                    const col = this._grid.getColumn(providerConfing.binding);
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

        /**
         * Sets the groups layout
         */
        private _setGroups(columns, config) {
            for (let i = 0; i < config.length; i++) {
                let colDef = columns.filter(
                    (x) => x.header === config[i].header
                );
                if (colDef.length > 0) {
                    colDef = colDef[0];
                    if (config[i].children && config[i].children.length > 0) {
                        this._setGroups(colDef.columns, config[i].children[0]);
                    }
                    columns.remove(colDef);
                    colDef.collapseTo = config[i].collapseTo;
                    colDef.isCollapsed = config[i].isCollapsed || false; // in case it wasn't defined, set to false
                    colDef.align = config[i].align || colDef.align;

                    columns.insert(i, colDef);
                }
            }
        }

        public build(): void {
            //No need to build
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public getViewLayout(): OSFramework.OSStructure.ReturnMessage {
            try {
                const state = {
                    columns: this._getColumnLayout(),
                    filterDefinition:
                        this._grid.features.filter.getViewLayout(),
                    groupDescriptions:
                        this._grid.features.groupPanel.getViewLayout(),
                    sortDescriptions: this._grid.features.sort.getViewLayout(),
                    groupColumns: this._getGroupDefinition(
                        this._grid.provider.columnGroups
                    )
                };

                return {
                    value: JSON.stringify(state),
                    isSuccess: true,
                    message: OSFramework.Enum.ErrorMessages.SuccessMessage,
                    code: OSFramework.Enum.ErrorCodes.GRID_SUCCESS
                };
            } catch (error) {
                return {
                    value: '',
                    isSuccess: false,
                    message: error.message,
                    code: OSFramework.Enum.ErrorCodes.API_FailedGetViewLayout
                };
            }
        }

        public setViewLayout(
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
            state: any
        ): OSFramework.OSStructure.ReturnMessage {
            try {
                if (state === '') {
                    return {
                        isSuccess: false,
                        message: 'It seems you are not passing a valid config.',
                        code: OSFramework.Enum.ErrorCodes
                            .API_FailedSetViewLayout
                    };
                }

                const config = JSON.parse(state);
                this._grid.provider.deferUpdate(() => {
                    this._reloadColumns(config);
                    this._grid.features.filter.setViewLayout(config);
                    this._grid.features.groupPanel.setViewLayout(config);
                    this._grid.features.sort.setViewLayout(config);
                    this._setGroups(
                        this._grid.provider.columnGroups,
                        config.groupColumns
                    );
                });

                return {
                    isSuccess: true,
                    message: OSFramework.Enum.ErrorMessages.SuccessMessage,
                    code: OSFramework.Enum.ErrorCodes.GRID_SUCCESS
                };
            } catch (error) {
                return {
                    isSuccess: false,
                    message: error.message,
                    code: OSFramework.Enum.ErrorCodes.API_FailedSetViewLayout
                };
            }
        }
    }
}
