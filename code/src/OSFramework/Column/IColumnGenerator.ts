// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Column {
    /**
     * Defines the signature for ColumnGerator, used when no columns were defined on OS and the ArrangeData was used
     */
    export interface IColumnGenerator {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        generate(grid: Grid.IGrid, metadata: any, allowEdit: boolean);
    }
}
