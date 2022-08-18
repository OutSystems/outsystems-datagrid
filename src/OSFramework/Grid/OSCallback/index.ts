/**
 * Namespace that contains the signatures of the callbacks in OutSystems code.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Callbacks {
    /**
     * This is the most generic callback signature and can be used even for internal events
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type Generic = { (...args): any };

    /**
     * This is the most generic callback signature for events existing in OutSystems code.
     * @param {string} gridID enables the OutSystems code to understand which grid triggered the event
     */
    export type OSGeneric = { (gridID: string, ...args): void };
}
