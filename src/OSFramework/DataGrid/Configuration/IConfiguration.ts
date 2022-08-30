// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Configuration {
    /**
     * Used to translate configurations from OS to Provider
     * Defines the basic structure for all config objects
     */
    export interface IConfiguration<ProviderConfigType> {
        /**
         * Method responsible for the translation of configuration from OS to Provider
         */
        getProviderConfig(): DataGrid.Types.IProviderConfiguration<ProviderConfigType>;
    }
}
