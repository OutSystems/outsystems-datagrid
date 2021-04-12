/**
 * Used to configure a feature. For example turnning on and off
 */
 interface IProviderConfig<T> {
    /**
     * Set the Feature state
     * @param value The new state state of a feature
     */
    setState(value: T): void;
}