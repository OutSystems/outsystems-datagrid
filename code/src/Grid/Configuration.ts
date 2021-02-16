// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Grid {
    export enum OS_Config_Grid {
        allowColumnSort,
        allowColumnReorder,
        allowColumnResize,
        allowEdit,
        allowFiltering,
        allowGrouping,
        allowKeyTabNavigation,
        autoGenerateColumns,
        readOnly,
        rowHeight,
        rowsPerPage,
        selectionMode,
        validateEdits
    }

    export class FlexGridConfig
        extends AbstractConfiguration
        implements IConfigurationGrid {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public itemsSource: any;
        public rowHeight: number;
        public rowsPerPage: number;
        public selectionMode: number;
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
                isReadOnly: this.allowEdit === false,
                validateEdits: this.validateEdits,
                itemsSource: this.itemsSource,
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
