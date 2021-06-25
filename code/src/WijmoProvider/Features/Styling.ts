// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    export class Styling
        implements
            OSFramework.Feature.IStyling,
            OSFramework.Interface.IBuilder {
        private _grid: WijmoProvider.Grid.IGridWijmo;
        private _rowHeight: number;

        constructor(grid: WijmoProvider.Grid.IGridWijmo, rowHeight: number) {
            this._grid = grid;
            this._rowHeight = rowHeight;
        }

        private _getCssClass(columnID: string): Array<string> {
            let classList = [];
            const classListString =
                this._grid.getColumn(columnID).provider.cssClass || ' ';
            classList = classListString.split(' ');

            return classList;
        }

        private _getCssClassAll(columnID: string): Array<string> {
            let classList = [];
            const classListString =
                this._grid.getColumn(columnID).provider.cssClassAll || ' ';
            classList = classListString.split(' ');

            return classList;
        }

        public get rowHeight(): number {
            return this._rowHeight;
        }

        public addCssClass(columnID: string, className: string): void {
            const classList = this._getCssClass(columnID);
            const index = classList.indexOf(className);
            if (index === -1) {
                classList.push(className);
                this._grid.getColumn(
                    columnID
                ).provider.cssClass = classList.join(' ');
            }
        }

        public addCssClassAll(columnID: string, className: string): void {
            const classList = this._getCssClassAll(columnID);
            const index = classList.indexOf(className);
            if (index === -1) {
                classList.push(className);
                this._grid.getColumn(
                    columnID
                ).provider.cssClassAll = classList.join(' ');
            }
        }

        public build(): void {
            // This value doesn't change (48px)
            const colHeadersHeight = 48;
            // Set default height for column headers
            this._grid.provider.columnHeaders.rows.defaultSize = colHeadersHeight;

            // Sets the initial rowHeight
            if (this._rowHeight !== undefined) {
                this.changeRowHeight(this._rowHeight);
            }
        }

        public changeRowHeight(rowHeight: number): void {
            this._rowHeight = rowHeight;
            this._grid.provider.cells.rows.defaultSize = rowHeight;
        }

        public removeCssClass(columnID: string, className: string): void {
            const classList = this._getCssClass(columnID);

            const index = classList.indexOf(className);
            if (index > -1) {
                classList.splice(index, 1);
            }
            this._grid.getColumn(columnID).provider.cssClass = classList.join(
                ' '
            );
        }

        public removeCssClassAll(columnID: string, className: string): void {
            const classList = this._getCssClassAll(columnID);

            const index = classList.indexOf(className);
            if (index > -1) {
                classList.splice(index, 1);
            }

            this._grid.getColumn(
                columnID
            ).provider.cssClassAll = classList.join(' ');
        }
    }
}
