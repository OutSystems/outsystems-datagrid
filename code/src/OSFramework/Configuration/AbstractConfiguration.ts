namespace OSFramework.Configuration {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export abstract class AbstractConfiguration implements IConfiguration {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(config: any) {
            // eslint-disable-next-line prefer-const
            for (let key in config) {
                if (config[key] !== undefined) this[key] = config[key];
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        abstract getProviderConfig(): any;
    }
}
