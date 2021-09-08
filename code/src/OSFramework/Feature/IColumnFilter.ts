namespace OSFramework.Feature {
    export interface IColumnFilter
        extends Interface.IBuilder,
            Interface.IValidation,
            Interface.IProviderConfig<boolean>,
            IView {
        isGridFiltered: boolean;
        activate(columnID: string): void;
        byValue(columnId: string, values: Array<string>): void;
        changeFilterType(
            columnID: string,
            filterType: wijmo.grid.filter.FilterType
        ): void;
        clear(columnID: string): void;
        deactivate(columnID: string): void;
    }
}
