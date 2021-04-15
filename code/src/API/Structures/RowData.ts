namespace GridAPI.Structures {
    /**
     * Representation of Row-Data, used to OS communication
     */
    export class RowData implements ISerializable {
        private _grid: Grid.IGrid;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public dataItem: any;
        public rowIndex: number;
        public selected: Array<BindingValue>;

        /**
         * Represent Row data
         * @param rowIndex Index of the Grid's row
         * @param dataItem Full data source of that row
         * @param selected Define dataItem in a key-value pair information. Used to communicate selected cells in a row 
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(grid: Grid.IGrid, rowIndex: number, dataItem: any, selected?: Array<BindingValue>) {
            this._grid = grid;
            this.rowIndex = rowIndex;
            this.selected = selected || new Array<BindingValue>();
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public serialize(): any {
            return {
                ...this,
                dataItem: this._grid.dataSource.toOSFormat(this.dataItem)
            };
        }
    }
}