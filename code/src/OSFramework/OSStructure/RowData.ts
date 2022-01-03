// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSStructure {
    /**
     * Representation of Row-Data, used to OS communication
     */
    export class RowData implements Interface.ISerializable {
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
        constructor(
            grid: Grid.IGrid,
            rowIndex: number,
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
            dataItem: any,
            selected?: Array<BindingValue>
        ) {
            this._grid = grid;
            this.rowIndex = rowIndex;
            this.dataItem = dataItem;
            this.selected = selected || new Array<BindingValue>();
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public serialize(): any {
            return {
                rowIndex: this.rowIndex,
                selected: this.selected,
                dataItem: this._grid.dataSource.toOSFormat(this.dataItem)
            };
        }
    }

    export class CheckedRowData implements Interface.ISerializable {
        private _grid: Grid.IGrid;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public dataItem: any;

        /**
         * Represent Checked Row data
         * @param dataItem Full data source of that row
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(
            grid: Grid.IGrid,
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
            dataItem: any
        ) {
            this._grid = grid;
            this.dataItem = dataItem;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public serialize(): any {
            return {
                dataItem: this._grid.dataSource.toOSFormat(this.dataItem)
            };
        }
    }
}
