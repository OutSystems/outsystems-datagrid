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

        public clearPropertyByRow(dataItem: any, propertyName: string): void {
            // eslint-disable-next-line prettier/prettier
            if(dataItem.__osRowMetada && dataItem.__osRowMetada.has(propertyName)){
                dataItem.__osRowMetada.delete(propertyName);
            }
        }

        public clearPropertyByRowNumber(
            rowNumber: number,
            propertyName: string
        ): void {
            this.hasOwnProperty(rowNumber, propertyName) &&
                this._getRowMetadata(rowNumber).delete(propertyName);
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

        public isRowValid(dataItem: any, validationLabel: string): boolean {
            let isValid = true;

            if (dataItem.__osRowMetada && dataItem.__osRowMetada.has(validationLabel)) {
                dataItem.__osRowMetada.get(validationLabel).validation.forEach(element => {
                        if (!element) {
                            isValid = false;
                        }
                    });
            }
            return isValid;
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
