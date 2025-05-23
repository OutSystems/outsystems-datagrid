/*!
    *
    * Wijmo Library 5.20251.34
    * https://developer.mescius.com/wijmo
    *
    * Copyright(c) MESCIUS inc. All rights reserved.
    *
    * Licensed under the End-User License Agreement For MESCIUS Wijmo Software.
    * us.sales@mescius.com
    * https://developer.mescius.com/wijmo/licensing
    *
    */
declare module wijmo.grid.selector {
    const SelectorClsNames: {
        columnSelector: string;
        columnSelectorGroup: string;
    };
}
declare module wijmo.grid.selector {
    const _CLS_CB_ITEM: string;
    const _CLS_CB_GROUP: string;
    /**
     * Class that modifies a {@link FlexGrid} {@link Column} by adding checkboxes
     * that can be used to select or de-select rows and groups.
     *
     * The {@link FlexGrid} has a {@link FlexGrid.selectionMode} property that
     * allows users to select multiple rows or row ranges using the mouse or the
     * keyboard.
     *
     * But in some cases you may prefer to provide this functionality by adding
     * a column with checkboxes instead. This will allow users to select rows
     * easily on mobile devices and may provide a more intuitive interface on
     * desktop systems as well.
     *
     * The {@link Selector} class allows you to do this by creating an instance
     * of the {@link Selector} class and setting its {@link column} property to
     * the column where you want the checkboxes to appear. For example:
     *
     * ```typescript
     * // add a SelectorColumn to the first row header column
     * let selector = new SelectorColumn(theGrid, {
     *     itemChecked: () => showCheckedCount()
     * });
     * ```
     *
     * This will add checkboxes to cells in the first row header column.
     * The checkboxes are bound to each row's {@link Row.isSelected} property,
     * so toggling the checkbox toggles the row's selected state.
     *
     * By default, the {@link Selector} also adds checkboxes to the top
     * header cell and to cells in group rows. These cells can be used to
     * select or de-select all rows on the grid and on each group.
     *
     * You may use the {@link showCheckAll} property to turn off the checkbox
     * at the top header cell.
     *
     * The {@link Selector} can also be added to non header columns.
     * For example:
     *
     * ```typescript
     * // add a SelectorColumn to the first row data column
     * let selector = new SelectorColumn(theGrid.columns[0], {
     *     itemChecked: () => showCheckedCount()
     * });
     * ```
     *
     * In this case, the {@link Selector} will add the selection checkboxes
     * to regular grid cells preserving their original data content.
     *
     * **Note**: When you attach a {@link Selector} to a {@link FlexGrid},
     * it will automatically set the grid's {@link FlexGrid.selectionMode}
     * property to {@link SelectionMode.Cell}, since that is the selection
     * mode that makes most sense for the type of selection provided by
     * the {@link Selector}.
     *
     *
     * The grid's {@link FlexGrid.selectionMode} should not be set when
     *  the {@link FlexGrid} is used with {@link Selector}. Specifically,
     * the grid's {@link FlexGrid.selectionMode} should not be set to
     * {@link SelectionMode.ListBox} as it would cause the grid to interfere
     *  with the selector's behavior.
     *
     * The grid's {@link FlexGrid.selectionMode} can be set to any {@link SelectionMode}
     * except the {@link SelectionMode.ListBox} without any issue if required.
     *
     * The following code would cause the issue.
     *
     * ```typescript
     * let selector = new SelectorColumn(theGrid.columns[0], {
     *     itemChecked: () => showCheckedCount()
     * });
     * // set the SelectionMode
     * theGrid.selectionMode = SelectionMode.ListBox;
     * ```
     *
     * In above code-snippet, setting the SelectionMode to ListBox after
     * attaching the Selector to FlexGrid, would cause the interference.
     *
     * As the ListBox selectionMode, uses the {@link Row.isSelected} and
     * the Selector also uses the {@link Row.isSelected}.
     * Hence, the grid's selectionMode to ListBox with Selector, would cause
     * the incorrect selection of rows issue.
     *
     */
    class Selector {
        protected _col: wijmo.grid.Column;
        protected _grid: wijmo.grid.FlexGrid;
        protected _isFixedCol: boolean;
        protected _isBound: boolean;
        protected _showCheckAll: boolean;
        protected _ariaLabel: string;
        protected _clickBnd: any;
        protected _mousedownBnd: any;
        protected _pressSpaceBnd: any;
        /**
         * Initializes a new instance of the {@link Selector} class.
         *
         * @param column The {@link Column} that this {@link Selector} should customize,
         * or a reference to a {@link FlexGrid} whose first column will be customized.
         * @param options An object containing initialization data for the object.
         */
        constructor(column?: wijmo.grid.Column | wijmo.grid.FlexGrid, options?: any);
        private _copy;
        /**
         * Gets or sets the {@link Column} to be used by this {@link Selector}.
         */
        column: wijmo.grid.Column | null;
        /**
         * Gets or sets a value that determines whether to show a
         * 'Check All' items checkbox on the column header.
         *
         * The default value for this property is **true**.
         */
        showCheckAll: boolean;
        /**
        *  Gets or sets the  aria label property of selector.
        *
        * The default value for this property is **''**.
        */
        ariaLabel: string;
        /**
         * Occurs before the value of the {@link column} property changes.
         */
        readonly columnChanging: Event<Selector, CancelEventArgs>;
        /**
         * Raises the {@link columnChanging} event.
         *
         * @param e {@link CancelEventArgs} that contains the event data.
         * @return True if the event was not canceled.
         */
        onColumnChanging(e: wijmo.CancelEventArgs): boolean;
        /**
         * Occurs after the value of the {@link column} property changes.
         */
        readonly columnChanged: Event<Selector, EventArgs>;
        /**
         * Raises the {@link columnChanged} event.
         */
        onColumnChanged(e?: wijmo.EventArgs): void;
        /**
         * Occurs when the user checks an item on this column.
         */
        readonly itemChecked: Event<Selector, EventArgs>;
        /**
         * Raises the {@link itemChecked} event.
         */
        onItemChecked(e?: wijmo.EventArgs): void;
        protected _initialize(): void;
        private _pressSpace;
        private _click;
        private _mousedown;
        private _isGroupRow;
        private _getRowChecked;
        private _setRangeChecked;
        private _formatItem;
        private _getColumn;
    }
    /**
     * Class that adds extra checkboxes to header and group cells of
     * {@link FlexGrid} boolean columns to allow setting the values for
     * all items or groups.
     *
     * ** Note **: When you attach a {@link BooleanChecker} to a
     * {@link Column}, you may also want to set the column's
     * {@link Column.aggregate} property to {@link Aggregate.First},
     * so the grid will create cells on group header rows to hold
     * the checkboxes used to set the boolean values for the groups.
     */
    class BooleanChecker extends Selector {
        /**
         * Initializes a new instance of the {@link BooleanChecker} class.
         *
         * @param column The {@link Column} that this {@link BooleanChecker} should customize.
         * @param options An object containing initialization data for the object.
         */
        constructor(column?: wijmo.grid.Column, options?: any);
        onColumnChanged(e?: wijmo.EventArgs): void;
        protected _initialize(): void;
    }
}
declare module wijmo.grid.selector {
}
