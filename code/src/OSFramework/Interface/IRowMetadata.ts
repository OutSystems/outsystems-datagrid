// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Grid {
    /**
     * Exposed methods to manipulate RowMetadata
     */
    export interface IRowMetadata {
        /**
         * Responsible for cleaning metadata information
         * @param dataItem object to clear metadata, if ignored the whole sourceCollection will be cleaned
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        clear(dataItem?: any): void;
        /**
         * Responsible for cleaning metadata information for a given row
         * @param row Index row reference, works only in the current page
         */
        clearByRow(row: number): void;
        /**
         * Responsible for cleaning metadata information for a given property
         * @param propertyName Metadata property to be clear
         */
        clearProperty(propertyName: string): void;
        /**
         * Responsible for cleaning metadata information for a given row and property
         * @param row Index row reference, works only in the current page
         * @param propertyName Metadata property to be clear
         */
        clearPropertyByRow(row: number, propertyName: string): void;
        /**
         * Responsible for retrieving metadata information for a given row and property
         * @param row Index row reference, works only in the current page
         * @param propertyName Metadata property
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getMetadata(row: number, propertyName: string): any;
        /**
         * Verify the presence of metadata information for a given row and property
         * @param row Index row reference, works only in the current page
         * @param property Metadata property
         */
        hasOwnProperty(row: number, property: string): boolean;
        /**
         * Stores RowMetadata information for a given row and property
         * @param row Index row reference, works only in the current page
         * @param propertyName Metadata property
         * @param propertyValue Value to be stored
         */
        setMetadata(
            row: number,
            propertyName: string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            propertyValue: any
        ): void;
    }
}
