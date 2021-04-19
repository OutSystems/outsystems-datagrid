namespace OSFramework.Configuration {
    /**
     * Used to translate configurations from OS to Provider
     * Defines the basic structure for all config objects
     */
    export interface IConfiguration {
        /**
         * Method responsible for the translation of configuration from OS to Provider
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getProviderConfig(): any;
    }
}
