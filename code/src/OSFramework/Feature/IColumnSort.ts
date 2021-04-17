namespace OSFramework.Feature {
    export interface IColumnSort
        extends OSFramework.Interface.IValidation,
        OSFramework.Interface.IProviderConfig<boolean>,
            IView {
        isGridSorted: boolean;
        clear(): void;
    }
}
