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
/**
 * {@module wijmo.interop.grid}
 * This module is for internal use only. Don't use it directly.
 */
/**
 *
 */
export declare var ___keepComment: any;
import * as mInput from 'wijmo/wijmo.input';
import * as mGridDetail from 'wijmo/wijmo.grid.detail';
import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
export declare function softInput(): typeof mInput;
export declare function softGridDetail(): typeof mGridDetail;
interface _IProcessTemplateCtx {
    needCellValue: boolean;
    isCvGroup: boolean;
    isEdit: boolean;
    riOriginal: number;
    ciOriginal: number;
    templContextProp: string;
    rng?: wjcGrid.CellRange;
    row: wjcGrid.Row;
    col: wjcGrid.Column;
}
export declare abstract class DirectiveCellFactoryBase extends wjcGrid.CellFactory {
    private static _templateTypes;
    protected static _cellStampProp: string;
    private static _FOCUS_INTERVAL;
    grid: wjcGrid.FlexGrid;
    private _baseCf;
    private _closingApplyTimeOut;
    private _lastApplyTimeStamp;
    private _noApplyLag;
    private _editChar;
    private _startingEditing;
    private _evtInput;
    private _evtBlur;
    private _cellStampCounter;
    private _cellEditorVars;
    private _composing;
    private _autoSizeCache;
    protected _isCheckingHeight: boolean;
    protected _backupHeight: number;
    protected _cacheRow: wjcGrid.Row;
    constructor(grid: wjcGrid.FlexGrid);
    protected _updatedViewHandler(): void;
    protected canRender(tplCtx: any): boolean;
    updateCell(panel: wjcGrid.GridPanel, rowIndex: number, colIndex: number, cell: HTMLElement, rng?: wjcGrid.CellRange): void;
    _processTemplate(panel: wjcGrid.GridPanel, rowIndex: number, colIndex: number, cell: HTMLElement, templContext: ICellTemplateInfo, ctx: _IProcessTemplateCtx): boolean;
    private _updateEditRowSize;
    private _autoSizePanelCells;
    protected getHeight(panel: wjcGrid.GridPanel, r: number, c: number, cell: HTMLElement): number;
    protected _autoSizeIfRequired(): void;
    private _autoSizePendingCells;
    private _markForAutoSize;
    getEditorValue(g: wjcGrid.FlexGrid): any;
    disposeCell(cell: HTMLElement): void;
    /**
     * Indicates whether a new template instance must be created for the cell.
     * @param cell
     * @param templContextProp
     */
    protected abstract shouldInstantiate(cellInfo: ICellRenderingInfo): boolean;
    protected abstract renderTemplate(cellInfo: ICellRenderingInfo, initNew: boolean): any;
    protected disposeTemplate(cell: HTMLElement, templateCache: ICellTemplateCache, templateContext: ICellTemplateInfo): void;
    /**
     * Forces template to apply all changes immediately (apply bindings, etc - whatever is relevant),
     * to make its size up to date. Usually used in cell size measurement scenarios.
     * @param cellInfo
     */
    protected abstract applyImmediately(cellInfo: ICellRenderingInfo): any;
    /**
     * Causes the control to immediately trigger pending framework events.
     * @param control
     */
    protected abstract flushPendingEvents(control: wjcCore.Control): any;
    protected abstract getEditorFocusFlag(): boolean;
    protected abstract setEditorFocusFlag(value: boolean): any;
    protected setBindingsData(context: any, row: wjcGrid.Row, col: wjcGrid.Column, dataItem: any, cellValue: any, valuePaths: Object): CellBindingsData;
    protected checkHeight(cellInfo: ICellRenderingInfo): void;
    protected _restoreRowHeight(): void;
    protected doDisposeCell(cell: HTMLElement): void;
    protected abstract clearCell(cell: HTMLElement): any;
    static getTemplContextProp(templateType: GridCellTemplateType): string;
    private _doDisposeCell;
    protected _initEditInput(cellContext: ICellTemplateCache | any, templContext: ICellTemplateInfo, initialValue: string): void;
    protected _initImeEditInput(cellContext: ICellTemplateCache | any, templContext: ICellTemplateInfo): void;
    private _findInitialInput;
    private static _setSelectionRange;
    private _triggerEditorEvents;
    protected _isFullEdit(): boolean;
    private _setFullEdit;
}
/**
* Defines the type of cell on which a template is to be applied. This value is specified in the <b>cellType</b> attribute
* of the frameworks' cell template components/directives.
*/
export declare enum GridCellTemplateType {
    /** Defines a regular (data) cell. */
    Cell = 0,
    /** Defines a cell in edit mode. */
    CellEdit = 1,
    /** Defines a column header cell. */
    ColumnHeader = 2,
    /** Defines a row header cell. */
    RowHeader = 3,
    /** Defines a row header cell in edit mode. */
    RowHeaderEdit = 4,
    /** Defines a top left cell. */
    TopLeft = 5,
    /** Defines a group header cell in a group row. */
    GroupHeader = 6,
    /** Defines a regular cell in a group row. */
    Group = 7,
    /** Defines a cell in a new row template. */
    NewCellTemplate = 8,
    /** Defines a column footer cell. */
    ColumnFooter = 9,
    /** Defines a bottom left cell (at the intersection of the row header and column footer cells). **/
    BottomLeft = 10
}
export interface ICellTemplateInfo {
    cellOverflow: string;
    autoSizeRows: boolean;
    forceFullEdit: boolean;
    valuePaths: Object;
}
export interface ICellTemplateCache {
    column?: wjcGrid.Column;
    templateContextProperty: string;
    rootElement: Element;
}
export interface ICellRenderingInfo {
    cell: HTMLElement;
    column: wjcGrid.Column;
    row: wjcGrid.Row;
    cellValue: any;
    cellValueFormatted: string;
    panel: wjcGrid.GridPanel;
    rng: wjcGrid.CellRange;
    isEdit: boolean;
    isImeInput: boolean;
    isTrueImeInput: boolean;
    templateContextProperty: string;
    templateContext: ICellTemplateInfo;
    templateCache: ICellTemplateCache;
    cellBindingsData?: CellBindingsData;
    cellStamp: number;
}
export interface CellBindingsData {
    localVars: {
        row: any;
        col: any;
        item: any;
        value: any;
        valueFormatted: string;
        values: any;
    };
    bindings?: any;
}
export {};
