// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Configuration {
	export abstract class AbstractConfiguration<ProviderConfigType> implements IConfiguration<ProviderConfigType> {
		constructor(config: DataGrid.Types.IConfiguration) {
			for (const key in config) {
				if (config[key] !== undefined) this[key] = config[key];
			}
		}
		public abstract getProviderConfig(): DataGrid.Types.IProviderConfiguration<ProviderConfigType>;
	}
}
