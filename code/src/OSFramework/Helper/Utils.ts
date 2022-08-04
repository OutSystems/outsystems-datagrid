// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Helper {
    function getChunks(quantity, size) {
        const splitQuantity = Math.round(quantity / size);
        const remainder = quantity % size;
        let result = [];
        for (let index = 0; index < size; index++) {
            if (index === 0 && remainder > 0) {
                result = [...result, splitQuantity + remainder];
            } else {
                result = [...result, splitQuantity];
            }
        }

        return result;
    }

    export function BatchArray(
        data: Array<string | number | JSON>,
        callback: (part) => void,
        chunkSize = 10
    ): void {
        if (!Array.isArray(data)) throw new Error('An array must be passed');

        const chunk = _.chunk(data, chunkSize);

        chunk.forEach((part) => callback(part));
    }

    export function Batch(quantity, callback, chunkSize = 10): void {
        const chunks = getChunks(quantity, chunkSize);

        chunks.forEach((chunk) => {
            callback(chunk);
        });
    }
}
