namespace OSFramework.Feature {
    /**
     * Interface for freezing columns
     */
    export interface IColumnPicker {
        /**
         * Responsible for defining whether or not non visible columns will be shown on column picker
         */
        setShowHiddenColumns(showHiddenColumns: boolean): void;
    }
}
