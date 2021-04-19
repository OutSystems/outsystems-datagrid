namespace OSFramework.Feature {
    /**
     * Interface for freezing columns
     */
    export interface IColumnFreeze {
        /**
         * Indicates when there is some column freezed
         */
        isFrozen: boolean;
        /**
         * Freeze columns considering Grid's active cell
         */
        byActiveSelection(): void;
        /**
         * Freeze columns considering a cell position
         *
         * @param cell Used as reference to freeze everything up and left
         */
        bySelection(cell: OSFramework.OSStructure.CellRange): void;
        /**
         * Freeze the first column
         */
        firstColumn(): void;
        /**
         * Freeze leftmost columns
         *
         * @param n how many columns to freeze, if omitted active cell will be considered
         */
        leftColumns(n?: number): void;
        /**
         * Unfreeze panes
         */
        unfreeze(): void;
    }
}
