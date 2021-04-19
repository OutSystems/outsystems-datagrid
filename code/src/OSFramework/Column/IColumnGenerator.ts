namespace OSFramework.Column {
    /**
     * Defines the signature for ColumnGerator, used when no columns were defined on OS and the ArrangeData was used
     */
    export interface IColumnGenerator {
        ColumnGenerator(
            grid: Grid.IGrid,
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
            metadata: any,
            allowEdit: boolean
        );
    }
}
