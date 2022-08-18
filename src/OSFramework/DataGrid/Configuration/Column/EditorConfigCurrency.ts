/// <reference path="./EditorConfigNumber.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Configuration.Column {
    /**
     * Defines the configuration for Currency custom editors
     */
    export class EditorConfigCurrency extends EditorConfigNumber {
        public symbol: string;
    }
}
