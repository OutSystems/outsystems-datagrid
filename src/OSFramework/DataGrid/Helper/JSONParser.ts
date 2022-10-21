// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Helper {
    /**
     * Formats the date into an ISOString and then returns it with the format 'YYY-MM-DDT00:00:000Z'.
     * @param date Date to format
     * @returns Date specified in the ISOString format.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    export function ToOSDatetime(date: Date): string {
        if( typeof(date) === 'string'){
            date = new Date(date)
        }
        return date.toISOString();
    }

    /**
     * Formats the date into an ISOString and then returns a substring to have the format 'YYY-MM-DD'.
     * @param data Data to format
     * @returns Substring of the date specified in the ISOString format.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    export function ToOSDate(date: Date): string {
        if( typeof(date) === 'string'){
            date = new Date(date)
        }
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .substr(0, 10);
    }
}
