// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    export interface IValidationMark {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        invalidRows: Array<any>;
        clear(): void;
        clearByRowKeys(rowKeys: Array<string>): void;
        errorMessage(rowNumber: number, binding: string): string;
        isInvalid(rowNumber: number, binding: string): boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        isInvalidRow(row: any): boolean;
        isInvalidRowByKey(key: string): boolean;
        setCellStatus(
            rowNumber: number,
            columnID: string,
            isValid: boolean,
            errorMessage: string
        ): void;
        setCellStatusByKey(
            rowKey: string,
            columnWidgetID: string,
            isValid: boolean,
            errorMessage: string
        ): void;
        setRowStatus(rowNumber: number, isValid: boolean): void;
        validateCell(
            rowNumber: number,
            column: OSFramework.Column.IColumn,
            triggerOnCellValueChange: boolean
        ): void;
        validateRow(rowNumber: number): OSFramework.OSStructure.ReturnMessage;
        // clearByRow(row: number): void;
    }
}
