// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    export interface IValidationMark {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        invalidRows: Array<any>;
        clear(): void;
        errorMessage(rowNumber: number, binding: string): string;
        isInvalidByRow(row: any): boolean;
        isInvalidByRowNumber(rowNumber: number, binding: string): boolean;
        setStatus(
            rowNumber: number,
            columnID: string,
            isValid: boolean,
            errorMessage: string
        ): void;
        validateRow(rowNumber: number): void;
        // clearByRow(row: number): void;
    }
}
