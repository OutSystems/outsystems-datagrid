// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Helper {
    /**
     * Responsible for parsing string fields to its correct data type
     *
     * @param data A string of the JSON data object
     * @example OS Date fields is send as strings, and we should parse it to Date, the is done for Datetime fields.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
    export function JSONParser(data: string): any {
        //regex expressions for date and datetime should be described here
        const regex = {
            datetime: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z?$/, //yyyy-MM-ddThh:mm:ssZ
            date: /^(\d{4})-(\d{2})-(\d{2})$/ //yyyy-MM-dd
        };

        // Parse dates saved as JSON-strings
        return JSON.parse(data, (key, value) => {
            if (typeof value === 'string') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let m: any;

                const match = (value: string, exp: RegExp) => {
                    m = value.match(exp);
                    return m;
                };

                if (match(value, regex.datetime)) {
                    return new Date(
                        Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6])
                    );
                } else if (match(value, regex.date)) {
                    //Considering that OS Date field do not consider GMT
                    //DataGrid also won't consider it for Date Columns
                    //PS: Datetime will consider GMT just like OS consider
                    return new Date(+m[1], +m[2] - 1, +m[3]);
                } else if (value === '') {
                    return undefined;
                }
            }
            return value;
        });
    }

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
     * Used to send data to Outsystems, converting data to OS format.
     * @param grid Grid to format data
     * @param data Data to format
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    export function ToOSFormat(
        grid: Grid.IGridWijmo,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: Array<any>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): void {
        //TODO: [RGRIDT-638] Regression 2021-02-12: Is this method the best solution
        const columns = grid
            .getColumns()
            .filter((p) => p.columnType === Column.ColumnType.Date);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const setDeepDate = (binding: Array<string>, object: any) => {
            if (object !== undefined) {
                if (binding.length > 1) {
                    setDeepDate(binding, object[binding.shift()]);
                } else {
                    const leaf = binding.shift();

                    if (object[leaf] !== undefined) {
                        const dt = object[leaf] as Date;
                        //Considering that OS Date field does not consider GMT
                        //DataGrid also won't consider it for Date Columns
                        //As the Grid needs a Date Object, before sending back to OS, we have to parse it to string
                        //The code below substract the timezone so the user have a date in format 'YYY-MM-DDT00:00:000Z'
                        //Then the substring will cut it to send only 'YYY-MM-DD' to Outsystems
                        //PS: This process is done only for Date fields, Datetime will consider GMT and send data to OS based on the ISO 8691 format
                        object[leaf] = new Date(
                            dt.getTime() - dt.getTimezoneOffset() * 60000
                        )
                            .toISOString()
                            .substr(0, 10);
                    }
                }
            }
        };

        columns.forEach((col) => {
            data.forEach((item) => {
                const binding = col.config.binding.split('.');

                setDeepDate(binding, item);
            });
        });
    }
}
