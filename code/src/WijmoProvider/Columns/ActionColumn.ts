// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Column {
    export class ActionColumn extends AbstractProviderColumn<ColumnConfig> {
        constructor(grid: OSFramework.Grid.IGrid, columnID: string, configs: JSON) {
            super(grid, columnID, new ColumnConfig(configs));
            this._columnEvents = new OSFramework.Event.ColumnEventsManager(this);
        }

        /** Returns all the events associated to the column */
        public get columnEvents(): OSFramework.Event.ColumnEventsManager {
            return this._columnEvents;
        }

        public get columnType(): ColumnType {
            return ColumnType.Action;
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
                    this._columnEvents.trigger(
                        OSFramework.Event.ColumnEventType.ActionClick,
                        JSON.stringify(
                            //TODO: [RGRIDT-637] refactor this code.
                            this.grid.isSingleEntity
                                ? Helper.Flatten(ctx.item)
                                : ctx.item
                        )
                    );
                }
            });

            return config;
        }
    }
}
