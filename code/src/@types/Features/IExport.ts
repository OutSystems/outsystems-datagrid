// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Features {
    export interface IExport {
        exportToClipboard(withHeaders: boolean): void;
        exportToCsv(): void;
        exportToExcel(withStyles: boolean): void;
    }
}
