// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Helper {
    /**
     * Formats the date into an ISOString and then returns it with the format 'YYY-MM-DDT00:00:000Z'.
     * @param data Data to format
     * @returns Date specified in the ISOString format.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    export function ToOSDatetime(date: Date): string {
        return date.toISOString();
    }

    /**
     * Formats the date into an ISOString and then returns a substring to have the format 'YYY-MM-DD'.
     * @param data Data to format
     * @returns Substring of the date specified in the ISOString format.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    export function ToOSDate(date: Date): string {
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .substr(0, 10);
    }

    /**
     * Responsible for stringifying Maps on JSON.stringify
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export function JsonReplacer(_: string, value: unknown): any {
        if (value instanceof Map) {
            return {
                dataType: 'Map',
                value: Array.from(value.entries())
            };
        } else {
            return value;
        }
    }

    /**
     * Responsible for parsing Maps on JSON.parse
     */
    // eslint-disable-next-line
    export function JsonReviver(_: string, value: any): any {
        if (typeof value === 'object' && value !== null) {
            if (value.dataType === 'Map') {
                return new Map(value.value);
            }
        }
        return value;
    }
}
