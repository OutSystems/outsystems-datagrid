// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Helper {
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

    /**
     * Receives an array, splits it into smaller arrays and executes a callback.
     * @param data Array to be split
     * @param callback Callback to be executed on splitted arrays
     * @param chunkSize Size of splitted array
     */
    export function GetMapKeyByValue<ValueT, KeyT>(
        map: Map<KeyT, ValueT>,
        value: ValueT
    ): KeyT[] {
        return [...map.keys()].filter((key) => map.get(key) === value);
    }
}
