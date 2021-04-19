namespace OSFramework.Column {
    export interface IColumnGenerator {
        ColumnGenerator(
            grid: Grid.IGrid,
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
            metadata: any,
            allowEdit: boolean
        );
    }
}
