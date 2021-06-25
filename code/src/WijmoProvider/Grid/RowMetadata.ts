// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Grid {
    export class RowMetadata implements OSFramework.Interface.IRowMetadata {
        private readonly _extraData = '__osRowMetada';
        private _grid: wijmo.grid.FlexGrid;
        private _itemsSource: wijmo.collections.CollectionView;

        constructor(grid: wijmo.grid.FlexGrid) {
            this._grid = grid;
            this._itemsSource = this._grid
                .itemsSource as wijmo.collections.CollectionView;
        }

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
        private _getRowMetadataByRowNumber(row: number): Map<string, any> {
            if (!this._hasMetadataByRowNumber(row))
                this._grid.rows[row].dataItem[this._extraData] = new Map<
                    string,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    any
                >();

            return this._grid.rows[row].dataItem[this._extraData];
        }

        private _hasMetadataByRow(row: any): boolean {
            return row && row.hasOwnProperty(this._extraData);
        }

        private _hasMetadataByRowNumber(row: number): boolean {
            return (
                this._grid.rows[row].dataItem &&
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

        public clearPropertyByRowNumber(
            rowNumber: number,
            propertyName: string
        ): void {
            this.hasOwnPropertyByRowNumber(rowNumber, propertyName) &&
                this._getRowMetadataByRowNumber(rowNumber).delete(propertyName);
        }

        public getMetadataInRow(row: any, propertyName: string): any {
            return this._getRowMetadataInRow(row).get(propertyName);
        }

        public getMetadataByRowNumber(
            rowNumber: number,
            propertyName: string
        ): any {
            return this._getRowMetadataByRowNumber(rowNumber).get(propertyName);
        }

        public hasOwnPropertyByRow(row: any, property: string): boolean {
            return (
                this._hasMetadataByRow(row) &&
                this._getRowMetadataInRow(row).has(property)
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
            row: any,
            propertyName: string,
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
            propertyValue: any
        ): void {
            this._getRowMetadataInRow(row).set(propertyName, propertyValue);
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
