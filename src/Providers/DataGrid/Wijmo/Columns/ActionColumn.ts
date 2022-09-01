// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Column {
    export class ActionColumn extends AbstractProviderColumn<OSFramework.DataGrid.Configuration.Column.ColumnConfig> {
        constructor(
            grid: OSFramework.DataGrid.Grid.IGrid,
            columnID: string,
            configs: OSFramework.DataGrid.Types.IColumnConfigs
        ) {
            super(
                grid,
                columnID,
                new OSFramework.DataGrid.Configuration.Column.ColumnConfig(
                    configs
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
            return OSFramework.DataGrid.Enum.ColumnType.Action;
        }

        public get providerType(): wijmo.DataType {
            return wijmo.DataType.String;
        }

        public getProviderConfig(): OSFramework.DataGrid.Types.IColumnProviderConfigs {
            const config = super.getProviderConfig();

            //Create cellTemplates only if a callback were provided
            config.cellTemplate = wijmo.grid.cellmaker.CellMaker.makeLink({
                text:
                    //When the binding parameter starts with $, it means that developer wants the link to have a fixed text in everyline of this column.
                    //The $ symbol is added by the OutSystems code in the block ActionColumn.
                    this.config.binding.charAt(0) === '$'
                        ? this.config.binding.substr(1)
                        : undefined,
                click: (e, ctx) => {
                    //Let's clone the line, since we will be removing the metadata info from it.
                    const clonedDataItem = _.cloneDeep(ctx.item);
                    this.grid.rowMetadata.clear(clonedDataItem);

                    this._columnEvents.trigger(
                        OSFramework.DataGrid.Event.Column.ColumnEventType
                            .ActionClick,
                        JSON.stringify(
                            this.grid.isSingleEntity
                                ? OSFramework.DataGrid.Helper.Flatten(
                                      clonedDataItem
                                  )
                                : clonedDataItem
                        )
                    );
                }
            });

            return config;
        }
    }
}
