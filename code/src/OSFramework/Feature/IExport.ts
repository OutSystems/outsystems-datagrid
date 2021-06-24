// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    export interface IExport {
        exportToClipboard(withHeaders: boolean): void;
        exportToCsv(filename?: string): void;
        exportToExcel(withStyles: boolean, filename?: string): void;
    }
}
