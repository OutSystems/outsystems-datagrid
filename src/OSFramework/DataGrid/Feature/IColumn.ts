// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Feature {
	export interface IColumn {
		getColumnsOrder(): OSStructure.IColumnOrder[];
		setColumnHeader(columnID: string, header: string): void;
	}
}
