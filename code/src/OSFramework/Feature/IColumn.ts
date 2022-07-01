// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    export interface IColumn {
        getColumnsOrder(): OSStructure.IColumnOrder[];
        setColumnHeader(columnID: string, header: string): void;
    }
}
