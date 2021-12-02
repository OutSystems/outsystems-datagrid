// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    export interface IColumnSort
        extends Interface.IValidation,
            Interface.IProviderConfig<boolean>,
            IView {
        isGridSorted: boolean;
        clear(): void;
        sortColumn(
            columnID: string,
            ascending: OSFramework.OSStructure.Sorting
        ): void;
    }
}
