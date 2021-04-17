namespace GridAPI.Structures {
    /**
     * Representation of Row-Data, used to OS communication
     */
    export class RowData implements OSFramework.Interface.ISerializable {
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
            grid: OSFramework.Grid.IGrid,
            rowIndex: number,
            dataItem: any,
            selected?: Array<BindingValue>
        ) {
            this.rowIndex = rowIndex;
            if (grid.isSingleEntity) {
                this.dataItem = OSFramework.Helper.Flatten(dataItem);
            } else {
                this.dataItem = dataItem;
            }

            this.selected = selected || new Array<BindingValue>();
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public serialize(): any {
            return {
                ...this,
                dataItem: JSON.stringify(this.dataItem)
            };
        }
    }
}
