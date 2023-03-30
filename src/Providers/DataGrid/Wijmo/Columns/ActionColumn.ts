// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Column {
    export class ActionColumn extends AbstractProviderColumn<OSFramework.DataGrid.Configuration.Column.ColumnConfigAction> {
        constructor(
            grid: OSFramework.DataGrid.Grid.IGrid,
            columnID: string,
            configs: OSFramework.DataGrid.Types.IColumnConfigs,
            extraConfig: OSFramework.DataGrid.Types.IActionColumnExtraConfigs
        ) {
            super(
                grid,
                columnID,
                new OSFramework.DataGrid.Configuration.Column.ColumnConfigAction(
                    configs,
                    extraConfig
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

            // Get the cellTemplate based on the actionColumnType
            config.cellTemplate =
                Helper.ActionColumnFactory.MakeActionColumnCellTemplate(
                    this.config.actionColumnType,
                    config.binding,
                    this.handleActionEvent.bind(this)
                );

            return config;
        }

        public handleActionEvent(ctx): void {
            //Let's clone the line, since we will be removing the metadata info from it.
            const clonedDataItem = _.cloneDeep(ctx.item);
            this.grid.rowMetadata.clear(clonedDataItem);

            this._columnEvents.trigger(
                OSFramework.DataGrid.Event.Column.ColumnEventType.ActionClick,
                JSON.stringify(
                    this.grid.isSingleEntity
                        ? OSFramework.DataGrid.Helper.Flatten(clonedDataItem)
                        : clonedDataItem
                )
            );
        }
    }
}
