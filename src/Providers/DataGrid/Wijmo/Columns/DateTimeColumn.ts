// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Column {
    /**
     * Representation of OS Datetime Column
     * Responsible to instantiate the custom editor (calendar and time dropdown) and all the features of a Datetime column
     *
     * This object can handle GMT configurations. Multiple users in different locations of the Globe, will have its information based GMT of local machine.
     */
    export class DateTimeColumn extends AbstractProviderColumnEditor<
        OSFramework.DataGrid.Configuration.Column.ColumnConfig,
        OSFramework.DataGrid.Configuration.Column.EditorConfigDate
    > {
        constructor(
            grid: OSFramework.DataGrid.Grid.IGrid,
            columnID: string,
            configs: OSFramework.DataGrid.Types.IColumnConfigs,
            editorConfig: OSFramework.DataGrid.Types.IDateColumnExtraConfigs
        ) {
            super(
                grid,
                columnID,
                new OSFramework.DataGrid.Configuration.Column.ColumnConfig(
                    configs
                ),
                new OSFramework.DataGrid.Configuration.Column.EditorConfigDate(
                    editorConfig,
                    true
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
            return OSFramework.DataGrid.Enum.ColumnType.DateTime;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public get editorProviderType(): any {
            return wijmo.input.InputDateTime;
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
