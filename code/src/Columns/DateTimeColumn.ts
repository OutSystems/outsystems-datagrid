// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Column {
    export class DateTimeColumn extends AbstractProviderColumnEditor<
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
            return ColumnType.DateTime;
        }
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public get editorProviderType(): any {
            return wijmo.input.InputDateTime;
        }
        
        public get providerType(): wijmo.DataType {
            return wijmo.DataType.Date;
        }

        public build(): void {
            this.editorConfig.timeFormat = 'HH:mm';
            this.config.format = `${GridAPI.dateFormat} ${this.editorConfig.timeFormat}`;

            super.build();
        }
    }
}
