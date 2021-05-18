/**
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.Auxiliary {
    /**
     * Receives a string and generates the hashcode of it.
     * @param str - string, typically the data to be showed in the grid.
     * @returns hashcode to the str
     */
    export function GetHashCode(str: string): number {
        return OSFramework.Helper.GenerateHashCode(str);
    }
}
