// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Grid {
    /**
     * Exposed methods to manipulate RowMetadata
     */
    export interface IRowMetadata {
        /**
         * Responsible for cleaning metadata information
         * @param dataItem object to clear metadata, if ignored the whole sourceCollection will be cleaned
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        clear(dataItem?: any): void;
        /**
         * Responsible for cleaning metadata information for a given row
         * @param row Index row reference, works only in the current page
         */
        clearByRow(row: number): void;
        /**
         * Responsible for cleaning metadata information for a given property
         * @param propertyName Metadata property to be clear
         */
        clearProperty(propertyName: string): void;
        /**
         * Responsible for cleaning metadata information for a given row and property
         * @param row Index row reference, works only in the current page
         * @param propertyName Metadata property to be clear
         */
        clearPropertyByRow(row: number, propertyName: string): void;
        /**
         * Responsible for retrieving metadata information for a given row and property
         * @param row Index row reference, works only in the current page
         * @param propertyName Metadata property
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getMetadata(row: number, propertyName: string): any;
        /**
         * Verify the presence of metadata information for a given row and property
         * @param row Index row reference, works only in the current page
         * @param property Metadata property
         */
        hasOwnProperty(row: number, property: string): boolean;
        /**
         * Stores RowMetadata information for a given row and property
         * @param row Index row reference, works only in the current page
         * @param propertyName Metadata property
         * @param propertyValue Value to be stored
         */
        setMetadata(
            row: number,
            propertyName: string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            propertyValue: any
        ): void;
    }

    export class RowMetadata implements IRowMetadata {
        private readonly _extraData = '__osRowMetada';
        private _grid: wijmo.grid.FlexGrid;
        private _itemsSource: wijmo.collections.CollectionView;

        constructor(grid: wijmo.grid.FlexGrid) {
            this._grid = grid;
            this._itemsSource = this._grid
                .itemsSource as wijmo.collections.CollectionView;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _getRowMetadata(row: number): Map<string, any> {
            if (!this._hasMetadata(row))
                this._grid.rows[row].dataItem[this._extraData] = new Map<
                    string,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    any
                >();

            return this._grid.rows[row].dataItem[this._extraData];
        }

        private _hasMetadata(row: number): boolean {
            return (
                this._grid.rows[row].dataItem &&
                this._grid.rows[row].dataItem.hasOwnProperty(this._extraData)
            );
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public clear(dataItem?: any): void {
            if (dataItem) {
                delete dataItem[this._extraData];
            } else {
                this._itemsSource.sourceCollection.forEach(
                    (p) => delete p[this._extraData]
                );
            }
        }

        public clearByRow(row: number): void {
            delete this._grid.rows[row].dataItem[this._extraData];
        }

        public clearProperty(propertyName: string): void {
            // Iterate all rows from the grid using the sourceCollection (not just the rows from the current page - items)
            this._itemsSource.sourceCollection.forEach((p) => {
                p[this._extraData] &&
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (p[this._extraData] as Map<string, any>).delete(
                        propertyName
                    );
            });
        }

        public clearPropertyByRow(row: number, propertyName: string): void {
            this.hasOwnProperty(row, propertyName) &&
                this._getRowMetadata(row).delete(propertyName);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public getMetadata(row: number, propertyName: string): any {
            return this._getRowMetadata(row).get(propertyName);
        }

        public hasOwnProperty(row: number, property: string): boolean {
            return (
                this._hasMetadata(row) &&
                this._getRowMetadata(row).has(property)
            );
        }

        public setMetadata(
            row: number,
            propertyName: string,
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
            propertyValue: any
        ): void {
            this._getRowMetadata(row).set(propertyName, propertyValue);
        }
    }
}
