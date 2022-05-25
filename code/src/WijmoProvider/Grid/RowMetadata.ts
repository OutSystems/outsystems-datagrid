// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Grid {
    export class RowMetadata implements OSFramework.Interface.IRowMetadata {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _configs: any;
        private readonly _extraData = '__osRowMetadata';
        private _grid: wijmo.grid.FlexGrid;
        private _itemsSource: wijmo.collections.CollectionView;

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        constructor(grid: wijmo.grid.FlexGrid, configs: any) {
            this._grid = grid;
            this._itemsSource = this._grid
                .itemsSource as wijmo.collections.CollectionView;
            this._configs = configs;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _getRowMetadataByRowKey(rowKey: string): Map<string, any> {
            const rowIndex = this.getRowIndexByKey(rowKey);

            if (!this._hasMetadataByRowKey(rowIndex))
                this._itemsSource.sourceCollection[rowIndex][this._extraData] =
                    new Map<
                        string,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        any
                    >();

            return this._itemsSource.sourceCollection[rowIndex][
                this._extraData
            ];
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _getRowMetadataByRowNumber(row: number): Map<string, any> {
            if (!this._hasMetadataByRowNumber(row))
                this._grid.rows[row].dataItem[this._extraData] = new Map<
                    string,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    any
                >();

            return this._grid.rows[row].dataItem[this._extraData];
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _getRowMetadataInRow(row: any): Map<string, any> {
            if (!this._hasMetadataByRow(row))
                row[this._extraData] = new Map<
                    string,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    any
                >();

            return row[this._extraData];
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _hasMetadataByRow(row: any): boolean {
            return row && row[this._extraData];
        }

        //Note: This method should have the name changed since it used the row index/number instead of the row key
        private _hasMetadataByRowKey(row: number): boolean {
            return (
                this._itemsSource.sourceCollection[row] &&
                this._itemsSource.sourceCollection[row][this._extraData]
            );
        }

        private _hasMetadataByRowNumber(row: number): boolean {
            return (
                this._grid.rows[row]?.dataItem &&
                this._grid.rows[row].dataItem[this._extraData]
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

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public clearPropertyByRow(dataItem: any, propertyName: string): void {
            // eslint-disable-next-line prettier/prettier
            if (
                dataItem &&
                dataItem[this._extraData] &&
                dataItem[this._extraData].has(propertyName)
            ) {
                dataItem[this._extraData].delete(propertyName);
            }
        }

        /**
         * Responsible for cleaning metadata information for a given row key and property
         *
         * @param {string} key Index row reference, works only in the current page
         * @param {string} propertyName Metadata property to be clear
         * @memberof RowMetadata
         */
        public clearPropertyByRowKey(key: string, propertyName: string): void {
            this.hasOwnPropertyByRowKey(key, propertyName) &&
                this._getRowMetadataByRowKey(key).delete(propertyName);
        }
        /**
         * Responsible for cleaning metadata information for a given row number and property
         *
         * @param {number} rowNumber Index row reference, works only in the current page
         * @param {string} propertyName Metadata property to be clear
         * @memberof RowMetadata
         */
        public clearPropertyByRowNumber(
            rowNumber: number,
            propertyName: string
        ): void {
            this.hasOwnPropertyByRowNumber(rowNumber, propertyName) &&
                this._getRowMetadataByRowNumber(rowNumber).delete(propertyName);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public getMetadataByRowKey(key: string, propertyName: string): any {
            return this._getRowMetadataByRowKey(key).get(propertyName);
        }

        public getMetadataByRowNumber(
            rowNumber: number,
            propertyName: string
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ): any {
            return this._getRowMetadataByRowNumber(rowNumber).get(propertyName);
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public getMetadataInRow(row: any, propertyName: string): any {
            return this._getRowMetadataInRow(row).get(propertyName);
        }

        public getRowIndexByKey(rowKey: string): number {
            const rowIndex = this._itemsSource.sourceCollection.findIndex(
                (item) =>
                    _.get(item, this._configs.keyBinding).toString() === rowKey
            );

            return rowIndex;
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public hasOwnPropertyByRow(row: any, property: string): boolean {
            return (
                this._hasMetadataByRow(row) &&
                this._getRowMetadataInRow(row).has(property)
            );
        }

        public hasOwnPropertyByRowKey(
            rowKey: string,
            property: string
        ): boolean {
            const rowIndex = this.getRowIndexByKey(rowKey);

            return (
                this._hasMetadataByRowKey(rowIndex) &&
                this._getRowMetadataByRowKey(rowKey).has(property)
            );
        }

        public hasOwnPropertyByRowNumber(
            rowNumber: number,
            property: string
        ): boolean {
            return (
                this._hasMetadataByRowNumber(rowNumber) &&
                this._getRowMetadataByRowNumber(rowNumber).has(property)
            );
        }

        public setMetadataByRow(
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
            row: any,
            propertyName: string,
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
            propertyValue: any
        ): void {
            this._getRowMetadataInRow(row).set(propertyName, propertyValue);
        }

        public setMetadataByRowKey(
            rowKey: string,
            propertyName: string,
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
            propertyValue: any
        ): void {
            this._getRowMetadataByRowKey(rowKey).set(
                propertyName,
                propertyValue
            );
        }

        public setMetadataByRowNumber(
            rowNumber: number,
            propertyName: string,
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
            propertyValue: any
        ): void {
            this._getRowMetadataByRowNumber(rowNumber).set(
                propertyName,
                propertyValue
            );
        }
    }
}
