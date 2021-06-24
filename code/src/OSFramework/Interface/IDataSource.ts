namespace OSFramework.Grid {
    /**
     * Defines the basic interface for a DataSource
     */
    export interface IDataSource extends OSFramework.Interface.IBuilder {
        /**
         * Identify if metadata was given
         * @description Only works during the use of ArrangeData
         */
        hasMetadata: boolean;
        /**
         * Identify if the datasource has single entity
         */
        isSingleEntity: boolean;
        /**
         * Add row to an specific position on the DataSource
         * @param position index position (0-based)
         * @param data The array of items to be inserted
         */
        addRow(position?: number, data?: JSON[]);
        /**
         * Clear all changes in the datasource
         */
        clear(): void;
        /**
         * Filter the datasource by the given value
         * @param searchedValue the value used as filter
         */
        search(searchedValue: string): void;
        /**
         * Used to flatten the datasource
         */
        flatten(): void;
        /**
         * Returns the changes made on the grid
         */
        getChanges<T extends OSFramework.OSStructure.ChangesDone>(
            c: new () => T
        ): T;
        /**
         * Return the full data source
         */
        getData(): JSON[];
        /**
         * Return metadata information
         */
        getMetadata(): JSON;
        /**
         * Return the provider's dataSource
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getProviderDataSource(): any;
        /**
         * Indicate whether the filtered dataSource has Results to show
         */
        hasResults(): boolean;
        /**
         * Responsable for removing items from the datasource
         * @param item Can be the index position (0-based) or the dataItem of that row
         */
        removeRow(item: number | JSON): boolean;
        /**
         * Set data to be printed on the grid
         * @param data data source in JSON stringify format
         */
        setData(data: string): void;
        /**
         * Transform dataItem to OS format
         * @param dataItem
         */
        toOSFormat(dataItem: any): any;
        /**
         * Transform value to JSON format
         * @param value
         */
        trimSecondsFromDate(value: string): string;
    }
}
