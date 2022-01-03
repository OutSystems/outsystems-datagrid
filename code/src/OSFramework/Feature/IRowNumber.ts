// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    export interface IRowNumber {
        /**
         * Sets start row index.
         */
        setStartIndex(value: number): void;
        /**
         * Turn row number on/off
         */
        setState(value: boolean): void;
    }
}
