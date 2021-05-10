// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    export interface ICellStyle {
        addClass(binding: string, rowNumber: number, className: string): void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        removeClass(rowNumber: number, binding: string): any;
    }
}
