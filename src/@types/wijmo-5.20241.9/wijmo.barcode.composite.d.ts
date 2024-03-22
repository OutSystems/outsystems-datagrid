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
 * {@module wijmo.barcode.composite}
 * Implements controls for drawing popular composite barcode types.
 *
 * This module incorporates modified version of the
 * <a href="https://www.npmjs.com/package/big-number" target="_blank">bignumber.js</a>
 * library.
 */
/**
 *
 */
export declare var ___keepComment: any;
import { TwoDimensionalBarcode, OneDimensionalBarcode, BarcodeBase, LabelPosition, IVariableWidthBarcode } from '@mescius/wijmo.barcode';
import * as selfModule from '@mescius/wijmo.barcode.composite';
/**
 * Structured append optional fields. Currently only supports segmentCount.
 */
export interface IOptionalFields {
    /**
     * Indicates whether the segment count field is used.
     * The segment count field (identifying the total number of Structured Append symbols
     * in the distributed file) can contain values from 1 to 99 999 and shall be encoded as two codewords. If the optional
     * segment count field is used, that field shall appear in every segment.
     *
     * The default value for this property is <b>true</b>.
    */
    segmentCount?: boolean;
}
export declare class ISO646Encoder {
    static Table: {
        '!': string;
        '"': string;
        '%': string;
        '&': string;
        '\'': string;
        '(': string;
        ')': string;
        '*': string;
        '+': string;
        ',': string;
        '-': string;
        '.': string;
        '/': string;
        ':': string;
        ';': string;
        '<': string;
        '=': string;
        '>': string;
        '?': string;
        '_': string;
        ' ': string;
        'FNC1NumericLatch': string;
        'NumericLatch': string;
        'AlphanumericLatch': string;
    };
    static ISO646: string;
    static isISO646Only(str: any): boolean;
    protected bitBuffer: any;
    constructor(bitBuffer: any);
    encode(char: any): void;
    FNC1NumericLatch(): void;
    NumericLatch(): void;
    AlphanumericLatch(): void;
}
export declare class AlphanumericEncoder {
    static Table: {
        '*': string;
        ',': string;
        '-': string;
        '.': string;
        '/': string;
        'FNC1NumericLatch': string;
        'NumericLatch': string;
        'ISO646Latch': string;
    };
    static isUpperCase(char: any): boolean;
    static isLowerCase(char: any): boolean;
    private bitBuffer;
    constructor(bitBuffer: any);
    encode(char: any): void;
    FNC1NumericLatch(): void;
    NumericLatch(): void;
    ISO646Latch(): void;
}
export declare class NumericEncoder {
    static isNumericOrFNC1(char: any): boolean;
    static isNumeric(char: any): boolean;
    protected bitBuffer: any;
    constructor(bitBuffer: any);
    encode(char1: any, char2: any): void;
    encodeOne(char: any): void;
    AlphanumericLatch(): void;
}
export declare class GS1GeneralPurposeDataEncodation {
    static EncodeMod: {
        Numeric: string;
        Alphanumeric: string;
        ISO646: string;
    };
    private text;
    protected mode: any;
    protected bitBuffer: any;
    private needExtraPadding;
    constructor(bitBuffer: any, needExtraPadding?: boolean);
    encodeGeneralData(str: any): void;
    padTo(size: any): void;
    _pad(remain: any): void;
    encode(text?: string): void;
}
export declare function encode928(bitString: any, codeWords: any, bitLng: any): any;
export declare function findVersionTable_CCA(table: any, func: any): any;
export declare function getVersionVariant_CCA(col: any, bits: any): any;
export declare function getSupportedUppercaseAlphabetic(letter: any): any;
export declare class GeneralPurposeDataEncodation extends GS1GeneralPurposeDataEncodation {
    encodeGeneralData(str: any, columns?: any): void;
}
export declare function generateECC(codewords: any, ecl: any): any;
export declare function generateECCForMicro(codewords: any, eccCount: any): any;
export declare const SymbolVersion: {
    ColumnPriorAuto: string;
    RowPriorAuto: string;
    V1X11: string;
    V1X14: string;
    V1X17: string;
    V1X20: string;
    V1X24: string;
    V1X28: string;
    V2X8: string;
    V2X11: string;
    V2X14: string;
    V2X17: string;
    V2X20: string;
    V2X23: string;
    V2X26: string;
    V3X6: string;
    V3X8: string;
    V3X10: string;
    V3X12: string;
    V3X15: string;
    V3X20: string;
    V3X26: string;
    V3X32: string;
    V3X38: string;
    V3X44: string;
    V4X4: string;
    V4X6: string;
    V4X8: string;
    V4X10: string;
    V4X12: string;
    V4X15: string;
    V4X20: string;
    V4X26: string;
    V4X32: string;
    V4X38: string;
    V4X44: string;
};
export declare const CompactionMode: {
    Auto: string;
    Text: string;
    Byte: string;
    Numeric: string;
};
export declare const CLUSTERS: number[][];
export declare const subModeMap: {
    ll: string;
    ps: string;
    ml: string;
    al: string;
    pl: string;
    as: string;
};
export declare const MODE_TC = 900, MODE_BC = 901, MODE_NC = 902, MODE_BC6 = 924, MODE_BC_SHIFT = 913;
export declare function compaction(text: any, mode?: string): any[];
export declare function getIndicator(rowIndex: any, rowCount: any, ecl: any, col: any, isRight?: any): any;
export declare function getPattern_PDF417(row: any, value: any): number;
export declare function getTCValue(char: any, mode: any): any;
export declare function getTCSubModeValue(targetMode: any, lastMode: any): any;
export declare function createModules(row: any, col: any): any[];
export declare function getAutoECL(cws: any): 4 | 3 | 2 | 5;
export declare function getAutoRowAndCol(length: any): {
    col: number;
    row: any;
};
export declare function findVersionTable(table: any, func: any): any;
export declare function getVersionVariantColPrior(n: any): any;
export declare function getVersionVariantRowPrior(n: any): any;
export declare function getVersionVariant(row: any, col: any): any;
export declare function getVersionVariantByCol(col: any, n: any): any;
export declare function getECCBVersionVariantByCol(col: any, n: any): any;
export declare function getRowAddressPatterns(rowAssignment: any, type: any, i: any): any;
export declare function getPattern(n: any, value: any): number;
export declare class BigNumber {
    private number;
    private sign;
    private rest;
    constructor(initialNumber: any);
    addDigit(digit: any): false | this;
    isEven(): boolean;
    private _compare;
    gt(number: any): boolean;
    gte(number: any): boolean;
    equals(number: any): boolean;
    lte(number: any): boolean;
    lt(number: any): boolean;
    add(number: any): any;
    minus(number: any): this;
    private static _add;
    private static _subtract;
    multiply(number: any): BigNumber;
    divide(number: any): this;
    mod(number: any): any;
    power(number: any): BigNumber;
    abs(): this;
    isZero(): boolean;
    toString(): string;
}
export declare abstract class PDF417Base extends TwoDimensionalBarcode {
    static PAD: number;
    protected text: any;
    protected versionMeta: any;
    protected columns: any;
    protected data: any;
    protected ecc: any;
    protected rows: any;
    private mainArea;
    validate(): void;
    encodeNC(group: any): any[];
    encodeBC(group: any): any[];
    encodeTC(group: any): number[];
    encode(modes: any): any[];
    convertToShape(matrix: any, forMeasure: any): void;
    adjustDesiredSize(): void;
    getMainArea(): any;
}
export declare class PDF417Encoder extends PDF417Base {
    static DefaultConfig: {
        errorCorrectionLevel: string;
        columns: string;
        rows: string;
        compact: boolean;
        height: number;
        quietZone: {
            top: number;
            left: number;
            right: number;
            bottom: number;
        };
    };
    static START: string;
    static END: string;
    static COMPACT_END: string;
    static MAX_DATA_NUM: number;
    private ecl;
    private compact;
    constructor(option: any);
    validate(): void;
    genEcc(): void;
    calculateData(): any[];
}
export declare class MicroPDF417Encoder extends PDF417Base {
    static DefaultConfig: {
        symbolVersion: string;
        compactionMode: string;
        structuredAppend: boolean;
        segmentIndex: number;
        fileID: number;
        height: number;
        quietZone: {
            top: number;
            left: number;
            right: number;
            bottom: number;
        };
        optionalFields: {
            segmentCount: boolean;
        };
    };
    static StopBar: string;
    static StructuredAppendMarker: number;
    static StructuredAppendOptionalFieldsMarker: number;
    static StructuredAppendTerminator: number;
    static StructuredAppendOptionalFieldTags: {
        SegmentCount: number;
    };
    private symbolVersion;
    private compactionMode;
    private structuredAppendEnabled;
    private segmentIndex;
    private fileID;
    private optionalFields;
    private segmentCount;
    private structuredAppendCws;
    constructor(option: any);
    validate(): void;
    _buildRow(row: any, rowIndex: any): any[];
    _buildStructAppend(): number[];
    _splitStruct(data: any): any;
    genEcc(): void;
    calculateData(): any[];
}
export declare class CCA extends PDF417Base {
    protected bitBuffer: any;
    private aiGroup;
    private method;
    private _gpdEncodation;
    private autoHeight;
    constructor(linkageText: any, columns: number, unitSize: number, height: any);
    _buildRow(row: any, rowIndex: any): any[];
    _encode_10Date(str: any): void;
    _getMethod_11Mode(str: any): "Numeric" | "Alphanumeric" | "Alpha";
    _encode_11(): string;
    _encode_10(): string;
    _encode_0(): any;
    _encodeMethod(): void;
    getVersionVariant(): void;
    _encode(): void;
    genEcc(): void;
    calculateData(): any[];
}
export declare class CCB extends MicroPDF417Encoder {
    private bytes;
    private autoHeight;
    constructor(linkageText: any, columns: number, unitSize: number, height: any);
    genEcc(): void;
    encode(): any[];
    calculateData(): any[];
}
export declare abstract class GS1DataBarBase extends OneDimensionalBarcode {
    static DefaultConfig: {
        linkage: string;
        linkageVersion: string;
        hideLinkageText: boolean;
        hideAIText: boolean;
    };
    static LinkageVersion: {
        CCA: string;
        CCB: string;
    };
    static combins(n: any, r: any): any;
    static getRSSwidths(val: any, n: any, elements: any, maxWidth: any, noNarrow: any): any[];
    static getRSSvalue(widths: any, elements: any, maxWidth: any, noNarrow: any): number;
    static getGroup(collection: any, value: any): {
        range: {
            from: any;
            to: any;
        };
        preTotal: any;
        oddModules: any;
        evenModules: any;
        oddElements: any;
        evenElements: any;
        oddTotal: any;
        evenTotal: any;
    };
    static getChecksum(width: any, weights: any): any;
    static makeComplementPattern(str: any): string;
    static makeAlternatePattern(length: any, spaceFirst?: any): string;
    static makeComplexPattern(str: any): string;
    protected linkageText: any;
    protected linkage: any;
    protected hideLinkageText: any;
    protected hideAIText: any;
    protected linkageColumnCnt: any;
    constructor(option: any);
    convertToShape(data: any, forMeasure: any): void;
    getLinkageOffset(data: any, linkageWidth: any): void;
    getLinkageSepPattern(data?: any): void;
    _convertToShapeForLinkage(data: any, forMeasure: any): void;
}
export declare class Expanded extends GS1DataBarBase {
    static Guard: number[];
    static Group: number[][];
    static FinderPattern: {
        A1: number[];
        B1: number[];
        C1: number[];
        D1: number[];
        E1: number[];
        F1: number[];
        A2: number[];
        B2: number[];
        C2: number[];
        D2: number[];
        E2: number[];
        F2: number[];
    };
    static ChecksumWeight: {
        A1: {
            right: number[];
        };
        A2: {
            left: number[];
            right: number[];
        };
        B1: {
            left: number[];
            right: number[];
        };
        B2: {
            left: number[];
            right: number[];
        };
        C1: {
            left: number[];
            right: number[];
        };
        C2: {
            left: number[];
            right: number[];
        };
        D1: {
            left: number[];
            right: number[];
        };
        D2: {
            left: number[];
            right: number[];
        };
        E1: {
            left: number[];
            right: number[];
        };
        E2: {
            left: number[];
            right: number[];
        };
        F1: {
            left: number[];
            right: number[];
        };
        F2: {
            left: number[];
            right: number[];
        };
    };
    static FinderPatternSeq: string[][];
    static getFinderPatternSeq(symbolCnt: any): string[];
    static isVersion1Finder(n: any): boolean;
    static MethodReg_0100: RegExp;
    static MethodReg_0101: RegExp;
    static MethodReg_0111000_0111111: RegExp;
    static MethodReg_01100: RegExp;
    static MethodReg_01101: RegExp;
    static MethodReg_1: RegExp;
    protected _bitBuffer: any;
    protected _gpdEncodation: any;
    protected finderPatternSeq: any;
    protected symbolContentSize: any;
    constructor(option: any);
    _getSubsetWidth(number: any, orderLeftToRight?: boolean): any[];
    _getChecksum(widths: any): number;
    _getContent(dataWidths: any): any[];
    _addLength(methodLength: any): void;
    _encode(): void;
    _encode_1(): void;
    _encode_0100(): void;
    _encode_0101(): void;
    _encode_0111000_0111111(): void;
    _encode_01100(): void;
    _encode_01101(): void;
    _encode_00(): void;
    makeDataWidth(): any[];
    calculateData(): any;
    getLinkageSepPattern(data: any): string;
    getLinkageOffset(data: any): {
        linkageOffset: number;
        symbolOffset: number;
    };
}
export declare class GS1DataBarFirstType extends GS1DataBarBase {
    static LeftGuard: string;
    static RightGuard: string;
    static Group: {
        OutSide: number[][];
        InSide: number[][];
    };
    static ChecksumWeight: number[][];
    static FinderPattern: number[][];
    protected linkageColumnCnt: any;
    constructor(option: any);
    validate(): void;
    _getCheckDigit(text: any): number;
    _getSubsetWidth(data: any, isInside: any): any[];
    _getFinderPatternWidth(value: any): any;
    _getChecksum({ width1, width2, width3, width4 }: {
        width1: any;
        width2: any;
        width3: any;
        width4: any;
    }): number;
    _getSymbolCharacterWidth(symbolValue: any): {
        width1: any[];
        width2: any[];
        width3: any[];
        width4: any[];
    };
    getSymbolStructure(): {
        width1: any[];
        width2: any[];
        width3: any[];
        width4: any[];
        leftFinderPattern: any;
        rightFinderPattern: any;
    };
    getLinkageSepPattern(str: any): string;
    calculateData(): string;
}
export declare class Limited extends GS1DataBarFirstType {
    static LeftGuard: string;
    static RightGuard: string;
    static Group: any;
    static ChecksumWeight: number[][];
    static ChecksumWidth: number[][];
    linkageColumnCnt: number;
    _getSubsetWidth(number: any): any[];
    _getChecksum({ leftWidth, rightWidth }: any): number;
    _getSymbolCharacterWidth(number: any): any;
    getLinkageSepPattern(str: any): string;
    getSymbolStructure(): any;
    getLinkageOffset(data: any, linkageWidth: any): {
        linkageOffset: number;
        symbolOffset: number;
    };
    calculateData(): string;
}
export declare abstract class StackedBase extends GS1DataBarFirstType {
    static DefaultConfig: any;
    constructor(option: any);
    static RightGuard: string;
    static LeftGuard: string;
    calculateData(): any;
    abstract getSeparator(topRow: any, bottomRow: any): any;
    getLinkageSepPattern(str: any): string;
    convertToShape(data: any, forMeasure: any): void;
    getLinkageOffset(data: any): {
        linkageOffset: number;
        symbolOffset: number;
    };
    _convertToShapeForLinkage(data: any, forMeasure: any): void;
    _convertToShape(data: any, forMeasure: any): void;
}
export declare class ExpandedStacked extends Expanded {
    static DefaultConfig: any;
    static SegmentWidth: number;
    static SegmentSize: number;
    private _hasExtraPadding;
    protected rowCount: any;
    protected rowSegmentCount: any;
    constructor(option: any);
    _makeStacked(content: any): any;
    _isVersion1Finder(prevFinderCnt: any, i: any): boolean;
    _makeSepPattern(str: any, prevFinderCnt: any): string;
    _getSeparators(topRow: any, bottomRow: any, index: any): {
        pattern: string;
    }[];
    calculateData(): any;
    getLinkageOffset(data: any): {
        linkageOffset: number;
        symbolOffset: number;
    };
    convertToShape(data: any, forMeasure: any): void;
    _convertToShapeForLinkage(data: any, forMeasure: any): void;
    _convertToShape(data: any, forMeasure: any): void;
}
export declare class StackedOmnidirectional extends StackedBase {
    getSeparator(topRow: any, bottomRow: any): any[];
}
export declare class Stacked extends StackedBase {
    static DefaultConfig: any;
    constructor(option: any);
    getSeparator(topRow: any, bottomRow: any): string[];
}
export declare class Omnidirectional extends GS1DataBarFirstType {
    getLinkageOffset(data: any, linkageWidth: any): {
        linkageOffset: number;
        symbolOffset: number;
    };
}
export declare class Truncated extends Omnidirectional {
    static DefaultConfig: any;
    constructor(option: any);
}
/**
 * Defines the composite barcode component symbology that can be used in linkage.
 */
export declare enum Gs1DataBarLinkageVersion {
    /** CCA components have two ,three ,or four data columns, and range in size from three to twelve rows high.*/
    Cca = 0,
    /** CCB is multi-row symbology component which can encode up to 338 digits.
     * CCB components have two, three, or four data columns, and range in size from 4 to 44 rows high.
    */
    Ccb = 1
}
/** Defines symbology of MicroPDF encoding method*/
export declare enum MicroPdfCompactionMode {
    /** */
    Auto = 0,
    /** Include all printable ASCII characters and three ASCII control characters. */
    Text = 1,
    /** 8-bit bytes*/
    Numeric = 2,
    /** Long strings of consecutive numeric digits*/
    Byte = 3
}
/** Defines the symbol row and column count*/
export declare enum MicroPdfDimensions {
    ColumnPriority = 0,
    RowPriority = 1,
    Dim1x11 = 2,
    Dim1x14 = 3,
    Dim1x17 = 4,
    Dim1x20 = 5,
    Dim1x24 = 6,
    Dim1x28 = 7,
    Dim2x8 = 8,
    Dim2x11 = 9,
    Dim2x14 = 10,
    Dim2x17 = 11,
    Dim2x20 = 12,
    Dim2x23 = 13,
    Dim2x26 = 14,
    Dim3x6 = 15,
    Dim3x8 = 16,
    Dim3x10 = 17,
    Dim3x12 = 18,
    Dim3x15 = 19,
    Dim3x20 = 20,
    Dim3x26 = 21,
    Dim3x32 = 22,
    Dim3x38 = 23,
    Dim3x44 = 24,
    Dim4x4 = 25,
    Dim4x6 = 26,
    Dim4x8 = 27,
    Dim4x10 = 28,
    Dim4x12 = 29,
    Dim4x15 = 30,
    Dim4x20 = 31,
    Dim4x26 = 32,
    Dim4x32 = 33,
    Dim4x38 = 34,
    Dim4x44 = 35
}
export declare class _LinkageVersionConvertor {
    static stringToEnum(value: any): number;
    static enumToString(value: any): string;
}
export declare class _CompactionModeConvertor {
    static stringToEnum(value: any): number;
    static enumToString(value: any): string;
}
export declare function _MicroPdfDimensionsConvertor(enumStr: string): string;
/**
 * Base abstract class for all GS1 DataBar control classes.
 */
export declare abstract class Gs1DataBarBase extends BarcodeBase {
    /**
     * Abstract class constructor; never called.
     */
    constructor(element: any, option?: any);
    protected static _getClassDefaults(): any;
    /**
     * Indicates whether the value is rendered under the symbol.
     *
     * The default value for this property is <b>true</b>.
     */
    showLabel: boolean;
    /**
     * Gets or sets where to render the value of the control.
     *
     * The default value for this property is {@link LabelPosition.Bottom}.
     */
    labelPosition: LabelPosition;
    /**
     * Gets or sets a 2D Composite Component and its separator pattern are printed
     * above the GS1 DataBar symbol with the separator pattern aligned
     * and contiguous to the GS1 DataBar symbol.
     */
    linkage: string;
    /**
     * Gets or sets the composite barcode component that can be used in linkage.
     *
     * The default value for this property is {@link Gs1DataBarLinkageVersion.Cca}.
     */
    linkageVersion: Gs1DataBarLinkageVersion;
    /**Gets or sets the linkage symbol height. */
    linkageHeight: string | number;
    /**
     * Indicates whether to show the linkage in the label text.
     *
     * The default value for this property is <b>false</b>.
     */
    hideLinkageText: boolean;
    /**
     * Indicates whether to show the Application Identifier in the label text.
     *
     * The default value for this property is <b>false</b>.
     */
    hideAiText: boolean;
}
/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/GS1_DataBar" target="_blank">GS1 DataBar</a>
 * barcode type.
 */
export declare class Gs1DataBarOmnidirectional extends Gs1DataBarBase {
    static readonly type: string;
    /**
     * Initializes a new instance of the {@link Gs1DataBarOmnidirectional} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any);
}
/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/GS1_DataBar" target="_blank">GS1 DataBar</a>
 * barcode type.
 */
export declare class Gs1DataBarTruncated extends Gs1DataBarBase {
    static readonly type: string;
    /**
     * Initializes a new instance of the {@link Gs1DataBarTruncated} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any);
}
/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/GS1_DataBar" target="_blank">GS1 DataBar</a>
 * barcode type.
 */
export declare class Gs1DataBarStacked extends Gs1DataBarBase {
    static readonly type: string;
    /**
     * Initializes a new instance of the {@link Gs1DataBarStacked} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any);
    /**
     * Gets or sets the height of symbol top row ratio; supports any number.
     *
     * The default value for this property is <b>0.4</b>.
     */
    ratio: number;
}
/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/GS1_DataBar" target="_blank">GS1 DataBar</a>
 * barcode type.
 */
export declare class Gs1DataBarStackedOmnidirectional extends Gs1DataBarBase {
    static readonly type: string;
    /**
     * Initializes a new instance of the {@link Gs1DataBarStackedOmnidirectional} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any);
    /**
     * Gets or sets the height of symbol top row ratio; supports any number.
     *
     * The default value for this property is <b>0.4</b>.
     */
    ratio: number;
}
/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/GS1_DataBar" target="_blank">GS1 DataBar</a>
 * barcode type.
 */
export declare class Gs1DataBarLimited extends Gs1DataBarBase {
    static readonly type: string;
    /**
     * Initializes a new instance of the {@link Gs1DataBarLimited} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any);
}
/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/GS1_DataBar" target="_blank">GS1 DataBar</a>
 * barcode type.
 *
 * This is a variable width barcode, the width of which automatically changes
 * along with the length of the {@link value}. The {@link autoWidthZoom} property
 * can be used to zoom the automatically calculated width. The {@link autoWidth}
 * property can be used to disable this behavior.
 */
export declare class Gs1DataBarExpanded extends Gs1DataBarBase implements IVariableWidthBarcode {
    static readonly type: string;
    /**
     * Initializes a new instance of the {@link Gs1DataBarExpanded} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any);
    /**
     * Gets or sets a value indicating whether the control width should automatically
     * change along with the {@link value} length.
     *
     * If you set this property value to false, you should ensure that the control has some
     * reasonable *CSS width*.
     *
     * The default value for this property is **true**.
     */
    autoWidth: boolean;
    /**
     * Gets or sets a zoom factor applied to the automatically calculated control width.
     *
     * This property makes effect only if the {@link autoWidth} property is set to true.
     * It can take any numeric value equal or greater than 1.
     *
     * The default value for this property is **1**.
     */
    autoWidthZoom: number;
}
/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/GS1_DataBar" target="_blank">GS1 DataBar</a>
 * barcode type.
 *
 * This is a variable-width barcode, the width of which automatically changes
 * along with the length of the {@link value}. The {@link autoWidthZoom} property
 * can be used to zoom the automatically calculated width. The {@link autoWidth}
 * property can be used to disable this behavior.
 */
export declare class Gs1DataBarExpandedStacked extends Gs1DataBarBase implements IVariableWidthBarcode {
    static readonly type: string;
    /**
     * Initializes a new instance of the {@link Gs1DataBarExpandedStacked} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any);
    /**
     * Gets or sets a value indicating whether the control width should automatically
     * change along with the {@link value} length.
     *
     * If you set this property value to false, you should ensure that the control has some
     * reasonable *CSS width*.
     *
     * The default value for this property is **true**.
     */
    autoWidth: boolean;
    /**
     * Gets or sets a zoom factor applied to the automatically calculated control width.
     *
     * This property makes effect only if the {@link autoWidth} property is set to true.
     * It can take any numeric value equal or greater than 1.
     *
     * The default value for this property is **1**.
     */
    autoWidthZoom: number;
    /**
     * Gets or sets how many row count of the RSS Expanded will be stacked in.
     *
     * The default value for this property is <b>null</b> or <b>undefined</b>.
     */
    rowCount: number;
}
/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/PDF417" target="_blank">PDF417</a>
 * barcode type.
 *
 * This is a variable-width barcode, the width of which automatically changes
 * along with the length of the {@link value}. The {@link autoWidthZoom} property
 * can be used to zoom the automatically calculated width. The {@link autoWidth}
 * property can be used to disable this behavior.
 */
export declare class Pdf417 extends BarcodeBase implements IVariableWidthBarcode {
    static readonly type: string;
    /**
     * Initializes a new instance of the {@link Pdf417} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any);
    /**
     * Gets or sets a value indicating whether the control width should automatically
     * change along with the {@link value} length.
     *
     * If you set this property value to false, you should ensure that the control has some
     * reasonable *CSS width*.
     *
     * The default value for this property is **true**.
     */
    autoWidth: boolean;
    /**
     * Gets or sets a zoom factor applied to the automatically calculated control width.
     *
     * This property makes effect only if the {@link autoWidth} property is set to true.
     * It can take any numeric value equal or greater than 1.
     *
     * The default value for this property is **1**.
     */
    autoWidthZoom: number;
    /**
     * Gets or sets the error correction level of this control.
     * PDF417 symbology supports 9 levels of error correction,
     * with 0 being the least thorough and 8 being the most thorough.
     * When the correction level is set to 0, very little redundant information is encoded and the scanner
     * can perform little more than correct for the very simplest of errors.
     * When set to 8, significant scanning problems can be corrected.
     * The default error correction for PDF417 is "auto." This automatically specifies a
     * correction level based on the amount of information encoded into each PDF417 symbol.
     *
     * The possible property values are null | undefined | 0 - 8.
     * The default value for this property is <b>null</b> or <b>undefined</b>.
     */
    errorCorrectionLevel: number;
    /**
     * Gets or sets the number of columns in the symbol.
     *
     * The possible property values are null | undefined | 0 - 30.
     * The default value for this property is <b>null</b> or <b>undefined</b>.
     */
    columns: number;
    /**
     * Gets or sets the number of rows in the symbol.
     *
     * The possible property values are null | undefined | 3 - 90.
     * The default value for this property is <b>null</b> or <b>undefined</b>.
     */
    rows: number;
    /**
     * Indicates whether it is a compact PDF417 symbol.
     *
     * The default value for this property is <b>false</b>.
     */
    compact: boolean;
}
/**
 * Represents a control for drawing <a href="https://www.iso.org/standard/38838.html" target="_blank">MicroPDF417</a>
 * barcode type.
 */
export declare class MicroPdf417 extends BarcodeBase {
    static readonly type: string;
    private static _dimensionsDictionary;
    /**
     * Initializes a new instance of the {@link MicroPdf417} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any);
    private static _getEnumDictionary;
    /**
     * Gets or sets the symbol row and column count.
     *
     * The default value for this property is {@link MicroPdfDimensions.ColumnPriority}.
     */
    dimensions: MicroPdfDimensions;
    /**
     * Gets or sets the symbol encode method.
     *
     * The default value for this property is {@link MicroPdfCompactionMode.Auto}.
     */
    compactionMode: MicroPdfCompactionMode;
    /**
     * Indicates whether the structure append is enabled.
     *
     * The default value for this property is <b>false</b>.
     */
    structuredAppend: boolean;
    /**
     * Gets or sets the structure append index.
     *
     * The default value for this property is <b>0</b>.
     */
    segmentIndex: number;
    /**
     * Gets or sets the structure file ID.
     *
     * The default value for this property is <b>0</b>.
     */
    fileId: number;
    /**
     * Gets or sets structured append optional fields. Only supports segmentCount for now.
     */
    optionalFields: IOptionalFields;
}
