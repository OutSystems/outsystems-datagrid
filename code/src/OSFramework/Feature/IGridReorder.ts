// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    export interface IGridReorder extends Interface.IProviderConfig<boolean> {
        toggleRowDragging(allowRowDragging: boolean): void;
    }
}
