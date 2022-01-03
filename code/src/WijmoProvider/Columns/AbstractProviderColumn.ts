// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Column {
    /**
     * An extension of AbstractColumn, used to handle the grid's provider
     */
    export abstract class AbstractProviderColumn<
        T extends OSFramework.Configuration.IConfigurationColumn
    > extends OSFramework.Column.AbstractColumn<T> {
        // to use group columns on grid, all columns must be column group
        private _provider: wijmo.grid.ColumnGroup;

        public get columnEvents(): OSFramework.Event.Column.ColumnEventsManager {
            throw `The column ${this.columnType.toString()} does not support events`;
        }

        /** Checks if the column has associated events */
        public get hasEvents(): boolean {
            return this.columnEvents !== undefined;
        }

        public get provider(): wijmo.grid.ColumnGroup {
            return this._provider;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        public set provider(provider: wijmo.grid.ColumnGroup) {
            this._provider = provider;
        }

        public get providerIndex(): number {
            return this.provider.index;
        }

        /**
         * Checks if the visibility of the provider is True or False depending on the provider configs,
         * wijmo's column and if the column is in the group panel or unchecked in the column picker
         */
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        protected _getVisibility(): boolean {
            const providerConfig = this.getProviderConfig();
            const inGroupPanel =
                this.grid.features.groupPanel.columnInGroupPanel(
                    this.config.binding
                );
            const inColumnPicker = !this.provider.isVisible && !inGroupPanel;

            // We need to make sure the columns is visible only if the provider and our providerConfig
            // share the same value of visibility for the column AND the column is not on the group panel,
            // also considering if it is hidden or not on the column picker.
            return (
                (providerConfig.visible &&
                    this.provider.isVisible &&
                    !inGroupPanel &&
                    !inColumnPicker) ||
                (providerConfig.visible &&
                    !this.provider.isVisible &&
                    !inGroupPanel &&
                    inColumnPicker)
            );
        }

        public applyConfigs(): void {
            if (this.isReady) {
                const providerConfig = this.getProviderConfig();

                providerConfig.visible = this._getVisibility();

                wijmo.copy(this.provider, providerConfig);
            } else {
                console.log('applyConfigs - Column needs to be build');
            }
        }

        public build(): void {
            if (this._built) return;
            super.build();

            const providerGrid: wijmo.grid.FlexGrid = this.grid.provider;

            this.setConditionalFormat(this.config.conditionalFormat);

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
                    this.provider = new wijmo.grid.ColumnGroup(
                        this.getProviderConfig(),
                        parent.provider
                    );
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

                this.provider = new wijmo.grid.ColumnGroup(
                    this.getProviderConfig()
                );

                const columnGroups =
                    providerGrid.columnGroups as wijmo.collections.ObservableArray<wijmo.grid.ColumnGroup>;
                columnGroups.insert(indexPosition, this.provider);
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
                (
                    (this.grid.provider as wijmo.grid.FlexGrid)
                        .columnGroups as wijmo.collections.ObservableArray<wijmo.grid.ColumnGroup>
                ).remove(this.provider);
        }

        abstract get providerType(): wijmo.DataType;
    }
}
