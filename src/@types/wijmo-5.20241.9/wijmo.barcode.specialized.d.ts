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
 * {@module wijmo.barcode.specialized}
 * Implements controls for drawing specialized barcode types.
 */
/**
 *
 */
export declare var ___keepComment: any;
import { TwoDimensionalBarcode, OneDimensionalBarcode, BarcodeBase, LabelPosition, NarrowToWideRatio, IVariableWidthBarcode } from '@mescius/wijmo.barcode';
import * as selfModule from '@mescius/wijmo.barcode.specialized';
export declare class CodeMap {
    static Datas: CodeMap[];
    Maps: any;
    constructor(b1: any, b2: any, b3: any);
}
export declare const ND = 255;
export declare const CODE_CC4 = 14;
export declare class CharMap {
    static Datas: CharMap[];
    Char: any;
    Val1: any;
    Val2: any;
    constructor(ch: any, val1: any, val2: any);
}
export declare class JapanesePost4StateCustomerCode extends OneDimensionalBarcode {
    constructor(option: any);
    validate(): void;
    checksum(n: any, tmp: any): number;
    calculateData(): any[];
    _fillSymbol(data: any, symbolArea: any): void;
    convertToShape(data: any, forMeasure: any): void;
}
export declare class ITFBase extends OneDimensionalBarcode {
    static StartPattern: string;
    static StopPattern: string;
    static DefaultConfig: {
        quietZone: {
            right: number;
            left: number;
        };
        nwRatio: number;
        bearerBar: boolean;
    };
    static Table: string[];
    static Weight: number[];
    static BearerBarWidth: number;
    private ratio;
    private bearerBar;
    constructor(option: any);
    checksum(text: any): number;
    _toPairs(): any[];
    _toPattern(str: any): string;
    _toZeroOnePattern(pattern: any): string;
    calculateData(): string;
    afterApplyDesiredSize(): void;
    convertToShape(data: any, forMeasure: any): void;
}
export declare class Interleaved2of5Encoder extends ITFBase {
    static DefaultConfig: any;
    constructor(option: any);
    validate(): void;
}
export declare class ITF_14_Encoder extends ITFBase {
    constructor(option: any);
    validate(): void;
}
export declare class EncodeTable_Code93 {
    static TABLE_CH: string[];
    static TABLE_CODE: string[];
    static TABLE_FULL_ASCII: string[];
    static getCode93Code(char: any): string;
    static getCode93Value(char: any): number;
    static getCharByValue(index: any): string;
    static getFullASCIIChar(text: any): string;
}
export declare class Code93Encoder extends OneDimensionalBarcode {
    static DefaultConfig: {
        checkDigit: boolean;
        fullASCII: boolean;
        quietZone: {
            right: number;
            left: number;
        };
    };
    static START_STOP_CHARACTERS: string;
    static TERMINATION: string;
    constructor(option: any);
    validate(): void;
    encode(str: any): string;
    calculateData(): string;
    checksum(str: any): string;
}
export declare function isNumericOnly(text: any): boolean;
export declare function getCharValue_Code49(char: any): any;
export declare function getWeight(row: any, col: any): {
    x: number;
    y: number;
    z: number;
};
export declare function getParityPattern(value: any, row: any, col: any, rowCount: any): any;
export declare function getGroupInfo(groupNo: any, groupCount: any): any;
export declare function getTextGroup(text: any): any[];
export declare class Code49Encoder extends TwoDimensionalBarcode {
    static DefaultConfig: {
        showLabel: boolean;
        grouping: boolean;
        groupNo: number;
        labelPosition: string;
        height: number;
        quietZone: {
            right: number;
            left: number;
        };
    };
    static CODE_NS: number;
    static START_PATTERN: string;
    static STOP_PATTERN: string;
    private text;
    private label;
    private mode;
    private groupCount;
    private modes;
    constructor(option: any);
    validate(): void;
    getModes(): void;
    encodeNumeric(text: any): any;
    encodeAlpha(text: any): any;
    calculateData(): any[];
    convertToShape(matrix: any, forMeasure: any): void;
    adjustDesiredSize(): void;
}
export declare class BitwiseIterator {
    private _data;
    offset: any;
    constructor(data: any, offset?: any);
    readonly bitLength: number;
    readonly currentBit: boolean;
    fetchBit(): boolean;
    getBit(offset: any): boolean;
    setBit(offset: any, bit: any): void;
    putBit(bit: any): void;
    putBitsMSF(data: any, bits: any, offset?: any): void;
    putBitsLSF(data: any, bits: any, offset?: any): void;
}
export declare function chooseEncodationScheme(data: any): number;
export declare function getCodeWord(scheme: any, value: any): any;
export declare function setBit(value: any, bitLS: any, bitValue: any): any;
export declare const Constants_140: {
    BaseValues: number[];
    GroupLengths: number[];
    HeaderBits: number[];
    BitLengths: number[][];
    SymbolCapacities: any[];
    getFormatID: (scheme: any) => any;
    ECCInfos: {
        inputBits: number;
        registerBits: number[];
        outputBits: number;
        outputMasks: any[][];
    }[];
    RandomizeBytes: number[];
    ModuleMapping: number[][];
};
export declare function getECC(mode: any): {
    eccInfo: {
        inputBits: number;
        registerBits: number[];
        outputBits: number;
        outputMasks: any[][];
    };
    headerBits: number;
};
export declare function getSymbolSizeInfo(key: any): any;
export declare function getSymbolSizeValue(key: any): number;
export declare function getProperSymbolSize(symbolSize: any, bitLength: any): any;
export declare function getModuleMapping(key: any): number[];
export declare function setFinder_140(matrix: any, symbolRows: any): void;
export declare function setRegionData_140(matrix: any, symbolRows: any, it: any): void;
export declare function generateErrorCorrectionCode(message: any, m_start: any, m_len: any, e_len: any): any;
export declare const CONSTANTS: {
    FNC1Input: number;
    Macro05Input: number;
    Macro06Input: number;
    StructuredAppand: number;
    FileIdentifierMax: number;
    ASCIIPad: number;
    ASCIIUpperShift: number;
    ASCIIFNC1: number;
    Macro05: number;
    Macro06: number;
    TripletUppershift: number;
    TripletFNC1: number;
    TripletPad: number;
    InvalidTripletValue: number;
    LatchToC40: number;
    LatchToBase256: number;
    LatchToX12: number;
    LatchToText: number;
    LatchToEDIFACT: number;
    TripletUnlatch: number;
    EDIFACTUnlatch: number;
    PseudoRandomSeed: number;
    PadRandomBase: number;
    Base256RandomBase: number;
    Base256SmallBlockSize: number;
    EDIFACTMask: number;
    Unvisited: number;
    TripletShifts: number[];
    MaxCodeWrods: number;
    MaxStructures: number;
    MaxLookAheadOffset: number;
};
export declare function getSymbolInfo(type: any): {
    symbolRows: number;
    symbolColumns: number;
    symbolDataCapacity: number;
    eccLength: number;
    interleavedBlocks: number;
    regions: number;
    regionRows: number;
    regionColumns: number;
};
export declare function getSuitableSymbolSize(prefered: any, codeLength: any): {
    symbolRows: number;
    symbolColumns: number;
    symbolDataCapacity: number;
    eccLength: number;
    interleavedBlocks: number;
    regions: number;
    regionRows: number;
    regionColumns: number;
};
export declare function getInfoOfRegions(size: any): {
    rowOfRegion: any;
    colOfRegion: any;
};
export declare function createModules(row: any, col?: any): any[];
export declare const TripletUppershift = 158;
export declare const TripletFNC1 = 155;
export declare const ASCIIMax = 127;
export declare const ExtendedASCIIMin = 128;
export declare const Space = 32;
export declare const NumericMin = 48;
export declare const NumericMax = 57;
export declare const LowerCasedLetterMin = 97;
export declare const LowerCasedLetterMax = 122;
export declare const UpperCasedLetterMin = 65;
export declare const UpperCasedLetterMax = 90;
export declare function getCharType(value: any): "Numeric" | "FNC1" | "ExtendedASCII" | "LowerCasedLetter" | "UpperCasedLetter" | "ASCIIOther";
export declare function getX12Value(value: any): number;
export declare function getTripletCharValue(charSet: any, value: any): any;
export declare function isDigit(value: any): boolean;
export declare function getTripletCharSetChannel(charSet: any, value: any): 1 | 0 | 3 | 2;
export declare function getTripletEncodeValues(charSet: any, symbol: any): any[];
export declare function getEDIFACTValue(value: any): number;
export declare function getRandomizedValue(value: any, position: any, baseValue: any): any;
export declare function mergeUnits(units: any): any[];
export declare function setFinder(matrix: any, info: any, rowOffset: any, colOffset: any): void;
export declare function setRegionData(matrix: any, info: any, r: any, c: any, data: any): void;
export declare class ECC000_140 {
    private text;
    private m_symbol;
    private symbolSize;
    private eccMode;
    private m_code;
    private m_module;
    private _symbolSize;
    constructor(text: any, config: any);
    getMatrix(): any[];
    eccProcess(symbolIterator: any, dataIterator: any, dataBits: any): void;
    randomizeBits(): void;
    crcProcess(scheme: any): number;
    calculateDataBits(scheme: any): number;
    calculateTotalBits(scheme: any, headerBits: any, dataBits: any): any;
    encode(scheme: any, bf: any): void;
    placeModule(): any[];
}
export declare class SymbolCharacterPlacement {
    private nrow;
    private ncol;
    private data;
    private matrix;
    constructor(data: any, nrow: any, ncol: any);
    ECC200(): any;
    module(row: any, col: any, chr: any, bit: any): void;
    utah(row: any, col: any, chr: any): void;
    corner1(chr: any): void;
    corner2(chr: any): void;
    corner3(chr: any): void;
    corner4(chr: any): void;
}
export declare class ECC200 {
    private text;
    private m_symbol;
    private symbolSize;
    private encodingMode;
    private structuredAppend;
    private structureNumber;
    private fileIdentifier;
    private symbolInfo;
    private m_code;
    constructor(text: any, config: any);
    preEncode(c_pos: any, s_pos: any): {
        c_pos: any;
        s_pos: any;
    };
    checkValue(start: any): boolean;
    getEncodingLength(charSet: any, codeWords: any, start: any, length: any): number;
    getMaxProperLength(start: any, maxLength: any): number;
    getCodeWordLength(charSet: any, start: any, length: any): number;
    getCodeLength(unit: any): number;
    getEncodingUnitsInfomative(start: any, maxLength: any, s_taken: any): {
        s_taken: any;
        units: any[];
    };
    getEncodingUnits(s_pos: any, maxLength: any): {
        c_length: number;
        s_taken: number;
        units: any;
    };
    encodeStructureHeader(c_pos: any, structureCount: any, fileInfo: any): any;
    generateFileIdentifier(structureCount: any, fileInfo: any): number;
    encode(unit: any, c_pos: any): any;
    encodeASCII(start: any, length: any, c_pos: any): any;
    encodeTriplet(charSet: any, start: any, length: any, c_pos: any): any;
    encodeC40(start: any, length: any, c_pos: any): any;
    encodeText(start: any, length: any, c_pos: any): any;
    encodeX12(start: any, length: any, c_pos: any): any;
    encodeEDIFACT(start: any, length: any, c_pos: any): any;
    encodeBase256(start: any, length: any, c_pos: any): any;
    padRight(c_pos: any): void;
    lookAhead(current: any, offset: any, codeLength: any, d_len: any): string | {
        d_len: any;
        newCharset: string;
    };
    getMatrix(): any[];
    eccProcess(): any;
    placeModules(data: any): any[];
}
export declare class DataMatrixEncoder extends TwoDimensionalBarcode {
    static DefaultConfig: {
        eccMode: string;
        ecc200SymbolSize: string;
        ecc200EncodingMode: string;
        ecc000_140SymbolSize: string;
        structuredAppend: boolean;
        structureNumber: number;
        fileIdentifier: number;
        quietZone: {
            top: number;
            left: number;
            right: number;
            bottom: number;
        };
    };
    private innerEncoder;
    constructor(option: any);
    calculateData(): any;
    validate(): void;
}
/** Indicates the symbol size in modules (excluding the quiet zone).*/
export declare enum DataMatrixVersion {
    Ecc000 = 0,
    Ecc050 = 1,
    Ecc080 = 2,
    Ecc100 = 3,
    Ecc140 = 4
}
export declare enum Ecc200EncodingMode {
    Auto = 0,
    Ascii = 1,
    C40 = 2,
    Text = 3,
    X12 = 4,
    Edifact = 5,
    Base256 = 6
}
export declare enum Ecc200SymbolSize {
    SquareAuto = 0,
    RectangularAuto = 1,
    Square10 = 2,
    Square12 = 3,
    Square14 = 4,
    Square16 = 5,
    Square18 = 6,
    Square20 = 7,
    Square22 = 8,
    Square24 = 9,
    Square26 = 10,
    Square32 = 11,
    Square36 = 12,
    Square40 = 13,
    Square44 = 14,
    Square48 = 15,
    Square52 = 16,
    Square64 = 17,
    Square72 = 18,
    Square80 = 19,
    Square88 = 20,
    Square96 = 21,
    Square104 = 22,
    Square120 = 23,
    Square132 = 24,
    Square144 = 25,
    Rectangular8x18 = 26,
    Rectangular8x32 = 27,
    Rectangular12x26 = 28,
    Rectangular12x36 = 29,
    Rectangular16x36 = 30,
    Rectangular16x48 = 31
}
export declare enum Ecc000_140SymbolSize {
    Auto = 0,
    Square9 = 1,
    Square11 = 2,
    Square13 = 3,
    Square15 = 4,
    Square17 = 5,
    Square19 = 6,
    Square21 = 7,
    Square23 = 8,
    Square25 = 9,
    Square27 = 10,
    Square29 = 11,
    Square31 = 12,
    Square33 = 13,
    Square35 = 14,
    Square37 = 15,
    Square39 = 16,
    Square41 = 17,
    Square43 = 18,
    Square45 = 19,
    Square47 = 20,
    Square49 = 21
}
export declare class _DataMatrixVersionConvertor {
    static stringToEnum(value: any): number;
    static enumToString(value: any): string;
}
export declare class _Ecc200EncodingModeConvertor {
    static stringToEnum(value: any): number;
    static enumToString(value: any): string;
}
export declare function _SymbolSizeConvertor(enumStr: string): string;
/**
 * Base abstract class for all DataMatrix barcode classes.
 */
export declare abstract class DataMatrixBase extends BarcodeBase {
    static readonly type: string;
    /**
     * Abstract class constructor, never call.
     */
    constructor(element: any, option?: any);
}
/**
 * Represents a control for drawing an old version of <a href="https://en.wikipedia.org/wiki/Data_Matrix" target="_blank">DataMatrix</a>
 * barcode by using ECC000 - ECC140.
 */
export declare class DataMatrixEcc000 extends DataMatrixBase {
    private static _symbolSizeDictionary;
    /**
     * Initializes a new instance of the {@link DataMatrixEcc000} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any);
    private static _getEnumDictionary;
    protected static _getClassDefaults(): any;
    /**
     * Gets or sets the ECC version of DataMatrix to render the barcode.
     *
     * The default value for this property is {@link DataMatrixVersion.Ecc000}.
     */
    version: DataMatrixVersion;
    /**
     * Gets or sets the size of symbol.
     *
     * The default value for this property is {@link Ecc000_140SymbolSize.Auto}.
     */
    symbolSize: Ecc000_140SymbolSize;
}
/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/Data_Matrix" target="_blank">DataMatrix</a>
 * barcode by using <a href="https://en.wikipedia.org/wiki/Reed%E2%80%93Solomon_error_correction" target="_blank">Reed-Solomon</a> codes of ECC200.
 */
export declare class DataMatrixEcc200 extends DataMatrixBase {
    private static _symbolSizeDictionary;
    /**
     * Initializes a new instance of the {@link DataMatrixEcc200} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any);
    private static _getEnumDictionary;
    protected static _getClassDefaults(): any;
    /**
     * Gets or sets the size of symbol.
     *
     * The default value for this property is {@link Ecc200SymbolSize.SquareAuto}.
     */
    symbolSize: Ecc200SymbolSize;
    /**
     * Gets or sets the encoding mode.
     *
     * The default value for this property is {@link Ecc200EncodingMode.Auto}.
     */
    encodingMode: Ecc200EncodingMode;
    /**
     * Indicates whether the symbol is part of a structured append message.
     *
     * The default value for this property is <b>false</b>.
     */
    structuredAppend: boolean;
    /**
     * Gets or sets the block in which the symbol is in the structured append message.
     *
     * The possible property values are 0 - 15.
     * The default value for this property is <b>0</b>.
     */
    structureNumber: number;
    /**
     * Gets or sets the file identification of this control.
     *
     * The possible property values are 1 - 254.
     * The default value for this property is <b>0</b>.
     */
    fileIdentifier: number;
}
/**
 * Represents a control for drawing <a href="https://de.wikipedia.org/wiki/Code_49" target="_blank">Code49</a>
 * barcode type.
 */
export declare class Code49 extends BarcodeBase {
    static readonly type: string;
    /**
     * Initializes a new instance of the {@link Code49} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any);
    /**
     * Indicates whether the value is rendered under the symbol.
     *
     * The default value for this property is <b>true</b>.
     */
    showLabel: boolean;
    /**
     * Indicates whether the symbol mode is Group Alphanumeric Mode.
     *
     * The default value for this property is <b>false</b>.
     */
    grouping: boolean;
    /**
     * Gets or sets the index of the symbol in group.
     *
     * The default value for this property is <b>0</b>.
     */
    groupIndex: number;
    /**
     * Gets or sets the position to render the value of the control.
     *
     * The default value for this property is {@link LabelPosition.Bottom}.
     */
    labelPosition: LabelPosition;
}
/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/Code_93" target="_blank">Code93</a>
 * barcode type.
 *
 * This is a variable-width barcode, the width of which automatically changes
 * along with the length of the {@link value}. The {@link autoWidthZoom} property
 * can be used to zoom the automatically calculated width. The {@link autoWidth}
 * property can be used to disable this behavior.
 */
export declare class Code93 extends BarcodeBase implements IVariableWidthBarcode {
    static readonly type: string;
    /**
     * Initializes a new instance of the {@link code93} class.
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
     * Gets or sets whether the value is rendered under the symbol.
     *
     * The default value for this property is <b>true</b>.
     */
    showLabel: boolean;
    /**
     * Indicates whether the symbol needs the check digit with the Luhn algorithm.
     *
     * The default value for this property is <b>false</b>.
     */
    checkDigit: boolean;
    /**
     * Indicates whether the symbol enables encoding of all 93 ASCII characters.
     *
     * The default value for this property is <b>false</b>.
     */
    fullAscii: boolean;
    /**
     * Gets or sets the position to render the value of the control.
     *
     * The default value for this property is {@link LabelPosition.Bottom}.
     */
    labelPosition: LabelPosition;
}
/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/ITF-14" target="_blank">ITF-14</a>
 * barcode type.
 */
export declare class Itf14 extends BarcodeBase {
    static readonly type: string;
    /**
     * Initializes a new instance of the {@link Itf14} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any);
    /**
     * Indicates whether the value is rendered under the symbol.
     *
     * The default value for this property is <b>true</b>.
     */
    showLabel: boolean;
    /**
     * Gets or sets the narrow and wide bar ratio of the control.
     *
     * The possible property values are 1:2 or 1:3.
     * The default value for this property is {@link NarrowWideRatio.OneToThree}.
     */
    nwRatio: NarrowToWideRatio;
    /**
     * Indicates whether to enable bearer bar (thick black border) around the symbol.
     *
     *
     * The default value for this property is <b>false</b>.
     */
    bearerBar: boolean;
    /**
     * Gets or sets where to render the value of the control.
     *
     * The default value for this property is {@link LabelPosition.Bottom}.
     */
    labelPosition: LabelPosition;
}
/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/Interleaved_2_of_5" target="_blank">Interleaved2of5</a>
 * barcode type.
 *
 * This is a variable-width barcode, the width of which automatically changes
 * along with the length of the {@link value}. The {@link autoWidthZoom} property
 * can be used to zoom the automatically calculated width. The {@link autoWidth}
 * property can be used to disable this behavior.
 */
export declare class Interleaved2of5 extends BarcodeBase implements IVariableWidthBarcode {
    static readonly type: string;
    /**
     * Initializes a new instance of the {@link Interleaved2of5} class.
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
     * Indicates whether to render the value under the symbol.
     *
     * The default value for this property is <b>true</b>.
     */
    showLabel: boolean;
    /**
     * Gets or sets the narrow and wide bar ratio of the control.
     *
     * The possible property values are 1:2 or 1:3.
     * The default value for this property is {@link NarrowWideRatio.OneToThree}.
     */
    nwRatio: NarrowToWideRatio;
    /**
     * Indicates whether to enable bearer bar (the thick black border) around the symbol.
     *
     *
     * The default value for this property is <b>false</b>.
     */
    bearerBar: boolean;
    /**
     * Gets or sets where to render the value of the control.
     *
     * The default value for this property is {@link LabelPosition.Bottom}.
     */
    labelPosition: LabelPosition;
    /**
     * Indicates whether to enable the check character.
     * Since Interleaved2of5 requires an even number of digits to “interleave”
     * numbers, the data encoded must be an odd number of digits when using a check
     * character, thus resulting in the required even number of digits.
     *
     * The default value for this property is <b>false</b>.
     */
    checkCharacter: boolean;
}
/**
 * Represents the Japanese Postal barcode type and any particular settings of this type.
 */
export declare class JapanesePostal extends BarcodeBase {
    static readonly type: string;
    /**
     * Initializes a new instance of the {@link JapanesePostal} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any);
    /**
     * Indicates whether to render the value under the symbol.
     *
     * The default value for this property is <b>true</b>.
     */
    showLabel: boolean;
    /**
     * Gets or sets the position to render the value of the control.
     *
     * The default value for this property is {@link LabelPosition.Bottom}.
     */
    labelPosition: LabelPosition;
}
