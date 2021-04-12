namespace Features {
    export interface IColumnFilter
        extends IBuilder,
            IValidation,
            IProviderConfig<boolean>,
            IView {
        isGridFiltered: boolean;
        activate(columID: string): void;
        clear(columID: string): void;
        deactivate(columID: string): void;
    }
}