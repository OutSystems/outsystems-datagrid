// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Column {
    export class GroupColumn
        extends AbstractProviderColumn<OSFramework.DataGrid.Configuration.Column.ColumnConfigGroup>
        implements OSFramework.DataGrid.Column.IColumnGroup
    {
        private _columns: OSFramework.DataGrid.Column.IColumn[];

        constructor(
            grid: OSFramework.DataGrid.Grid.IGrid,
            columnID: string,
            configs: OSFramework.DataGrid.Types.IColumnConfigs,
            specific: OSFramework.DataGrid.Types.IGroupColumnExtraConfigs
        ) {
            super(
                grid,
                columnID,
                new OSFramework.DataGrid.Configuration.Column.ColumnConfigGroup(
                    configs,
                    specific
                )
            );
            this._columns = [];
        }

        public get columnType(): OSFramework.DataGrid.Enum.ColumnType {
            return OSFramework.DataGrid.Enum.ColumnType.Group;
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

        /**
         * Gets binding on which the group will be collapsed to
         */
        private _getCollapsedToBinding(columnBinding: string): string {
            if (columnBinding === undefined || columnBinding === '') return '';

            const col = this.grid.getColumn(columnBinding);
            let hasError = false;

            if (col) {
                if (this.equalsToID(col.parentColumnId)) {
                    return col.config.binding;
                } else {
                    return columnBinding;
                }
            } else {
                hasError = true;
            }
            //To avoid breaking the page, just send an alert-message through console
            if (hasError) {
                console.error(
                    `The column "${columnBinding}" specified on the CollapseTo field is not part of the group ${
                        this.config.header
                    }. ${'\n'}  Please drag-and-drop the column inside the group placeholder or pick one of the columns inside it.`
                );
                //No collapseTo
                return '';
            }
        }

        /**
         * Adds child to group
         * @param column column which will be added to group
         */
        public addChild(column: OSFramework.DataGrid.Column.IColumn): void {
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

        public getProviderConfig(): OSFramework.DataGrid.Types.IColumnProviderConfigs {
            const providerConfig = super.getProviderConfig();

            if (this.config.collapseTo !== undefined) {
                providerConfig.collapseTo = this._getCollapsedToBinding(
                    this.config.collapseTo
                );
            }
            return providerConfig;
        }

        public removeChild(column: OSFramework.DataGrid.Column.IColumn): void {
            // remove column from internal group columns array
            this._columns = this._columns.filter(function (item) {
                return item !== column;
            });

            // Remove child from group
            this.provider.columns
                .filter((x) => x.binding === column.provider.binding)
                .forEach((x) => this.provider.columns.remove(x));
        }
    }
}
