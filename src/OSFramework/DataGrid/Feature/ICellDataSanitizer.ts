// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Feature {
	export interface ICellDataSanitizer {
		escapeCsvInjection(cellString: string): string | null;
	}
}
