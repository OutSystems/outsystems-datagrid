// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    export class Styling
        implements OSFramework.Feature.IStyling, OSFramework.Interface.IBuilder
    {
        private _grid: Grid.IGridWijmo;
        private _rowHeight: number;

        constructor(grid: Grid.IGridWijmo, rowHeight: number) {
            this._grid = grid;
            this._rowHeight = rowHeight;
        }

        private _getCssClass(columnID: string): Array<string> {
            let classList = [];
            const column = this._grid.getColumn(columnID);

            if (column) {
                const classListString = column.provider.cssClass || ' ';
                classList = classListString.split(' ');
            }

            return classList;
        }

        private _getCssClassAll(columnID: string): Array<string> {
            let classList = [];
            const column = this._grid.getColumn(columnID);

            if (column) {
                const classListString = column.provider.cssClassAll || ' ';
                classList = classListString.split(' ');
            }

            return classList;
        }

        public get rowHeight(): number {
            return this._rowHeight;
        }

        public addColumnCssClass(
            columnID: string,
            className: string,
            includeHeader: boolean
        ): void {
            const column = this._grid.getColumn(columnID);
            if (column) {
                if (includeHeader) {
                    const classList = this._getCssClassAll(columnID);
                    const index = classList.indexOf(className);
                    if (index === -1) {
                        classList.push(className);
                        column.provider.cssClassAll = classList.join(' ');
                    }
                } else {
                    const classList = this._getCssClass(columnID);
                    const index = classList.indexOf(className);
                    if (index === -1) {
                        classList.push(className);
                        column.provider.cssClass = classList.join(' ');
                    }
                }
            } else {
                throw new Error(
                    OSFramework.Enum.ErrorMessages.InvalidColumnIdentifier
                );
            }
        }

        public build(): void {
            // This value doesn't change (48px)
            const colHeadersHeight = 48;
            // Set default height for column headers
            this._grid.provider.columnHeaders.rows.defaultSize =
                colHeadersHeight;

            // Sets the initial rowHeight
            if (this._rowHeight !== undefined) {
                this.changeRowHeight(this._rowHeight);
            }
        }

        public changeRowHeight(rowHeight: number): void {
            this._rowHeight = rowHeight;
            this._grid.provider.cells.rows.defaultSize = rowHeight;
        }

        public removeColumnCssClass(columnID: string, className: string): void {
            const column = this._grid.getColumn(columnID);
            if (column) {
                //remove from class list
                let classList = this._getCssClass(columnID);
                let index = classList.indexOf(className);
                if (index > -1) {
                    classList.splice(index, 1);
                }
                column.provider.cssClass = classList.join(' ');

                //remove from classAll list
                classList = this._getCssClassAll(columnID);
                index = classList.indexOf(className);
                if (index > -1) {
                    classList.splice(index, 1);
                }

                column.provider.cssClassAll = classList.join(' ');
            } else {
                throw new Error(
                    OSFramework.Enum.ErrorMessages.InvalidColumnIdentifier
                );
            }
        }

        public setColumnWordWrap(columnID: string, value: boolean): void {
            // validate if column exists
            const column = this._grid.getColumn(columnID);
            if (column) {
                column.provider.wordWrap = value;
            } else {
                throw new Error(
                    OSFramework.Enum.ErrorMessages.InvalidColumnIdentifier
                );
            }
        }
    }
}
