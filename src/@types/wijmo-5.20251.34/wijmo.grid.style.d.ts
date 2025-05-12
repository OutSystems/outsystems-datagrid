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
declare module wijmo.grid.style {
    /**
     * Implements a styling API for {@link FlexGrid} controls.
     *
     * To style cells in a {@link FlexGrid} control, create an instance
     * of the {@link FlexGridStyle} and pass the grid as a parameter to the
     * constructor. For example:
     *
     * ```typescript
     * import { FlexGrid } from '@mescius/wijmo.grid';
     * import { FlexGridStyle } from '@mescius/wijmo.grid.style';
     * let theGrid = new FlexGrid('#theGrid'); // create the grid
     * let flexGridStyle = new FlexGridStyle(theGrid); // create an object of FlexGridStyle
     * ```
     *
     * The {@link FlexGridStyle} class depends on the **wijmo.grid** module.
     *
     * The example below shows how you can use {@link FlexGridStyle} to add/remove
     * styles on {@link FlexGrid} control:
     *
     * {@sample Grid/Styling/StyleAPI/purejs Example}
     *
     */
    class FlexGridStyle {
        private _g;
        private _styleTag;
        private _cellStyles;
        private _styleObj;
        private _fmtBound;
        private _shouldInvalidate;
        /**
         * Initializes a new instance of the {@link FlexGridStyle} class.
         *
         * @param grid The {@link FlexGrid} to style.
         * @param options Initialization options for the {@link FlexGridStyle}.
         */
        constructor(grid: wijmo.grid.FlexGrid, options?: any);
        /**
        * Applies the specified style (inline or class-based) to a cell range
        *
        * @param rng {@link CellRange} to apply the style to
        * @param style css style object to apply to the cells
        * @param panel The {@link GridPanel} the {@link CellRange} belongs to
        * @param inline whether to add style as inline or create a new class
        */
        applyStyle(rng: wijmo.grid.CellRange, style: Partial<CSSStyleDeclaration>, panel?: wijmo.grid.GridPanel, inline?: boolean): void;
        /**
         * Toggles the specified CSS classname on the provided cell range
         *
         * @param rng {@link CellRange} to apply the style to
         * @param className css ClassName to apply on provided {@link CellRange}
         * @param panel The {@link GridPanel} the {@link CellRange} belongs to
         * @param addOrRemove whether to add class or remove class, skipping this parameter toggle the provided class
         */
        toggleClass(rng: wijmo.grid.CellRange, className: string, panel?: wijmo.grid.GridPanel, addOrRemove?: boolean): void;
        /**
        * Removes all applied styles from the entire grid or from the specified cell range.
        *
        * @param rng {@link CellRange} cell range to remove the style from
        * @param panel The {@link GridPanel} the {@link CellRange} belongs to
        */
        clearAllStyles(rng?: wijmo.grid.CellRange, panel?: wijmo.grid.GridPanel): void;
        /**
        * Removes a specific style from a cell range.
        *
        * @param rng {@link CellRange} to remove the style from
        * @param style css style object to remove from the cells
        * @param panel The {@link GridPanel} the {@link CellRange} belongs to
        */
        removeStyle(rng: wijmo.grid.CellRange, style: Partial<CSSStyleDeclaration>, panel?: wijmo.grid.GridPanel): void;
        /**
         * Make sure cell style cache exists from provided cell
         * @param cellType
         * @param r row index
         * @param c col index
         */
        private _ensureCache;
        /**
         * Gets the cell style cache(if exists)
         * @param cellType
         * @param r row index
         * @param c col index
         */
        private _getCellStyle;
        /**
         * Toggles the css class on cell
         * @param cellStyle cellStyle object
         * @param className css class
         * @param addOrRemove add or remove css class
         */
        private _setStyleToggleClass;
        /**
         * Adds a style object to stylesheet and returns the classname of added styles
         * if an already added style object is passed, then it return the classname assigned to the object previously
         *
         * @returns the className of added style object
         */
        private _addStyleObj;
        /**
         * Formatter function to actually apply styles on grid cell
         */
        private _fmtFn;
        private _getStyleTag;
        private _trimClassName;
        private _createStyleString;
        protected _isFlexGridStyleAllowed(): boolean;
        protected _isCellStylesEmpty(arr: any): boolean;
    }
}
declare module wijmo.grid.style {
}
