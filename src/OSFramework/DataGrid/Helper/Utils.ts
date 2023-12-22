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
     * Excludes the equal.
     * @param object1 Array to be split
     * @param object2 Callback to be executed on splitted arrays
     * @return
     */
    export function GetObjectDifference<T>(object1: T, object2: T): Partial<T> {
        return Object.keys(object1).reduce(
            (newObject: T, currentKey: string) => {
                if (object1[currentKey] === object2[currentKey]) {
                    return newObject;
                }
                return { ...newObject, [currentKey]: object1[currentKey] };
            },
            {}
        );
    }
}
