// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Column {
    export class DateColumn extends AbstractProviderColumnEditor<
        ColumnConfig,
        EditorConfigDate
    > {
        constructor(grid: Grid.IGrid, columnID: string, configs: JSON, editorConfig: JSON) {
            super(
                grid,
                columnID,
                new ColumnConfig(configs),
                new EditorConfigDate(editorConfig)
            );
        }

        public get columnType(): ColumnType {
            return ColumnType.Date;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public get editorProviderType(): any {
            return wijmo.input.InputDate;
        }

        public get providerType(): wijmo.DataType {
            return wijmo.DataType.Date;
        }

        public build(): void {
            this.config.format = GridAPI.dateFormat;

            super.build();
        }
    }
}
