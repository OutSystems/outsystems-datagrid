// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Feature {
	export interface ICellDataSanitizer {
		disableCellDataSanitizer(): void;
		enableCellDataSanitizer(): void;
		escapeCsvInjection(cellString: string): string | null;
	}
}
