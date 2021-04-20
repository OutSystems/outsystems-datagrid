namespace OSFramework.Column {
    /**
     * Defines the signature for ColumnGerator, used when no columns were defined on OS and the ArrangeData was used
     */
    export interface IColumnGenerator {
        generate(
            grid: Grid.IGrid,
            metadata: any,
            allowEdit: boolean
        );
    }
}
