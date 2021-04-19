namespace OSFramework.Feature {
    export interface IColumnFilter
        extends Interface.IBuilder,
            Interface.IValidation,
            Interface.IProviderConfig<boolean>,
            IView {
        isGridFiltered: boolean;
        activate(columID: string): void;
        clear(columID: string): void;
        deactivate(columID: string): void;
    }
}
