// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
    export class ToolTip
        implements
            OSFramework.DataGrid.Feature.ITooltip,
            OSFramework.DataGrid.Interface.IBuilder,
            OSFramework.DataGrid.Interface.IDisposable
    {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _eventMouseEnter: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _eventMouseOut: any;
        private _grid: Grid.IGridWijmo;
        private _toolTip: wijmo.Tooltip;

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
            this._toolTip = new wijmo.Tooltip();
            this._eventMouseEnter = this._onMouseEnter.bind(this);
            this._eventMouseOut = this._onMouseOut.bind(this);
        }

        private _onMouseEnter(e: MouseEvent): void {
            const _currTarget: HTMLElement = e.currentTarget as HTMLElement;
            const ht = this._grid.provider.hitTest(_currTarget);

            const cellType = ht.cellType;
            if (
                cellType === wijmo.grid.CellType.Cell ||
                cellType === wijmo.grid.CellType.ColumnFooter
            ) {
                //Check if we do have data available, for instance while using filters that make the Grid without results
                if (this._grid.provider.rows.length > 0) {
                    this._setCellToolTip(
                        _currTarget,
                        ht.getColumn().binding,
                        ht.row
                    );
                }
            } else if (cellType === wijmo.grid.CellType.ColumnHeader) {
                // If the Column Header is from a Group Column, we need to use a different approach that the regular header
                if (
                    _currTarget.classList.contains(
                        Helper.Constants.CssClasses.ColumnGroup
                    )
                )
                    this._setColumnGroupHeaderTooltip(_currTarget);
                else this._setHeaderTooltip(_currTarget, ht);
            }
        }

        private _onMouseOut(): void {
            this._toolTip.hide();
        }

        private _setCellToolTip(
            cell: HTMLElement,
            binding: string,
            row: number
        ): void {
            const sanitizedValue = OSFramework.DataGrid.Helper.Sanitize(
                cell.innerText
            );

            const isInvalid = this._grid.features.validationMark.isInvalid(
                row,
                binding
            );

            if (cell.querySelector(Helper.Constants.CssClasses.CellClass)) {
                cell = cell.querySelector(
                    Helper.Constants.CssClasses.CellClass
                );
            }

            //Make sure to apply the correct tooltipClass
            this._toolTipClass(isInvalid);

            //If the cell is valid
            if (isInvalid === false) {
                if (
                    cell.scrollWidth > cell.clientWidth &&
                    sanitizedValue !== undefined &&
                    sanitizedValue !== ''
                ) {
                    //JS asserts the previous declaration as true when they are equal
                    this._toolTip.show(cell, sanitizedValue); // show tooltip if text is overflow/hidden
                } else {
                    this._toolTip.hide();
                }
            }
            //Otherwise (If the cell is invalid)
            else {
                this._toolTip.show(
                    cell,
                    this._grid.features.validationMark.errorMessage(
                        row,
                        binding
                    )
                );
            }
        }

        private _setColumnGroupHeaderTooltip(cell: HTMLElement) {
            // Do nothing if a tooltip is already set for this column
            if (this._toolTip.getTooltip(cell)) return;
            // Otherwise, the tooltip will be the header text
            const headerTooltip = OSFramework.DataGrid.Helper.Sanitize(
                cell.innerText
            );

            this._toolTipClass(false);
            this._toolTip.show(cell, headerTooltip);
        }

        private _setHeaderTooltip(
            cell: HTMLElement,
            htCell: wijmo.grid.HitTestInfo
        ) {
            const sanitizedValue = OSFramework.DataGrid.Helper.Sanitize(
                cell.innerText
            );

            const column = this._grid.getColumn(htCell.getColumn().binding);
            const widgetId = column?.widgetId;
            let headerTooltip = column?.config.headerTooltip;

            if (cell && headerTooltip) {
                if (
                    !!document.getElementById(headerTooltip) &&
                    headerTooltip !== widgetId
                ) {
                    // If headerTooltip is an Id of an Element, it should be manipulated to be a selector.
                    // setTooltip() wijmo method allows us to render the content of another element using its id
                    headerTooltip = '#' + headerTooltip;
                }
            } else if (
                cell &&
                sanitizedValue !== undefined &&
                sanitizedValue !== ''
            ) {
                headerTooltip = sanitizedValue;
            }

            this._toolTipClass(false);
            this._toolTip.show(cell, headerTooltip);
        }

        private _toolTipClass(isInvalid: boolean): void {
            if (isInvalid === true)
                this._toolTip.cssClass =
                    Helper.Constants.CssClasses.TooltipErrorValidation;
            else {
                this._toolTip.cssClass = '';

                // Implementation of the workaround provided by Wijmo related to ROU-4207 issue.
                // To be removed after Wijmo fix.
                if (wijmo.Tooltip._eTip)
                    wijmo.Tooltip._eTip.setAttribute(
                        Helper.Constants.HTMLAttributes.Class,
                        Helper.Constants.CssClasses.Tooltip
                    );
            }
        }

        public build(): void {
            this._grid.provider.formatItem.addHandler(
                (s: wijmo.grid.FlexGrid, e: wijmo.grid.FormatItemEventArgs) => {
                    e.cell.removeEventListener(
                        Helper.Constants.HTMLEvent.MouseOver,
                        this._eventMouseEnter
                    );
                    e.cell.addEventListener(
                        Helper.Constants.HTMLEvent.MouseOver,
                        this._eventMouseEnter
                    );

                    e.cell.removeEventListener(
                        Helper.Constants.HTMLEvent.MouseOut,
                        this._eventMouseOut
                    );
                    e.cell.addEventListener(
                        Helper.Constants.HTMLEvent.MouseOut,
                        this._eventMouseOut
                    );
                }
            );
        }

        public dispose(): void {
            this._toolTip.dispose();
            this._toolTip = undefined;
        }

        public setColumnGroupHeaderTooltip(
            cell: HTMLElement,
            toolTipContent: string
        ): void {
            if (
                cell.classList.contains(Helper.Constants.CssClasses.ColumnGroup)
            ) {
                this._toolTip.setTooltip(cell, toolTipContent);
            } else {
                console.warn(
                    OSFramework.DataGrid.Enum.ErrorMessages
                        .SetColumnHeaderTooltip
                );
            }
        }
    }
}
