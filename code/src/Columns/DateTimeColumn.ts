// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Column {
    /**
     * Representation of OS Datetime Column
     * Responsable to instantiate the custom editor (calendar and time dropdown) and all the features of a Datetime column
     * 
     * This object can handle GMT configurations. Multiple users in different locations of the Globe, will have its information based GMT of local machine.
     */
    export class DateTimeColumn extends AbstractProviderColumnEditor<
        ColumnConfig,
        EditorConfigDate
    > {
        constructor(
            grid: Grid.IGrid,
            columnID: string,
            configs: JSON,
            editorConfig: JSON
        ) {
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
