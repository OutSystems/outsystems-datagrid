// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Helper {
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
