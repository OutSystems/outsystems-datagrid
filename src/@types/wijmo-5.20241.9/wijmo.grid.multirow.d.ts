/*!
    *
    * Wijmo Library 5.20241.9
    * https://developer.mescius.com/wijmo
    *
    * Copyright(c) MESCIUS inc. All rights reserved.
    *
    * Licensed under the End-User License Agreement For MESCIUS Wijmo Software.
    * us.sales@mescius.com
    * https://developer.mescius.com/wijmo/licensing
    *
    */
/**
 * {@module wijmo.grid.multirow}
 * Defines the {@link MultiRow} control and its associated classes.
 */
/**
 *
 */
export declare var ___keepComment: any;
import { ObservableArray, NotifyCollectionChangedEventArgs, Event, EventArgs, CancelEventArgs, CollectionViewGroup } from '@mescius/wijmo';
import { Row, GroupRow, CellRange, CellRangeEventArgs, Column, GridPanel, ColumnCollection, FlexGrid, _AddNewHandler, _NewRowTemplate, SelMove, _SelectionHandler, _EditHandler, MergeManager } from '@mescius/wijmo.grid';
import * as selfModule from '@mescius/wijmo.grid.multirow';
/**
 * Handles the grid's selection.
 */
export declare class _MultiRowSelectionHandler extends _SelectionHandler {
    _getNextColumnCell(r: number, c: number, move: SelMove, pageSize?: number): any;
}
/**
 * Extends the {@link Row} class to provide additional information for multi-row records.
 */
export declare class _MultiRow extends Row {
    _idxRecord: number;
    /**
     * Initializes a new instance of the {@link Row} class.
     *
     * @param dataItem The data item this row is bound to.
     * @param dataIndex The index of the record within the items source.
     * @param recordIndex The index of this row within the record (data item).
     */
    constructor(dataItem: any, dataIndex: number, recordIndex: number);
    /**
     * Gets the index of this row within the record (data item) it represents.
     */
    readonly recordIndex: number;
}
/**
 * Extends the {@link GroupRow} class to provide additional information for multi-row records.
 */
export declare class _MultiGroupRow extends GroupRow {
    _idxRecord: number;
    /**
     * Initializes a new instance of the {@link Row} class.
     *
     * @param dataItem The data item this row is bound to.
     * @param recordIndex The index of this row within the record (group header).
     */
    constructor(dataItem: any, recordIndex: number);
    /**
     * Gets the index of this row within the record (data item) it represents.
     */
    readonly recordIndex: number;
    /**
     * _MultiGroupRow rows always have children...
     */
    readonly hasChildren: boolean;
    /**
     * Get cell range taking into account multi-row header rows.
     */
    getCellRange(): CellRange;
    /**
     * Gets or sets a value that indicates whether this _MultiGroupRow is
     * collapsed (child rows are hidden) or expanded (child rows are visible).
     */
    isCollapsed: boolean;
    _setCollapsed(collapsed: boolean): void;
    private _getLastRowInHeader;
}
/**
 * Handles the multirow's editing.
 */
export declare class _MultiRowEditHandler extends _EditHandler {
    _selectionChanging(e: CellRangeEventArgs): void;
}
/**
 * Extends the {@link ObservableArray} class to track layout changes.
 */
export declare class MultiRowCellCollection<T extends MultiRowCell> extends ObservableArray<T> {
    private _layout;
    _setLayout(layout: _MultiRowLayout): void;
    /**
     * Tracks layout changes.
     */
    onCollectionChanged(e?: NotifyCollectionChangedEventArgs<any>): void;
}
/**
 * Class that parses {@link MultiRow} layout definitions.
 */
export declare class _MultiRowLayout {
    private _initialized;
    private _disposed;
    private _multiRowGroupHeaderRange;
    _grid: MultiRow;
    _rowsPerItem: number;
    _bindingGroups: MultiRowCellCollection<MultiRowCellGroup>;
    _groupsByColumn: any;
    _changeCallback: () => void;
    /**
     * Initializes a new instance of the {@link _LayoutDef} class.
     *
     * @param grid {@link MultiRow} that owns this layout.
     * @param layoutDef Array that contains the layout definition.
     * @param changeCallback Callback invoked when layout changes.
     */
    constructor(grid: MultiRow, layoutDef: any[], changeCallback: () => void);
    _dispose(): void;
    _onLayoutChanged(): void;
    private _parseCellGroups;
    private _getMultiRowGroupHeaderRange;
    private _expandMultiRowGroupHeaderToAggregate;
    private _getSingleRowGroupHeaderRange;
    _getGroupHeaderMergedRange(p: GridPanel, r: number, c: number, multiRowGroupHeaders: boolean): CellRange;
    _getGroupByColumn(c: number): any;
    _updateCellTypes(item: any): void;
}
/**
 * Extends the {@link Column} class with <b>colspan</b> property to
 * describe a cell in a {@link MultiRowCellGroup}.
 */
export declare class MultiRowCell extends Column {
    private _layout;
    private _row;
    private _col;
    private _colspan;
    private _rowspan;
    _colspanEff: number;
    _rowspanEff: number;
    /**
     * Initializes a new instance of the {@link MultiRowCell} class.
     *
     * @param options JavaScript object containing initialization data for the {@link MultiRowCell}.
     */
    constructor(options?: any);
    /**
     * Gets or sets the row index of this {@link MultiRowCell} within the cell group.
     */
    row: number;
    /**
     * Gets or sets the column index of this {@link MultiRowCell} within the cell group.
     */
    col: number;
    /**
     * Gets or sets the number of physical columns spanned by the {@link MultiRowCell}.
     */
    colspan: number;
    /**
     * Gets or sets the number of physical rows spanned by the {@link MultiRowCell}.
     */
    rowspan: number;
    _setLayout(layout: _MultiRowLayout): void;
    protected _onLayoutPropertyChanged(): void;
}
/**
 * Describes a group of cells that may span multiple rows and columns.
 */
export declare class MultiRowCellGroup extends MultiRowCell {
    private _isRowHeader;
    _colstart: number;
    private _cellsDef;
    private _cells;
    _cols: ColumnCollection;
    _hasAggregates: boolean;
    private _rng;
    private _isParsed;
    /**
     * Initializes a new instance of the {@link MultiRowCellGroup} class.
     *
     * @param options JavaScript object containing initialization data for the new {@link MultiRowCellGroup}.
     */
    constructor(options?: any);
    _copy(key: string, value: any): boolean;
    readonly cells: MultiRowCellCollection<MultiRowCell>;
    isRowHeader: boolean;
    openGroup(): void;
    closeGroup(g: MultiRow, rowsPerItem: number): void;
    getColumnWidth(c: number): any;
    getMergedRange(p: GridPanel, r: number, c: number): CellRange;
    getBindingColumn(p: GridPanel, r: number, c: number): Column;
    getColumn(name: string): Column;
    _getCellRange(r: number, c: number): CellRange;
    private _parseCells;
    private _clearCalculations;
    private _calculate;
    private _cellFits;
    private _slotTaken;
}
/**
 * Extends the {@link FlexGrid} control to provide multiple rows per item.
 *
 * Use the {@link layoutDefinition} property to define the layout of the
 * rows used to display each data item.
 *
 * A few {@link FlexGrid} properties are disabled in the {@link MultiRow}
 * control because they would interfere with the custom multi-row layouts.
 * The list of disabled properties includes the following:
 *
 * {@link FlexGrid.allowMerging}, {@link FlexGrid.mergeManager},
 * {@link FlexGrid.autoGenerateColumns}, {@link FlexGrid.columnGroups},
 * {@link FlexGrid.allowDragging}, {@link FlexGrid.allowPinning},
 * {@link FlexGrid.childItemsPath}, {@link FlexGridDetailProvider}, and
 * {@link Column.visible}.
 *
 * Note also that cells in the {@link FlexGrid.columnFooters} panel
 * do not follow the multi-row layout. That is because those cells
 * belong to rows that are not created by the grid itself, but by
 * custom code.
 */
export declare class MultiRow extends FlexGrid {
    _layoutDef: any[];
    _layout: _MultiRowLayout;
    _hdrLayoutDef: any[];
    _hdrLayout: _MultiRowLayout;
    _centerVert: boolean;
    _collapsedHeaders: boolean;
    _multiRowGroupHeaders: boolean;
    _collapsedHeadersWasNull: boolean;
    _btnCollapse: HTMLElement;
    _rowHdrCnt: number;
    /**
     * Initializes a new instance of the {@link MultiRow} class.
     *
     * In most cases, the **options** parameter will include the value for the
     * {@link layoutDefinition} property.
     *
     * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any);
    _getProductInfo(): string;
    /**
     * Gets or sets an array that defines the layout of the rows used to display each data item.
     *
     * The array contains a list of cell group objects which have the following properties:
     *
     * <ul>
     * <li><b>header</b>: Group header (shown when the headers are collapsed).</li>
     * <li><b>isRowHeader</b>: Whether cells in this group should be displayed and
     * treated as row header cells.</li>
     * <li><b>colspan</b>: Number of grid columns spanned by the group.</li>
     * <li><b>cells</b>: Array of cell objects, which extend {@link Column} with a
     * <b>colspan</b> property.</li>
     * </ul>
     *
     * When the {@link layoutDefinition} property is set, the grid scans the cells in each
     * group as follows:
     *
     * <ol>
     * <li>The grid calculates the <b>colspan</b> of the group either as group's own <b>colspan</b>
     * or as span of the widest cell in the group, whichever is wider.</li>
     * <li>If the cell fits the current row within the group, it is added to the current row.</li>
     * <li>If it doesn't fit, it is added to a new row.</li>
     * </ol>
     *
     * When all groups are ready, the grid calculates the number of rows per record to the maximum
     * **rowspan** of all groups, and adds rows to each group to pad their height as needed.
     *
     * This scheme is simple and flexible. For example:
     * ```
     * { header: 'Group 1', cells: [{ binding: 'c1' }, { binding: 'c2'}, { binding: 'c3' }]}
     * ```
     *
     * The group has **colspan** 1, so there will be one cell per column. The result is:
     * ```
     * | C1 |
     * | C2 |
     * | C3 |
     * ```
     *
     * To create a group with two columns, set the **colspan** property of the group:
     * ```
     * { header: 'Group 1', colspan: 2, cells:[{ binding: 'c1' }, { binding: 'c2'}, { binding: 'c3' }]}
     * ```
     *
     * The cells will wrap as follows:
     * ```
     * | C1 | C2 |
     * | C3      |
     * ```
     *
     * Note that the last cell spans two columns (to fill the group).
     *
     * You can also specify the **colspan** on individual cells rather than on the group:
     * ```
     * { header: 'Group 1', cells: [{binding: 'c1', colspan: 2 }, { binding: 'c2'}, { binding: 'c3' }]}
     * ```
     *
     * Now the first cell has **colspan** 2, so the result is:
     * ```
     * | C1      |
     * | C2 | C3 |
     * ```
     *
     * You can also make cells extend vertically using the cell's **rowspan** property:
     * ```
     * { header: 'Group 1', cells: [{binding: 'c1', rowspan: 2 }, { binding: 'c2'}, { binding: 'c3' }]}
     * ```
     *
     * Now the first cell has **rowspan** 2, so the result is:
     * ```
     * | C1 | C2 |
     * |    | C3 |
     * ```
     *
     * Because cells extend the {@link Column} class, you can add all the usual {@link Column}
     * properties to any cells:
     * ```
     * { header: 'Group 1', cells: [
     *    { binding: 'c1', colspan: 2 },
     *    { binding: 'c2'},
     *    { binding: 'c3', format: 'n0', required: false, etc... }
     * ]}
     * ```
     *
     * The **isRowHeader** property of the cell groups allows you to create groups
     * to be displayed as row header cells. This is done using frozen columns, so even
     * though the row headers are regular cells, they look and behave like header cells.
     *
     * Setting the **isRowHeader** property to true automatically sets the cell's
     * **isReadOnly** property to true (headers cannot be edited), adds a 'wj-header'
     * style to the cell's **cssClass** property (so the cells are styled as headers),
     * and sets the cell's **cellTemplate** property to its **header** value
     * (so the cell shows the header as an unbound string). You may choose to set the
     * cell's **binding** property instead of **header** if you want to show
     * bound values in the row header cells.
     */
    layoutDefinition: any[];
    /**
     * Similar with viewRange
     * but row is first record index instead of first row index
     * row2 is last record index instead of last records row index
     */
    readonly recordViewRange: CellRange;
    /**
     * Gets or sets an array that defines the layout of the rows used to display
     * the grid's column headers.
     *
     * The array contains a list of cell group objects similar to those used with
     * the {@link layoutDefinition} property.
     *
     * The default value for this property is **null**, which causes the grid to
     * use the {@link layoutDefinition} property to create the column headers.
     */
    headerLayoutDefinition: any[] | null;
    /**
     * Gets the number of rows used to display each item.
     *
     * This value is calculated automatically based on the value
     * of the **layoutDefinition** property.
     */
    readonly rowsPerItem: number;
    /**
     * Gets the {@link Column} object used to bind a data item to a grid cell.
     *
     * @param p {@link GridPanel} that contains the cell.
     * @param r Index of the row that contains the cell.
     * @param c Index of the column that contains the cell.
     */
    getBindingColumn(p: GridPanel, r: number, c: number): Column;
    /**
     * Gets a column by name or by binding.
     *
     * The method searches the column by name. If a column with the given name
     * is not found, it searches by binding. The searches are case-sensitive.
     *
     * @param name The name or binding to find.
     * @param header Whether to search column defined for header.
     * @return The column with the specified name or binding, or null if not found.
     */
    getColumn(name: string, header?: boolean): Column;
    /**
     * Gets or sets a value that determines whether the content of cells
     * that span multiple rows should be vertically centered.
     *
     * The default value for this property is **true**.
     */
    centerHeadersVertically: boolean;
    /**
     * Gets or sets a value that determines whether column headers
     * should be collapsed and displayed as a single row containing
     * the group headers.
     *
     * If you set the {@link collapsedHeaders} property to **true**,
     * remember to set the **header** property of every group in
     * order to avoid empty header cells.
     *
     * Setting the {@link collapsedHeaders} property to **null** causes
     * the grid to show all header information (groups and columns).
     * In this case, the first row will show the group headers and the
     * remaining rows will show the individual column headers.
     *
     * The default value for this property is **false**.
     */
    collapsedHeaders: boolean | null;
    /**
     * Gets or sets a value that determines whether the grid should display
     * a button in the column header panel to allow users to collapse and
     * expand the column headers.
     *
     * If the button is visible, clicking on it will cause the grid to
     * toggle the value of the **collapsedHeaders** property.
     *
     * The default value for this property is **false**.
     */
    showHeaderCollapseButton: boolean;
    /**
     * Gets or sets a value that determines whether group headers should
     * have multiple rows instead of a single header row.
     *
     * This property is useful when you want to display aggregate values
     * in the group headers (see the {@link Column.aggregate} property).
     *
     * The default value for this property is **false**.
     */
    multiRowGroupHeaders: boolean;
    /**
     * Occurs after the value of the {@link collapsedHeaders} property changes.
     */
    readonly collapsedHeadersChanging: Event<MultiRow, CancelEventArgs>;
    /**
     * Raises the {@link collapsedHeadersChanging} event.
     *
     * @param e {@link CancelEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onCollapsedHeadersChanging(e: CancelEventArgs): boolean;
    /**
     * Occurs after the value of the {@link collapsedHeaders} property has changed.
     */
    readonly collapsedHeadersChanged: Event<MultiRow, EventArgs>;
    /**
     * Raises the {@link collapsedHeadersChanged} event.
     */
    onCollapsedHeadersChanged(e?: EventArgs): void;
    allowPinning: boolean;
    onSelectionChanging(e: CellRangeEventArgs): boolean;
    protected _createSelHdl(): _SelectionHandler;
    _getDeleteColumnIndex(): number;
    _getQuickAutoSize(): boolean;
    _addBoundRow(items: any[], index: number): void;
    _addNode(items: any[], index: number, level: number): void;
    _addGroupRow(group: CollectionViewGroup): void;
    protected _addGroupSummaryRow(group: CollectionViewGroup): void;
    _bindColumns(): void;
    _updateCollapsedHeaders(): void;
    _updateColumnTypes(): void;
    _getBindingColumn(p: GridPanel, r: number, c: Column): Column;
    _getBindingColumns(): Column[];
    _getRowsPerItem(): number;
    _cvCollectionChanged(sender: any, e: NotifyCollectionChangedEventArgs): void;
    _getGroupByColumn(c: number, hdr: boolean): MultiRowCellGroup;
    private _onLayoutChanged;
    private _onHeaderLayoutChanged;
    private _formatItem;
    _updateButtonGlyph(): void;
    _getError(p: GridPanel, r: number, c: number, parsing?: boolean): string | null;
    _getEmptyRequiredCell(row: number): any;
}
/**
 * Provides custom merging for {@link MultiRow} controls.
 */
export declare class _MergeManager extends MergeManager {
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
    getMergedRange(p: GridPanel, r: number, c: number, clip?: boolean): CellRange;
    private _getGroupRowMergedRange;
    private _adjustMergedGroupRange;
}
/**
 * Manages the new row template used to add rows to the grid.
 */
export declare class _MultiRowAddNewHandler extends _AddNewHandler {
    /**
     * Initializes a new instance of the {@link _AddNewHandler} class.
     *
     * @param grid {@link FlexGrid} that owns this {@link _AddNewHandler}.
     */
    constructor(grid: FlexGrid);
    /**
     * Updates the new row template to ensure that it is visible only when the grid is
     * bound to a data source that supports adding new items, and that it is
     * in the right position.
     */
    updateNewRowTemplate(): void;
    _keydown(e: KeyboardEvent): void;
    _beginningEdit(s: MultiRow, e: CellRangeEventArgs): void;
    _rowEditStarting(s: FlexGrid, e: CellRangeEventArgs): void;
    _rowEditEnded(s: MultiRow, e: CellRangeEventArgs): void;
    _copyNewDataItem(): void;
    _removeNewRowTemplate(): void;
}
/**
 * Represents a row template used to add items to the source collection.
 */
export declare class _MultiRowNewRowTemplate extends _NewRowTemplate {
    _idxRecord: number;
    constructor(indexInRecord: number);
    readonly recordIndex: number;
}
