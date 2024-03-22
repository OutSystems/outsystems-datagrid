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
 * {@module wijmo.barcode.common}
 * Implements controls for drawing the most common barcode types.
 */
/**
 *
 */
export declare var ___keepComment: any;
import { OneDimensionalBarcode, BitBuffer, TwoDimensionalBarcode, BarcodeBase, IQuietZoneWithAddOn, LabelPosition, NarrowToWideRatio, IVariableWidthBarcode } from '@mescius/wijmo.barcode';
export declare function generateErrorCorrectionCode(codewords: any, ecCount: any, dataCount: any): any;
export declare function getBCH15(data: any, model: any): number;
export declare function getBCH18(data: any): number;
export declare const MODE_INDICATOR: {
    ECI: number;
    Numeric: number;
    Alphanumeric: number;
    '8BitByte': number;
    Kanji: number;
    StructuredAppend: number;
    FNC1First: number;
    FNC2Second: number;
    Terminator: number;
};
export declare const EC_INDICATOR: {
    L: number;
    M: number;
    Q: number;
    H: number;
};
export declare function isMode(mode: any, charcode: any): any;
export declare function getCharMode(code: any, charset?: string): "Numeric" | "Alphanumeric" | "Kanji" | "8BitByte";
export declare const getSizeByVersion: (version: any) => number;
export declare function getCharacterCountIndicatorbitsNumber(version: any): {
    Numeric: number;
    Alphanumeric: number;
    '8BitByte': number;
    Kanji: number;
};
export declare function getAlphanumericCharValue(cc: any): any;
export declare function createModules(size: any): any[];
export declare function getAlignmentPattersPos(version: any): number[];
export declare const padCodewords0 = 236;
export declare const padCodewords1 = 17;
export declare const maskFuncs: ((i: any, j: any) => boolean)[];
export declare function getErrorCorrectionCharacteristics(version: any, ecLevel: any, model?: number): any[];
export declare function getMaskFunc(type: any): (i: any, j: any) => boolean;
export declare function getMaskScore(modules: any): number;
export declare function addFormatInformation(originModules: any, maskPattern: any, ec: any, model: any): any;
export declare function getEstimatedVersion(ec: any, charCode: any, model: any): number;
export declare function getModeCheckInfo(mode: any, version: any): any;
export declare function utf8Encode(charCode: any): any[];
export declare function getParityData(charCode: any): any;
export declare function getCharCode(text: any): any[];
export declare class ModeKanji {
    private mode;
    private data;
    constructor(data: any);
    getMode(): number;
    getLength(): any;
    write(buffer: any): void;
}
export declare class ModeAlphanumeric {
    private mode;
    private data;
    constructor(data: any);
    getMode(): number;
    getLength(): any;
    write(buffer: any): void;
}
export declare class ModeNumeric {
    private mode;
    private data;
    constructor(data: any);
    getMode(): number;
    getLength(): any;
    write(buffer: any): void;
}
export declare class Mode8BitByte {
    private mode;
    private data;
    private bytes;
    constructor(data: any);
    getMode(): number;
    getLength(): any;
    write(buffer: any): void;
}
export declare abstract class QRCodeBase {
    protected charCode: any;
    protected config: any;
    protected errorCorrectionLevel: any;
    protected model: any;
    protected version: any;
    protected modulesCount: any;
    protected charCountIndicatorBitsNumber: any;
    protected modules: any;
    protected maskPattern: any;
    private errorCorrectionCharacteristics;
    private totalDataCount;
    private totalDataBits;
    constructor(text: any, config: any);
    getConnections(): any[];
    processConnection(buffer: any): any;
    padBuffer(buffer: any): void;
    getAutoVersion(): number;
    analysisData(charCode: any): {
        mode: string;
        code: any[];
    }[];
    abstract encodeData(data?: any, info?: any): any;
    generateErrorCorrectionCode(buffer: any): any[];
    abstract getFinalMessage(): any;
    abstract setModules(): any;
    abstract maskModules(): any;
    abstract autoMask(): any;
    addRectModule(x: any, y: any, w: any, h: any, flag?: boolean): void;
    addPositionDetectionPattern(): void;
    addTimingPattern(): void;
    addPattern(x: any, y: any, s: any): void;
    abstract getMatrix(): any;
}
export declare class QRCodeModel2 extends QRCodeBase {
    encodeData(sets?: any, connectionInfo?: any): BitBuffer;
    getFinalMessage(blocks?: any): any[];
    setModules(data?: any): void;
    maskModules(data?: any): void;
    autoMask(data?: any): void;
    addAlignmentPattern(): void;
    addVersionInformation(): void;
    fillDataModules(modules: any, data: any, maskFunc: any): any;
    getMatrix(): any;
}
export declare class QRCodeModel1 extends QRCodeBase {
    encodeData(sets?: any, connectionInfo?: any): BitBuffer;
    getFinalMessage(blocks?: any): any[];
    setModules(data?: any): void;
    maskModules(data?: any): void;
    autoMask(data?: any): void;
    addExtensionPattern(): void;
    addBaseExtension(x: any): void;
    addRightExtension(x: any): void;
    fillDataModules(modules: any, data: any, maskFunc: any): any;
    getMatrix(): any;
}
export declare class QRCodeEncoder extends TwoDimensionalBarcode {
    static DefaultConfig: {
        version: string;
        errorCorrectionLevel: string;
        model: number;
        mask: string;
        connection: boolean;
        connectionNo: number;
        charCode: any;
        charset: string;
        quietZone: {
            top: number;
            left: number;
            right: number;
            bottom: number;
        };
    };
    private innerQRCode;
    constructor(option: any);
    calculateData(): any;
    validate(): void;
}
export declare const stopPattern = "2331112";
export declare const Code128Sym: {
    CodeC: number;
    CodeB: number;
    CodeA: number;
    FNC1: number;
    FNC2: number;
    FNC3: number;
    StartA: number;
    StartB: number;
    StartC: number;
};
export declare const Code128Char: {
    CodeC: string;
    CodeB: string;
    CodeA: string;
    FNC1: string;
    FNC2: string;
    FNC3: string;
    StartA: string;
    StartB: string;
    StartC: string;
};
export declare function getCharValue(str: any, table: any): any;
export declare function getCharPattern(str: any, table: any): string;
export declare function getPatternByIndex(index: any): string;
export declare function encode(str: any): string;
export declare class Code128Auto {
    private text;
    private isUccEan128;
    constructor(text: any, isUccEan128?: boolean);
    validate(): void;
    calculateGroup(): any[];
    getData(): string;
    checksum(groups: any): number;
}
export declare class Code128C {
    private text;
    constructor(text: any);
    validate(): void;
    getData(): string;
    checksum(): number;
}
export declare class Code128B {
    private text;
    constructor(text: any);
    validate(): void;
    getData(): string;
    checksum(): number;
}
export declare class Code128A {
    private text;
    constructor(text: any);
    validate(): void;
    getData(): string;
    checksum(): number;
}
export declare class Code128Encoder extends OneDimensionalBarcode {
    static DefaultConfig: {
        codeSet: string;
        quietZone: {
            right: number;
            left: number;
        };
    };
    private isUccEan128;
    constructor(option: any, isUccEan128?: boolean);
    validate(): void;
    calculateData(): any;
}
export declare class GS1_128Encoder extends Code128Encoder {
    constructor(option: any);
}
export declare class EncodeTable_Code39 {
    static TABLE: {
        '0': string;
        '1': string;
        '2': string;
        '3': string;
        '4': string;
        '5': string;
        '6': string;
        '7': string;
        '8': string;
        '9': string;
        'A': string;
        'B': string;
        'C': string;
        'D': string;
        'E': string;
        'F': string;
        'G': string;
        'H': string;
        'I': string;
        'J': string;
        'K': string;
        'L': string;
        'M': string;
        'N': string;
        'O': string;
        'P': string;
        'Q': string;
        'R': string;
        'S': string;
        'T': string;
        'U': string;
        'V': string;
        'W': string;
        'X': string;
        'Y': string;
        'Z': string;
        '-': string;
        '.': string;
        ' ': string;
        '$': string;
        '/': string;
        '+': string;
        '%': string;
        '*': string;
    };
    static MODULO_43_CHECK_TABLE: any;
    static FULL_ASCII_TABLE: string[];
    static getMod43Val(text: any): any;
    static getFullASCIIChar(text: any): string;
}
export declare class Code39Encoder extends OneDimensionalBarcode {
    static DefaultConfig: {
        checkDigit: boolean;
        fullASCII: boolean;
        nwRatio: number;
        labelWithStartAndStopCharacter: boolean;
        quietZone: {
            right: number;
            left: number;
        };
    };
    static START_STOP_CHARACTERS: string;
    private nwRatio;
    constructor(option: any);
    validate(): void;
    encode(str: any): string;
    calculateData(): string;
}
export declare class EncodeTable {
    static TABLE: {
        A: string[];
        B: string[];
        C: string[];
    };
    static encodeCharByTable(char: any, tableName: any): any;
    static encodeByStructure(text: any, structure: any): any;
    static encodeByTable(text: any, tableName: any): any;
}
export declare class AddOnSymbol {
    private addOn;
    private isTextGroup;
    private addOnHeight;
    static fiveDigitAddOnStructure: string[];
    static ADD_ON_GUARD: string;
    static ADD_ON_DELINEATOR: string;
    static get2DigitAddOnTable(num: any): {
        leftStructure: string;
        rightStructure: string;
    };
    static get5DigitAddOnTable(num: any): string;
    constructor(addOn: any, addOnHeight: any, isTextGroup: any, unitValue: any);
    validate(): void;
    _encode2DigitAddOn(): any[];
    _encode5DigitAddOn(): any[];
    calculateData(): any[];
}
export declare abstract class EANBase extends OneDimensionalBarcode {
    static NORMAL_GUARD: string;
    static CENTRE_GUARD: string;
    static DefaultConfig: any;
    protected isTextGroup: boolean;
    private isAddOnLabelBottom;
    protected addOn: AddOnSymbol;
    private addOnHeight;
    constructor(option: any);
    _setAddOn(addOn: any, addOnHeight: any, unitValue: any): void;
    checksum(number: any, evenMultiply3?: boolean): number;
    convertToShape(data: any): void;
    afterApplyDesiredSize(): void;
}
export declare class UPC_E extends EANBase {
    static DefaultConfig: {
        addOnHeight: string;
        addOnLabelPosition: string;
        quietZone: {
            left: number;
            addOn: number;
        };
    };
    static SPECIAL_GUARD: string;
    private prefix;
    private tableStructure;
    constructor(option: any, prefix: any, tableStructure: any);
    validate(): void;
    checksum(text: any): number;
    calculateData(): any[];
}
export declare class UPC_E1_Encoder extends UPC_E {
    static structure: string[];
    constructor(option: any);
}
export declare class UPC_E0_Encoder extends UPC_E {
    static structure: string[];
    constructor(option: any);
}
export declare class UPC_A_Encoder extends EANBase {
    static DefaultConfig: {
        addOnHeight: string;
        addOnLabelPosition: string;
        quietZone: {
            right: number;
            left: number;
            addOn: number;
        };
    };
    constructor(option: any);
    validate(): void;
    calculateData(): any[];
}
export declare class EAN13Encoder extends EANBase {
    static leftStructure: string[];
    static DefaultConfig: any;
    constructor(option: any);
    validate(): void;
    calculateData(): any[];
}
export declare class EAN8Encoder extends EANBase {
    static DefaultConfig: {
        quietZone: {
            left: number;
        };
    };
    constructor(option: any);
    validate(): void;
    calculateData(): any[];
}
export declare class CodabarEncoder extends OneDimensionalBarcode {
    static DefaultConfig: {
        checkDigit: boolean;
        quietZone: {
            right: number;
            left: number;
        };
        nwRatio: number;
    };
    static TABLE: {
        '0': string;
        '1': string;
        '2': string;
        '3': string;
        '4': string;
        '5': string;
        '6': string;
        '7': string;
        '8': string;
        '9': string;
        '-': string;
        '$': string;
        ':': string;
        '/': string;
        '.': string;
        '+': string;
        'A': string;
        'B': string;
        'C': string;
        'D': string;
    };
    private nwRatio;
    constructor(option: any);
    validate(): void;
    getTextEntity(text: any): {
        originStartPattern: string;
        startPattern: string;
        content: string;
        originStopPattern: string;
        stopPattern: string;
    };
    encode(str: any): string;
    calculateData(): string;
    checksum(text: any): number;
}
/**
 * Defines encoding charset type for barcode.
 */
export declare enum QrCodeCharset {
    /** Uses UTF-8 charset for encoding */
    Utf8 = 0,
    /** Uses Shift_JIS charset for encoding */
    ShiftJis = 1
}
/**
 * Defines QRCode Error Correction level to restore data if the code is dirty or damaged.
 * Please refer to the details about <a href="https://www.qrcode.com/en/about/error_correction.html" target="_blank">ErrorCorrectionLevel</a>
 */
export declare enum QrCodeCorrectionLevel {
    /** It corrects code approx 7% */
    Low = 0,
    /** It corrects code approx 15% */
    Medium = 1,
    /** It corrects code approx 25% */
    Quartile = 2,
    /** It corrects code approx 30% */
    High = 3
}
/** Indicates the model style of QRCode used. */
export declare enum QrCodeModel {
    /** QRCode model1:Original model. Model1 is the prototype of Model2 and
     * Micro QR.1 to 14 versions are registered to the AIMI standard.
    */
    Model1 = 0,
    /** QRCode model2:Extended model. Model2 has an alignment pattern for better
     * position adjustment and contains larger data than Model 1.
     * 1 to 40 version are registered to the AIMI standard.
    */
    Model2 = 1
}
/**
 * Defines which code set is used to create Code128.
 * Please refer to the details about <a href="https://www.qrcode.com/en/about/error_correction.html" target="_blank">CodeSet</a>
 */
export declare enum Code128CodeSet {
    /** */
    Auto = 0,
    /** 128A (Code Set A) – Uses ASCII characters 00 to 95 (0–9, A–Z and control codes), special characters, and FNC 1–4 */
    A = 1,
    /** 128B (Code Set B) – Uses ASCII characters 32 to 127 (0–9, A–Z, a–z), special characters, and FNC 1–4 */
    B = 2,
    /** 128C (Code Set C) – Uses 00–99 (encodes two digits with a single code point) and FNC1 */
    C = 3
}
export declare class _QrCodeModelConvertor {
    static stringToEnum(value: number): number;
    static enumToString(value: any): string;
}
export declare class _CharsetTypeConvertor {
    static stringToEnum(value: any): number;
    static enumToString(value: any): string;
}
export declare class _CorrectionLevelConvertor {
    static stringToEnum(value: any): number;
    static enumToString(value: any): string;
}
export declare class _CodeSetTypeConvertor {
    static stringToEnum(value: any): number;
    static enumToString(value: any): string;
}
/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/Codabar" target="_blank">Codabar</a>
 * barcode type.
 *
 * This is a variable-width barcode, the width of which automatically changes
 * along with the length of the {@link value}. The {@link autoWidthZoom} property
 * can be used to zoom the automatically calculated width. The {@link autoWidth}
 * property can be used to disable this behavior.
 */
export declare class Codabar extends BarcodeBase implements IVariableWidthBarcode {
    static readonly type: string;
    /**
     * Initializes a new instance of the {@link Codabar} class.
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
     * Indicates whether the value is rendered under the symbol.
     *
     * The default value for this property is <b>true</b>.
     */
    showLabel: boolean;
    /**
     * Indicates whether the symbol needs a check digit with the Luhn algorithm.
     *
     * The default value for this property is <b>false</b>.
     */
    checkDigit: boolean;
    /**
     * Gets or sets where to render the value of the control.
     *
     * The default value for this property is {@link LabelPosition.Bottom}.
     */
    labelPosition: LabelPosition;
    /**
     * Gets or sets the narrow and wide bar ratio of the control.
     *
     * The possible property values are 1:2 or 1:3.
     * The default value for this property is {@link NarrowWideRatio.OneToThree}.
     */
    nwRatio: NarrowToWideRatio;
}
/**
 * Base abstract class for Ean8 and Ean13 control classes.
 */
export declare abstract class EanBase extends BarcodeBase {
    /**
     * Abstract class constructor, never called.
     */
    constructor(element: any, option?: any);
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
}
/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/EAN-8" target="_blank">EAN-8</a>
 * barcode type.
 */
export declare class Ean8 extends EanBase {
    static readonly type: string;
    /**
     * Initializes a new instance of the {@link Ean8} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any);
}
/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/International_Article_Number" target="_blank">EAN-13</a>
 * barcode type.
 */
export declare class Ean13 extends EanBase {
    static readonly type = "EAN13";
    /**
     * Initializes a new instance of the {@link Ean13} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any);
    /**
     * Gets or sets the addOn value of the control.
     *
     * The possible length of this property should be 2 or 5.
     */
    addOn: string | number;
    /**
     * Gets or sets the height of addOn symbol of the control.
     *
     * The default value for this property is <b>auto</b>.
     */
    addOnHeight: string | number;
    /**
     * Gets or sets where to render the addOn value of the control.
     *
     * The default value for this property is {@link LabelPosition.Top}.
     */
    addOnLabelPosition: LabelPosition;
    /**
     * Gets or sets the size of quiet zone (the blank margin) around the barcode symbol.
     */
    quietZone: IQuietZoneWithAddOn;
}
/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/Code_39" target="_blank">Code39</a>
 * barcode type.
 *
 * This is a variable-width barcode, the width of which automatically changes
 * along with the length of the {@link value}. The {@link autoWidthZoom} property
 * can be used to zoom the automatically calculated width. The {@link autoWidth}
 * property can be used to disable this behavior.
 */
export declare class Code39 extends BarcodeBase implements IVariableWidthBarcode {
    static readonly type: string;
    /**
     * Initializes a new instance of the {@link Code39} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any);
    /**
     * Gets or sets a value indicating whether the control width should automatically
     * change along with the {@link value} length.
     *
     * If you set this property to false, you should ensure that the control has some
     * reasonable *CSS width*.
     *
     * The default value for this property is **true**.
     */
    autoWidth: boolean;
    /**
     * Gets or sets a zoom factor applied to the automatically calculated control width.
     *
     * This property takes effect only if the {@link autoWidth} property is set to true.
     * It can take any numeric value equal to or greater than 1.
     *
     * The default value for this property is **1**.
     */
    autoWidthZoom: number;
    /**
     * Indicates whether the value is rendered under the symbol.
     *
     * The default value for this property is <b>true</b>.
     */
    showLabel: boolean;
    /**
     * Indicates whether the symbol needs a <a href="https://en.wikipedia.org/wiki/Modulo_operation" target="_blank">modulo</a> 43 <a href="https://en.wikipedia.org/wiki/Checksum" target="_blank">check digit</a>.
     *
     * The default value for this property is <b>false</b>.
     */
    checkDigit: boolean;
    /**
     * Indicates whether the symbol enables encoding of all 128 ASCII characters.
     *
     * The default value for this property is <b>false</b>.
     */
    fullAscii: boolean;
    /**
     * Gets or sets where to render the value of the control.
     *
     * The default value for this property is {@link LabelPosition.Bottom}.
     */
    labelPosition: LabelPosition;
    /**
     * Gets or sets the narrow and wide bar ratio of the control.
     *
     * The possible property values are 1:2 or 1:3.
     * The default value for this property is {@link NarrowWideRatio.OneToThree}.
     */
    nwRatio: NarrowToWideRatio;
    /**
     * Indicates whether to show the start and stop character in the label.
     *
     * The default value for this property is <b>false</b>.
     */
    labelWithStartAndStopCharacter: boolean;
}
/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/Code_128" target="_blank">Code128</a>
 * barcode type.
 *
 * This is a variable-width barcode, the width of which automatically changes
 * along with the length of the {@link value}. The {@link autoWidthZoom} property
 * can be used to zoom the automatically calculated width. The {@link autoWidth}
 * property can be used to disable this behavior.
 */
export declare class Code128 extends BarcodeBase implements IVariableWidthBarcode {
    static readonly type: string;
    /**
     * Initializes a new instance of the {@link Code128} class.
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
     * It can take any numeric value equal to or greater than 1.
     *
     * The default value for this property is **1**.
     */
    autoWidthZoom: number;
    /**
     * Indicates whether the value is rendered under the symbol.
     *
     * The default value for this property is <b>true</b>.
     */
    showLabel: boolean;
    /**
     * Gets or sets which kind of code set is used in this control.
     *
     * The default value for this property is {@link Code128CodeSet.Auto}.
     */
    codeSet: Code128CodeSet;
    /**
     * Gets or sets where to render the value of the control.
     *
     * The default value for this property is {@link LabelPosition.Bottom}.
     */
    labelPosition: LabelPosition;
}
/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/GS1-128" target="_blank">GS1_128</a>
 * barcode type.
 *
 * This is a variable-width barcode, the width of which automatically changes
 * along with the length of the {@link value}. The {@link autoWidthZoom} property
 * can be used to zoom the automatically calculated width. The {@link autoWidth}
 * property can be used to disable this behavior.
 */
export declare class Gs1_128 extends BarcodeBase implements IVariableWidthBarcode {
    static readonly type: string;
    /**
     * Initializes a new instance of the {@link Gs1_128} class.
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
     * It can take any numeric value equal to or greater than 1.
     *
     * The default value for this property is **1**.
     */
    autoWidthZoom: number;
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
}
/**
 * Base abstract class for all UPC barcode control classes.
 */
export declare class UpcBase extends BarcodeBase {
    /**
     * Abstract class constructor, never call.
     */
    constructor(element: any, option?: any);
    /**
     * Indicates whether the value is rendered under the symbol.
     *
     * The default value for this property is <b>true</b>.
     */
    showLabel: boolean;
    /**
     * Gets or sets the addOn value of the control.
     *
     * The possible length of this property should be 2 or 5.
     */
    addOn: string | number;
    /**
     * Gets or sets where to render the value of the control.
     *
     * The default value for this property is {@link LabelPosition.Bottom}.
     */
    labelPosition: LabelPosition;
    /**
     * Gets or sets the height of addOn symbol of the control.
     *
     * The default value for this property is <b>auto</b>.
     */
    addOnHeight: string | number;
    /**
     * Gets or sets where to render the addOn value of the control.
     *
     * The default value for this property is {@link LabelPosition.Top}.
     */
    addOnLabelPosition: LabelPosition;
    /**
     * Gets or sets the size of quiet zone (the blank margin) around the barcode symbol.
     */
    quietZone: IQuietZoneWithAddOn;
}
/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/Universal_Product_Code" target="_blank">UPC-A</a>
 * barcode type.
 */
export declare class UpcA extends UpcBase {
    static readonly type: string;
    /**
     * Initializes a new instance of the {@link UpcA} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any);
}
/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/Universal_Product_Code" target="_blank">UPC-E0</a>
 * barcode type.
 */
export declare class UpcE0 extends UpcBase {
    static readonly type: string;
    /**
     * Initializes a new instance of the {@link UpcE0} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any);
}
/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/Universal_Product_Code" target="_blank">UPC-E1</a>
 * barcode type.
 */
export declare class UpcE1 extends UpcBase {
    static readonly type: string;
    /**
     * Initializes a new instance of the {@link UpcE1} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any);
}
/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/QR_code" target="_blank">QRCode</a>
 * barcode type.
 */
export declare class QrCode extends BarcodeBase {
    static readonly type: string;
    /**
     * Initializes a new instance of the {@link QrCode} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any);
    /**
     * Gets or sets the collection of characters associated with the charset.
     */
    charCode: number[];
    /**
     * Gets or sets which charset to encode this control.
     *
     * The default value for this property is {@link QrCodeCharset.Utf8}.
     */
    charset: QrCodeCharset;
    /**
     * Gets or sets the model style of the control used.
     *
     * The default value for this property is {@link QrCodeModel.Model2}.
     */
    model: QrCodeModel;
    /**
     * Gets or sets the different module configuration of the control.
     * The versions of QRCode range from version 1 to version 40.
     * Each version has a different module configuration or number of modules.
     * (The module refers to the black and white dots that make up QRCode.)
     *
     * The default value for this property is <b>null</b> or <b>undefined</b>.
     */
    version: number;
    /**
     * Gets or sets the restoration ability of QRCode.
     *
     * The default value for this property is {@link QrCodeCorrectionLevel.Low}.
     */
    errorCorrectionLevel: QrCodeCorrectionLevel;
    /**
     * Gets or sets the patterns that are defined on a grid, which are repeated as necessary to cover the whole symbol.
     *
     * The default value for this property is <b>null</b> or <b>undefined</b>.
     */
    mask: number;
    /**
     * Indicates whether the symbol is a part of a structured append message.
     *
     * The default value for this property is <b>false</b>.
     */
    connection: boolean;
    /**
     * Gets or sets the index of the symbol block in the structured append message.
     *
     * The possible property values are 0 - 15.
     * The default value for this property is <b>0</b>.
     */
    connectionIndex: number;
}
