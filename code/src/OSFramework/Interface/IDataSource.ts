// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Grid {
    /**
     * Defines the basic interface for a DataSource
     */
    export interface IDataSource extends Interface.IBuilder {
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
         * Identifies the parent grid of this data source.
         * This way, when formating data to be exported the removal of the
         * metadata can be done by the object that knows it.
         *
         * @type {IGrid}
         * @memberof IDataSource
         */
        parentGrid: IGrid;
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
         * Used to flatten the datasource
         */
        flatten(): void;
        /**
         * Returns the changes made on the grid
         */
        getChanges<T extends OSStructure.ChangesDone>(c: new () => T): T;
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
         * Retrieve row number by given key
         * @param key value that will match key binding
         */
        getRowNumberByKey(key: string): number;
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
         * Filter the datasource by the given value
         * @param searchedValue the value used as filter
         */
        search(searchedValue: string): void;
        /**
         * Set data to be printed on the grid
         * @param data data source in JSON stringify format
         */
        setData(data: string): void;
        /**
         * Transform dataItem to OS format
         * @param dataItem
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toOSFormat(dataItem: any): any;
        /**
         * Removes the second to dates in string format because the Datetime picker format is HH:mm
         * @param value
         */
        trimSecondsFromDate(value: string): string;
        /**
         * Updates row key binding with new key
         * @param currentRowId current key binding
         * @param newKey new key binding
         */
        updateAddedRowKey(currentRowId: string, newKey: string): boolean;
    }
}
