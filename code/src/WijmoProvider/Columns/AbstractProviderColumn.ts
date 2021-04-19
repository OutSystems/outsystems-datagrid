// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Column {
    /**
     * An extension of AbstractColumn, used to handle the grid's provider
     */
    export abstract class AbstractProviderColumn<
        T extends OSFramework.Configuration.IConfigurationColumn
    > extends OSFramework.Column.AbstractColumn<T> {
        private _provider: wijmo.grid.Column;

        public get columnEvents(): OSFramework.Event.Column.ColumnEventsManager {
            throw `The column ${this.columnType.toString()} does not support events`;
        }

        /** Checks if the column has associated events */
        public get hasEvents(): boolean {
            return this.columnEvents !== undefined;
        }

        public get provider(): wijmo.grid.Column {
            return this._provider;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        public set provider(provider: wijmo.grid.Column) {
            this._provider = provider;
        }

        public applyConfigs(): void {
            if (this.isReady) {
                wijmo.copy(this.provider, this.getProviderConfig());
            } else {
                console.log('applyConfigs - Column needs to be build');
            }
        }

        public build(): void {
            if (this._built) return;
            super.build();

            const providerGrid: wijmo.grid.FlexGrid = this.grid.provider;

            if (this.hasParentColumn) {
                const parent = this.grid.getColumn(
                    this.parentColumnId
                ) as OSFramework.Column.IColumnGroup;
                parent.addChild(this);

                if (parent.isReady) {
                    //RGRIDT-574 review after solved
                    //We should think in the future how config.index should work considering groups
                    //Index is 0 based AND based on its parent
                    //                  |Group 1         |Group2              |
                    //                  |ColA    |ColB   |ColC   |ColD   |ColE|
                    // Column indexes   |0       |1      |0      |1      |2   |
                    // Group indexes    |0               |1                   |
                    //Inserting in the correct position
                    // this.provider = new wijmo.grid.ColumnGroup(this.getProviderConfig(), parent.provider);
                    //const providerGrid: wijmo.grid.FlexGrid = this._grid.provider;
                    //providerGrid.columns.insert(this.config.index, this.provider);
                } else {
                    console.error(
                        `build - GroupColumn "${parent.config.header}" needs to be build before its childs ("${this.config.header}")`
                    );
                }
            } else {
                //Where column will be placed
                let indexPosition = this.indexPosition();
                //When index -1, include the new column at the end of the grid
                indexPosition =
                    indexPosition === -1
                        ? providerGrid.columns.length
                        : indexPosition;

                this.provider = new wijmo.grid.Column(this.getProviderConfig());

                providerGrid.columns.insert(indexPosition, this.provider);
            }
        }

        public dispose(): void {
            super.dispose();

            if (this.hasParentColumn) {
                const parent = this.grid.getColumn(
                    this.parentColumnId
                ) as OSFramework.Column.IColumnGroup;
                parent && parent.removeChild(this);
            }

            //RGRIDT-574 review after solved
            //Error when the column is inside a ColumnGroup
            !this.hasParentColumn &&
                (this.grid.provider as wijmo.grid.FlexGrid).columns.remove(
                    this.provider
                );
        }

        abstract get providerType(): wijmo.DataType;
    }
}
