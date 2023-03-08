// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
    export class ClickEvent
        implements OSFramework.DataGrid.Feature.IClickEvent
    {
        protected _grid: Providers.DataGrid.Wijmo.Grid.IGridWijmo;

        constructor(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            grid: Providers.DataGrid.Wijmo.Grid.IGridWijmo
        ) {
            this._grid = grid;
        }

        // option 3
        private _raiseCellClickEvent(e: MouseEvent) {
            const ht = this._grid.provider.hitTest(e);
            if (ht.cellType === wijmo.grid.CellType.Cell) {
                const column = this._grid.getColumns()[ht.col];
                const columnWidgetId = column.widgetId;
                const rowNumber = ht.row;
                const binding = column.config.binding;
                const line = _.cloneDeep(
                    this._grid.provider.rows[rowNumber].dataItem
                );
                this._grid.rowMetadata.clear(line);

                this._grid.gridEvents.trigger(
                    OSFramework.DataGrid.Event.Grid.GridEventType.OnCellClick,
                    this._grid,
                    columnWidgetId,
                    rowNumber,
                    binding,
                    JSON.stringify(
                        this._grid.isSingleEntity
                            ? OSFramework.DataGrid.Helper.Flatten(line)
                            : line
                    )
                );
            }
        }

        // option 3
        public setCellClickEvent(callback: (ev: MouseEvent) => any) {
            // this._grid.provider.formatItem.addHandler(
            //     (
            //         grid: wijmo.grid.FlexGrid,
            //         event: wijmo.grid.FormatItemEventArgs
            //     ) => {
            //         event.cell.removeEventListener('click', callback);
            //         event.cell.addEventListener('click', callback);
            //     }
            // );
            this._grid.provider.addEventListener(
                this._grid.provider.hostElement,
                'click',
                callback
            );
            // this._grid.provider.removeEventListener(
            //     this._grid.provider.hostElement,
            //     'click',
            //     callback
            // );
        }

        public build(): void {
            this.setCellClickEvent(this._raiseCellClickEvent.bind(this));
        }
    }
}
