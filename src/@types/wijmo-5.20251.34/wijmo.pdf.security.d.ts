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
declare module wijmo.pdf.security {
    function Buffer(arg: any, encodingOrOffset?: any, length?: any): void;
}
declare module wijmo.pdf.security {
    function inRange(value: any, rangeGroup: any): boolean;
}
declare module wijmo.pdf.security {
    const isUnassignedCodePoint: (character: any) => boolean;
    const isCommonlyMappedToNothing: (character: any) => boolean;
    const isNonASCIISpaceCharacter: (character: any) => boolean;
    const isProhibitedCharacter: (character: any) => boolean;
    const isBidirectionalRAL: (character: any) => boolean;
    const isBidirectionalL: (character: any) => boolean;
}
declare module wijmo.pdf.security {
    function saslprep(input: any, opts?: any): any;
}
declare module wijmo.pdf.security {
    var CryptoJS: any;
}
declare module wijmo.pdf.security {
    class _PDFSecurity {
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
}
declare module wijmo.pdf.security {
}
