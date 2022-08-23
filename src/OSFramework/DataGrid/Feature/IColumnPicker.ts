// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Feature {
    /**
     * Interface for freezing columns
     */
    export interface IColumnPicker {
        handleColumnPickerChangeEvent(column: wijmo.grid.Column): void;
        /**
         * Responsible for defining whether or not non visible columns will be shown on column picker
         */
        setShowHiddenColumns(showHiddenColumns: boolean): void;
    }
}
