// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Configuration {
    export abstract class AbstractConfiguration implements IConfiguration {
        constructor(config: DataGrid.Types.IConfiguration) {
            for (const key in config) {
                if (config[key] !== undefined) this[key] = config[key];
            }
        }
        abstract getProviderConfig(): DataGrid.Types.IProviderConfiguration;
    }
}
