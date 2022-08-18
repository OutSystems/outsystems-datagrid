// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Column {
    /**
     * Representation of a ColumnGroup
     */
    export interface IColumnGroup extends IColumn {
        /**
         * Add a new child column
         * @param column new child to be added
         */
        addChild(column: IColumn): void;
        /**
         * Remove a column from the ColumnGroup
         * @param column child to be removed
         */
        removeChild(column: IColumn): void;
    }
}
