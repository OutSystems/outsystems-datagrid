// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Column {
    export class GroupColumn
        extends AbstractProviderColumn<ColumnConfigGroup>
        implements IColumnGroup {
        private _columns: IColumn[];

        constructor(
            grid: OSFramework.Grid.IGrid,
            columnID: string,
            configs: JSON,
            specific: JSON
        ) {
            super(grid, columnID, new ColumnConfigGroup(configs, specific));
            this._columns = [];
        }

        public get columnType(): ColumnType {
            return ColumnType.Group;
        }

        public get provider(): wijmo.grid.ColumnGroup {
            return super.provider as wijmo.grid.ColumnGroup;
            // //RGRIDT-574 review after solved
            // const providerGrid:wijmo.grid.FlexGrid = this.grid.provider;

            // for (let r = 0; r < providerGrid.columnHeaders.rows.length; r++) {
            //     for (let c = 0; c < providerGrid.columns.length; c++) {
            //         const grp = providerGrid._getColumnGroup(r, c);
            //         if (grp && grp.header === this.config.header) {
            //             return grp;
            //         }
            //     }
            // }

            // return undefined;
        }

        public set provider(column: wijmo.grid.ColumnGroup) {
            super.provider = column;
        }

        public get providerType(): wijmo.DataType {
            return wijmo.DataType.Object;
        }

        private _getCollapsedToBinding(columnId: string): string {
            if (columnId === undefined || columnId === '') return undefined;

            const col = GridAPI.ColumnManager.GetColumnById(columnId);
            let hasError = false;

            if (col) {
                //The informed column doens't belong to this Group
                if (col.parentColumnId === undefined) {
                    hasError = true;
                }
                //The informed column's group matches with this Group
                else if (this.equalsToID(col.parentColumnId)) {
                    return col.config.binding;
                }
                //The informed maybe inside a sub-group
                else {
                    return this._getCollapsedToBinding(col.uniqueId);
                }
            } else {
                hasError = true;
            }

            //To avoid breaking the page, just send an alert-message through console
            if (hasError) {
                console.error(
                    `The columns specified on collapseTo property isn't available on group ${this.config.header}`
                );

                //No collapseTo
                return undefined;
            }
        }

        public addChild(column: IColumn): void {
            if (this._columns.indexOf(column) === -1) {
                this._columns.push(column);
            }
        }

        public applyConfigs(): void {
            super.applyConfigs();

            if (this.config.collapseTo) {
                this.provider.collapseTo = this._getCollapsedToBinding(
                    this.config.collapseTo
                );
            }

            //When there isn't a reference for collapseTo, makes the group always expanded
            if (this.provider.collapseTo === undefined) {
                this.provider.isCollapsed = false;
            }
        }

        public dispose(): void {
            const providerGrid: wijmo.grid.FlexGrid = this.grid.provider;

            providerGrid.deferUpdate(() => {
                //Dispose internal columns
                while (this._columns.length > 0) {
                    //Remove and dispose the child
                    this._columns.pop().dispose();
                }
            });

            super.dispose();
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public getProviderConfig(): any {
            const providerConfig = super.getProviderConfig();

            if (this.config.collapseTo !== undefined) {
                providerConfig.collapseTo = this._getCollapsedToBinding(
                    this.config.collapseTo
                );
            }

            //When there isn't a reference for collapseTo, makes the group always expanded
            if (providerConfig.collapseTo === undefined) {
                providerConfig.isCollapsed = false;
            }

            providerConfig.columns = this._columns
                //Sort based on index position
                .sort((a, b) => a.indexPosition() - b.indexPosition())
                //Return provider config
                .map((p) => p.getProviderConfig());

            return providerConfig;
        }

        public removeChild(column: IColumn): void {
            _.remove(this._columns, (p) => p === column);
        }
    }
}
