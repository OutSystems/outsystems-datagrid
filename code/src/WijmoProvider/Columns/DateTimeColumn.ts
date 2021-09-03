// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Column {
    /**
     * Representation of OS Datetime Column
     * Responsible to instantiate the custom editor (calendar and time dropdown) and all the features of a Datetime column
     *
     * This object can handle GMT configurations. Multiple users in different locations of the Globe, will have its information based GMT of local machine.
     */
    export class DateTimeColumn extends AbstractProviderColumnEditor<
        OSFramework.Configuration.Column.ColumnConfig,
        OSFramework.Configuration.Column.EditorConfigDate
    > {
        constructor(
            grid: OSFramework.Grid.IGrid,
            columnID: string,
            configs: JSON,
            editorConfig: JSON
        ) {
            super(
                grid,
                columnID,
                new OSFramework.Configuration.Column.ColumnConfig(configs),
                new OSFramework.Configuration.Column.EditorConfigDate(
                    editorConfig,
                    true
                )
            );
            this._columnEvents =
                new OSFramework.Event.Column.ColumnEventsManager(this);
        }

        /** Returns all the events associated to the column */
        public get columnEvents(): OSFramework.Event.Column.ColumnEventsManager {
            return this._columnEvents;
        }

        public get columnType(): OSFramework.Enum.ColumnType {
            return OSFramework.Enum.ColumnType.DateTime;
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
                case 'format':
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
