namespace Features {
    export interface IColumnSort
        extends IValidation,
            IProviderConfig<boolean>,
            IView {
        isGridSorted: boolean;
        clear(): void;
    }
}
