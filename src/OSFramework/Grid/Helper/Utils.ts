// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Helper {
    /**
     * Receives an array, splits it into smaller arrays and executes a callback.
     * @param data Array to be split
     * @param callback Callback to be executed on splitted arrays
     * @param chunkSize Size of splitted array
     */
    export function BatchArray(
        data: Array<string | number | JSON>,
        callback: (part) => void,
        chunkSize = 10
    ): void {
        if (!Array.isArray(data)) throw new Error('An array must be passed');

        const chunk = _.chunk(data, chunkSize);

        chunk.forEach((part) => callback(part));
    }
}
