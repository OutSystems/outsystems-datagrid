// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Grid {
    export interface IGrid
        extends Interface.IBuilder,
            Interface.IDisposable,
            Interface.ISearchById,
            Feature.IView {
        addedRows: Event.Grid.AddNewRowEvent;
        autoGenerate: boolean;
        config: Configuration.IConfigurationGrid;
        dataSource: Grid.IDataSource;
        features: Feature.ExposedFeatures;
        gridEvents: Event.Grid.GridEventsManager;
        isReady: boolean;
        isSingleEntity: boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        provider: any;
        rowMetadata: Interface.IRowMetadata;
        uniqueId: string;
        validatingAction: Event.Grid.ValidatingAction;
        widgetId: string;

        addColumn(col: Column.IColumn);
        changeColumnProperty(
            columnID: string,
            propertyName: string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            propertyValue: any
        ): void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        changeProperty(propertyName: string, propertyValue: any): void;
        /**
         * Used to mark all changes as saved. Removes dirty and validation marks from grid.
         */
        clearAllChanges(forceClearValidationMarks: boolean): void;
        /**
         * Used to mark all changes as saved. Removes dirty and validation marks from specific rows.
         */
        clearAllChangesByRowKeys(
            rowKeys: Array<string>,
            forceClearValidationMarks: boolean
        ): void;
        /**
         * Clear all changes from Grid
         */
        clearChanges(): void;
        getChangesMade(): OSStructure.ChangesDone;
        /**
         * Get the column on the grid by giving a columnID or a binding.
         * @param key key can be the uniqueId or a binding of a column
         * @returns Column with the same columnID or binding.
         */
        getColumn(key: string): Column.IColumn;
        /** Return an array containing all grid's column
         * @returns Array of grid's columns
         */
        getColumns(): Column.IColumn[];
        /**
         * Return a map containing all grid's column key and types
         */
        getColumnsKeyType(): Map<string, string>;
        getData(): JSON[];
        /**
         * This will be used on empty Grids with JSON Serialize
         * Returns data structure from column bindings.
         * eg.: Columns = ["Employee.Name", "Employee.Date"] => {Employee: {Name: "", Date: ""}}
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getStructureFromColumnBindings(): any;
        /**
         * Verifies grid has the given Column.
         * @param key key must be the uniqueId or a binding of a column
         */
        hasColumn(key: string): boolean;
        /**
         * Look to DOM trying to find if some column was defined for this Grid
         */
        hasColumnsDefined(): boolean;
        hasResults(): boolean;
        removeColumn(columnID: string);
        setCellError(binding: string, row: number, message: string);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setData(data: any): boolean;
    }
}
