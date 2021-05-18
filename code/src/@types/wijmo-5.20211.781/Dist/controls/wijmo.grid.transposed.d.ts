/*!
    *
    * Wijmo Library 5.20211.781
    * http://wijmo.com/
    *
    * Copyright(c) GrapeCity, Inc.  All rights reserved.
    *
    * Licensed under the GrapeCity Commercial License.
    * sales@wijmo.com
    * wijmo.com/products/wijmo-5/license/
    *
    */
declare module wijmo.grid.transposed {
    /**
     * Provides custom merging for {@link TransposedGrid} controls.
     */
    class _MergeManager extends wijmo.grid.MergeManager {
        /**
         * Gets a {@link CellRange} that specifies the merged extent of a cell
         * in a {@link GridPanel}.
         *
         * @param p The {@link GridPanel} that contains the range.
         * @param r The index of the row that contains the cell.
         * @param c The index of the column that contains the cell.
         * @param clip Specifies whether to clip the merged range to the grid's current view range.
         * @return A {@link CellRange} that specifies the merged range, or null if the cell is not merged.
         */
        getMergedRange(p: wijmo.grid.GridPanel, r: number, c: number, clip?: boolean): wijmo.grid.CellRange;
    }
}
declare module wijmo.grid.transposed {
    /**
     * Extends the {@link FlexGrid} control to display data using a transposed
     * layout, where columns represent data items and rows represent item
     * properties.
     *
     * Features based on regular (non-transposed) data sources only apply to the
     * original data source, so you can sort, filter, group, or paginate items before
     * assigning them to the {@link TransposedGrid}, but if you later change those
     * parameters, the grid will not be automatically updated.
     *
     * Also, some regular {@link FlexGrid} features are not available in the
     * {@link TransposedGrid} because they don't make sense with transposed data
     * sources.
     *
     * For example, adding or removing rows in a transposed grid would mean adding
     * or removing properties to the data items. For this reason, the {@link allowAddNew}
     * and {@link allowDelete} properties are disabled.
     *
     * Also, the {@link autoGenerateColumns} property has no effect on the
     * {@link TransposedGrid}, which has an {@link autoGenerateRows} property instead.
     *
     * The list of disabled properties includes the following:
     * {@link FlexGrid.allowAddNew}, {@link FlexGrid.allowDelete},
     * {@link FlexGrid.allowSorting}, {@link FlexGridFilter},
     * {@link Selector}.
     */
    class TransposedGrid extends wijmo.grid.FlexGrid {
        protected _sourceItems: any;
        protected _keyPrefix: string;
        protected _autoGenRows: boolean;
        protected _toRowInfo: any;
        _rowInfo: wijmo.grid.ColumnCollection;
        /**
         * Initializes a new instance of the {@link TransposedGrid} class.
         *
         * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
         * @param options JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?: any);
        /**
         * Gets or sets a value that determines whether the grid should generate
         * rows automatically based on the {@link itemsSource}.
         *
         * The default value for this property is <b>true</b>.
         */
        autoGenerateRows: boolean;
        /**
         * Gets or sets an array used to define hierarchical row groups.
         *
         * The items in the array should be JSON objects with properties of
         * {@link Column} objects, plus three optional members:
         *
         * * 'rows' array containing an array of child rows,
         * * 'collapseTo' string containing the binding of the child row
         *   that should remain visible when the group is collapsed.
         * * 'isCollapsed' boolean that determines if the group should be
         *   initially collapsed.
         *
         * Please note that 'width' property defines row header width.
         * If width is defined in more than one group/row header that corresponds the same header column,
         * the maximal width will be used.
         *
         * Moreover, it is possible to define row height using 'height' property.
         * This property should be used for empty rows which don't contain child rows.
         * Using this property for rows which contain child ones will have no effect.
         *
         * For example, the code below generates a grid with two row groups,
         * both initially collapsed:
         *
         * ```typescript
         * new TransposedGrid('#trnGrid', {
         *     autoGenerateRows: false,
         *     rowGroups: [
         *         { header: 'Group 1', width: 100, align: 'center', collapseTo: 'country', isCollapsed: true, rows: [
         *             { binding: 'id', header: 'ID', width: 20, height: 50 },
         *             { binding: 'date', header: 'Date', width: 60, dataType: 'Date' },
         *             { binding: 'country', header: 'Country', width: 80, dataType: 'String' },
         *             { binding: 'active', header: 'Active', width: 20, dataType: 'Boolean' },
         *         ]},
         *         { header: 'Group 2', width: 100, align: 'center', collapseTo: 'sales', isCollapsed: true, rows: [
         *             { binding: 'sales', header: 'Sales', width: 60, dataType: 'Number' },
         *             { binding: 'expenses', header: 'Expenses', width: 60, dataType: 'Number' },
         *         ]}
         *     ],
         *     itemsSource: getData(20)
         * });
         * ```
         *
         * Note that these row groups will be represented by row header with two columns,
         * 100 and 80 pixels wide, respectively.
         */
        rowGroups: any[];
        refresh(fullUpdate?: boolean): void;
        allowAddNew: boolean;
        allowDelete: boolean;
        allowSorting: wijmo.grid.AllowSorting;
        /**
         * Not supported. Use {@link rowGroups} instead.
         */
        columnGroups: any[];
        onRowEditEnded(e: wijmo.grid.CellRangeEventArgs): void;
        protected _getCollectionView(value: any): wijmo.collections.ICollectionView;
        _getColumnTypes(arr: any[]): wijmo.IBindingInfo[];
        _copy(key: string, value: any): boolean;
        onLoadedRows(e?: wijmo.EventArgs): void;
        _getBindingColumn(p: wijmo.grid.GridPanel, r: number, c: wijmo.grid.Column): wijmo.grid.Column;
        private _copyProps;
        private _updateRowHeaders;
        _rowInfoChanged(): void;
        _sourceViewChanged(sender: wijmo.collections.ICollectionView, e: wijmo.collections.NotifyCollectionChangedEventArgs): void;
        _transposeItemsSource(arr: any[]): wijmo.collections.ObservableArray;
        _supportsProxies(): boolean;
        _createProxy(arr: any[], rowInfo: any, proxyKeys: string[]): any;
        _createTransposedObject(arr: any[], rowInfo: any, keyPrefix: string): {
            _arr: any[];
            _rowInfo: any;
        };
        _getRowInfo(arr: any[]): any[];
    }
    /**
     * This class is for internal use only.
     */
    class TransposedGridRow extends wijmo.grid.Column {
        private _height;
        /**
         * Gets or sets the height of the row.
         * Setting this property to null or negative values causes the element to use the
         * parent collection's default size.
         */
        height: number | null;
    }
}
declare module wijmo.grid.transposed {
    /**
     * Provides custom handling of row groups for {@link TransposedGrid} controls.
     */
    class _RowGroupHandler extends wijmo.grid._ColumnGroupHandler {
        /**
         * Initializes a new instance of the {@link _RowGroupHandler} class.
         *
         * @param g {@link TransposedGrid} that owns this {@link _RowGroupHandler}.
         */
        constructor(grid: TransposedGrid);
        /**
         * Initializes the column groups based on an array of
         * column definition objects.
         *
         * @param arr Array of column definition objects that defines the groups.
         */
        createColumnGroups(arr: any[]): void;
        /**
         * Gets the {@link ColumnGroup} that contains a given row and column.
         *
         * @param r Index of the row containted in the group.
         * @param c Index of the column containted in the group.
         */
        getColumnGroup(r: number, c: number): wijmo.grid.ColumnGroup;
        private _createRowGroups;
        private _addRowGroup;
    }
    /**
     * Extends the {@link ColumnGroup} class to provide custom row groups
     * for {@link TransposedGrid} controls.
     */
    class _RowGroup extends wijmo.grid.ColumnGroup {
        private _height;
        /**
         * Initializes a new instance of the {@link _RowGroup} class.
         *
         * @param options JavaScript object containing initialization data for the instance.
         * @param parent Parent group, or null for top-level groups.
         */
        constructor(options: any, parent: _RowGroup);
        /**
         * Gets or sets the collection of child {@link ColumnGroup} columns.
         * Remark: in fact, the collection represents child rows of the {@link _RowGroup} class.
         */
        columns: wijmo.grid.ColumnGroup[];
        readonly rows: wijmo.grid.ColumnGroup[];
        /**
         * Gets or sets the height of the row.
         * Setting this property to null or negative values causes the element to use the
         * parent collection's default size.
         */
        height: number | null;
        _copy(key: string, value: any): boolean;
        _updateCollapsedState(): void;
        _expandRange(maxLevel: number): void;
        _shiftRange(delta: number): void;
    }
}
declare module wijmo.grid.transposed {
}
