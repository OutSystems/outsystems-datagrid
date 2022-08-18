// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Interface {
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
         * @param {*} dataItem
         * @param {string} propertyName
         * @memberof IRowMetadata
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        clearPropertyByRow(dataItem: any, propertyName: string): void;
        /**
         * Responsible for cleaning metadata information for a given row key and property
         * @param row Key row reference
         * @param propertyName Metadata property to be clear
         */
        clearPropertyByRowKey(key: string, propertyName: string): void;
        /**
         * Responsible for cleaning metadata information for a given row number and property
         * @param key  Index row reference, works only in the current page
         * @param propertyName Metadata property to be clear
         */
        clearPropertyByRowNumber(row: number, propertyName: string): void;
        /**
         * Responsible for retrieving metadata information for a given row key and property
         * @param key Key row reference
         * @param propertyName Metadata property
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getMetadataByRowKey(key: string, propertyName: string): any;
        /**
         * Responsible for retrieving metadata information for a given row number and property
         * @param rowNumber Index row reference, works only in the current page
         * @param propertyName Metadata property
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getMetadataByRowNumber(rowNumber: number, propertyName: string): any;
        /**
         * Responsible for retrieving metadata information for a given row and property
         * @param row Index row reference, works only in the current page
         * @param propertyName Metadata property
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getMetadataInRow(row: any, propertyName: string): any;

        getRowIndexByKey(rowKey: string): number;
        /**
         * Verify the presence of metadata information for a given row and property
         * @param {*} row
         * @param {string} property
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        hasOwnPropertyByRow(row: any, property: string): boolean;
        /**
         * Verify the presence of metadata information for a given row key and property
         * @param rowKey Key row reference
         * @param property Metadata property
         */
        hasOwnPropertyByRowKey(rowKey: string, property: string): boolean;
        /**
         * Verify the presence of metadata information for a given row number and property
         * @param rowNumber Index row reference, works only in the current page
         * @param property Metadata property
         */
        hasOwnPropertyByRowNumber(rowNumber: number, property: string): boolean;
        /**
         * Stores RowMetadata information for a given row and property
         * @param {*} row
         * @param {string} propertyName
         * @param {*} propertyValue
         * @memberof IRowMetadata
         */
        setMetadataByRow(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            row: any,
            propertyName: string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            propertyValue: any
        ): void;
        /**
         * Stores RowMetadata information for a given row number and property
         * @param rowKey Key row reference
         * @param propertyName Metadata property
         * @param propertyValue Value to be stored
         */
        setMetadataByRowKey(
            rowKey: string,
            propertyName: string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            propertyValue: any
        ): void;
        /**
         * Stores RowMetadata information for a given row number and property
         * @param rowNumber Index row reference, works only in the current page
         * @param propertyName Metadata property
         * @param propertyValue Value to be stored
         */
        setMetadataByRowNumber(
            rowNumber: number,
            propertyName: string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            propertyValue: any
        ): void;
    }
}
