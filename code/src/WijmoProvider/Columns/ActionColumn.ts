// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Column {
    export class ActionColumn extends AbstractProviderColumn<OSFramework.Configuration.Column.ColumnConfig> {
        constructor(
            grid: OSFramework.Grid.IGrid,
            columnID: string,
            configs: JSON
        ) {
            super(
                grid,
                columnID,
                new OSFramework.Configuration.Column.ColumnConfig(configs)
            );
            this._columnEvents =
                new OSFramework.Event.Column.ColumnEventsManager(this);
        }

        /** Returns all the events associated to the column */
        public get columnEvents(): OSFramework.Event.Column.ColumnEventsManager {
            return this._columnEvents;
        }

        public get columnType(): OSFramework.Enum.ColumnType {
            return OSFramework.Enum.ColumnType.Action;
        }

        public get providerType(): wijmo.DataType {
            return wijmo.DataType.String;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public getProviderConfig(): any {
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
                        OSFramework.Event.Column.ColumnEventType.ActionClick,
                        JSON.stringify(
                            this.grid.isSingleEntity
                                ? OSFramework.Helper.Flatten(clonedDataItem)
                                : clonedDataItem
                        )
                    );
                }
            });

            return config;
        }
    }
}
