// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Column {
    /**
     * Representation of OS Date Column
     * Responsible to instantiate the custom editor (calendar) and all the features of a Date column
     *
     * OS Date format doesn't consider GMT, and so this Column class. Multiple users in different locations of the Globe, will have the same information on Grid.
     * If GMT need to be consider, use the DateTimeColumn.
     */
    export class DateColumn extends AbstractProviderColumnEditor<
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
            //Setting date format
            this.config.format = GridAPI.dateFormat;

            super.build();
        }
    }
}
