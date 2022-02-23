// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Configuration {
    /**
     * Used to translate configurations from OS to Provider
     * Defines the basic structure for grid objects
     */
    export interface IConfigurationGrid extends IConfiguration {
        /**
         Indicates if the grid is in editable mode
        */
        allowEdit: boolean;

        /**
         Indicates the primary key field of the data
        */
        keyBinding: string;
        /**
         Indicates if the grid is in server side pagination mode
        */
        serverSidePagination: boolean;
        /**
         Indicates if the grid has row footer to show aggregate values
        */
        showAggregateValues: boolean;
        /**
         * Represents the identifier created on OS and used as reference to find objects on screen
         */
        uniqueId: string;
    }
}
