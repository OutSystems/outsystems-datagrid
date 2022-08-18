// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Helper {
    export function GenerateHashCode(str: string): number {
        let hash = 0;
        let i = 0;
        let chr;

        for (; i < str.length; i++) {
            chr = str.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
}
