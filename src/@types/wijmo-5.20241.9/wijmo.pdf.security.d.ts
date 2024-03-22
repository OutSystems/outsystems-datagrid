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
 * {@module wijmo.pdf.security}
 * Provides PDF encryption and permissions settings for the {@link wijmo.pdf} module.
 *
 * Add this module on page to be able to use the {@link wijmo.pdf.IPdfDocumentOptions.ownerPassword},
 * {@link wijmo.pdf.IPdfDocumentOptions.permissions} and {@link wijmo.pdf.IPdfDocumentOptions.userPassword}
 * properties while creating an instance of the {@link wijmo.pdf.PdfDocument} class:
 *
 * ```typescript
 * import { PdfDocument, saveBlob } from '@mescius/wijmo.pdf';
 * import '@mescius/wijmo.pdf.security';
 *
 * let doc = new PdfDocument({
 *    userPassword: 'abc',
 *    ended: (doc, args) => {
 *       saveBlob(args.blob, 'document.pdf');
 *    }
 * });
 *
 * doc.end();
 * ```
 *
 * This module incorporates modified versions of the
 * <a href="https://github.com/feross/buffer" target="_blank">buffer</a>,
 * <a href="https://github.com/brix/crypto-js" target="_blank">crypto-js</a> and
 * <a href="https://github.com/reklatsmasters/saslprep" target="_blank">saslprep</a>
 * libraries.
*/
/**
 *
 */
export declare var ___keepComment: any;
import * as selfModule from '@mescius/wijmo.pdf.security';
export declare function Buffer(arg: any, encodingOrOffset?: any, length?: any): void;
export declare function inRange(value: any, rangeGroup: any): boolean;
export declare const isUnassignedCodePoint: (character: any) => boolean;
export declare const isCommonlyMappedToNothing: (character: any) => boolean;
export declare const isNonASCIISpaceCharacter: (character: any) => boolean;
export declare const isProhibitedCharacter: (character: any) => boolean;
export declare const isBidirectionalRAL: (character: any) => boolean;
export declare const isBidirectionalL: (character: any) => boolean;
export declare function saslprep(input: any, opts?: any): any;
export declare var CryptoJS: any;
export declare class _PDFSecurity {
    static generateFileID(info?: any): any;
    static generateRandomWordArray(bytes: any): any;
    static create(document: any, options?: any): _PDFSecurity;
    private document;
    private version;
    private dictionary;
    private keyBits;
    private encryptionKey;
    constructor(document: any, options?: any);
    _setupEncryption(options: any): void;
    _setupEncryptionV1V2V4(v: any, encDict: any, options: any): void;
    _setupEncryptionV5(encDict: any, options: any): void;
    getEncryptFn(obj: any, gen: any): (buffer: any) => any;
    end(): void;
}
