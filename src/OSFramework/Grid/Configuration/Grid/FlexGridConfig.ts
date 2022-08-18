// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Configuration.Grid {
    export class FlexGridConfig
        extends AbstractConfiguration
        implements IConfigurationGrid
    {
        public allowColumnReorder: boolean;
        public allowColumnResize: boolean;
        public allowColumnSort: boolean;
        public allowEdit: boolean;
        public allowFiltering: boolean;
        public allowGrouping: boolean;
        public allowKeyTabNavigation: boolean;
        public allowRowSelector: boolean;
        public autoGenerateColumns: boolean;
        public groupPanelId: string;
        public keyBinding: string;
        public rowHeader: Enum.RowHeader;
        public rowHeight: number;
        public rowsPerPage: number;
        public selectionMode: number;
        public serverSidePagination: boolean;
        public showAggregateValues: boolean;
        public uniqueId: string;
        public validateEdits: boolean;

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        constructor(config: any) {
            super(config);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public getProviderConfig(): any {
            // eslint-disable-next-line prefer-const
            let provider = {
                autoGenerateColumns: this.autoGenerateColumns,
                allowMerging: 'Cells', // allow mergeCells API. This option does nothing, without the proper column config.
                isReadOnly: this.allowEdit === false,
                validateEdits: this.validateEdits,
                showSelectedHeaders: 'All' // highlight row/column header
            };

            //Cleanning undefined properties
            Object.keys(provider).forEach(
                (key) => provider[key] === undefined && delete provider[key]
            );

            return provider;
        }
    }
}
