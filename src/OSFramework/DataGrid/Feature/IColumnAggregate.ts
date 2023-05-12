// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Feature {
    export interface IColumnAggregate
        extends Interface.IProviderConfig<boolean> {
        /**
         * Function to add  the aggregate cell class
         *
         * @param columnBinding {string} => The column binding of the aggregate to add the class
         * @param className {string} => Classname to be added
         */
        addClass(columnBinding: string, className: string): void;

        /**
         * Function that will set the conditional format to the aggregate rows
         *
         * @param columnID {string} => The columnID of the aggregate to add the new conditional format rules
         * @param conditionalFormat {string} => String containing the conditional format rules
         */
        setConditionalFormat(columnID: string, conditionalFormat: string);

        /**
         * Function to remove the aggregate cell class
         *
         * @param columnBinding {string} => The column binding of the aggregate to add the class
         * @param className {string} => Classname to be added
         */
        removeClass(columnBinding: string, className: string): void;
    }
}
