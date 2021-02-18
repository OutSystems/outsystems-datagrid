// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Grid {
    export interface IRowMetadata {
        clear(): void;
        clearByRow(row: number): void;
        clearProperty(propertyName: string): void;
        clearPropertyByRow(row: number, propertyName: string): void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getMetadata(row: number, propertyName: string): any;
        hasOwnProperty(row: number, property: string): boolean;
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

        public clear(): void {
            this._itemsSource.items.forEach((p) => delete p[this._extraData]);
        }

        public clearByRow(row: number): void {
            delete this._grid.rows[row].dataItem[this._extraData];
        }

        public clearProperty(propertyName: string): void {
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
                this._hasMetadata(row) && this._getRowMetadata(row).has(property)
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
