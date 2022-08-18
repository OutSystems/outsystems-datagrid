// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Column {
    /**
     * Representation of OS Date Column
     * Responsible to instantiate the custom editor (calendar) and all the features of a Date column
     *
     * OS Date format doesn't consider GMT, and so this Column class. Multiple users in different locations of the Globe, will have the same information on Grid.
     * If GMT need to be consider, use the DateTimeColumn.
     */
    export class DateColumn extends AbstractProviderColumnEditor<
        OSFramework.DataGrid.Configuration.Column.ColumnConfig,
        OSFramework.DataGrid.Configuration.Column.EditorConfigDate
    > {
        constructor(
            grid: OSFramework.DataGrid.Grid.IGrid,
            columnID: string,
            configs: JSON,
            editorConfig: JSON
        ) {
            super(
                grid,
                columnID,
                new OSFramework.DataGrid.Configuration.Column.ColumnConfig(
                    configs
                ),
                new OSFramework.DataGrid.Configuration.Column.EditorConfigDate(
                    editorConfig,
                    false
                )
            );
            this._columnEvents =
                new OSFramework.DataGrid.Event.Column.ColumnEventsManager(this);
        }

        /** Returns all the events associated to the column */
        public get columnEvents(): OSFramework.DataGrid.Event.Column.ColumnEventsManager {
            return this._columnEvents;
        }

        public get columnType(): OSFramework.DataGrid.Enum.ColumnType {
            return OSFramework.DataGrid.Enum.ColumnType.Date;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public get editorProviderType(): any {
            return wijmo.input.InputDate;
        }

        public get providerType(): wijmo.DataType {
            return wijmo.DataType.Date;
        }

        public build(): void {
            this.config.format = this.editorConfig.format;
            super.build();
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
        public changeProperty(propertyName: string, propertyValue: any): void {
            switch (propertyName) {
                case OSFramework.DataGrid.OSStructure.ColumnProperties.Format:
                    this.editorConfig.format =
                        propertyValue || this.editorConfig.defaultFormat;
                    this.applyConfigs();
                    break;
                default:
                    super.changeProperty(propertyName, propertyValue);
            }
        }
    }
}
