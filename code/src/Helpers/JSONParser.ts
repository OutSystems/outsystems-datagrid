// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Helper {
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

                //helper to if statement, to make things easier to read 
                const match = (value: string, exp: RegExp) => {
                    m = value.match(exp);
                    return m;
                };

                if (match(value, regex.datetime)) {
                    return new Date(
                        Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6])
                    );
                } else if (match(value, regex.date)) {
                    return new Date(+m[1], +m[2] - 1, +m[3]);
                } else if (value === '') {
                    return undefined;
                }
            }
            return value;
        });
    }

    /**
     * In-Place converter. Responsable for converting data to OS format.
     * @param grid Grid to format data
     * @param data Data to format
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    export function ToOSFormat(
        grid: Grid.IGridWijmo,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: Array<any>
    ): void {
        //Filter columns typed as Date
        const columns = _.toArray(grid.columns)
            .map((pair) => pair[1] as Column.IColumn)
            .filter((p) => p.columnType === Column.ColumnType.Date);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const setDeepDate = (binding: Array<string>, object: any) => {
            if (object !== undefined) {
                //We look for the leaf property to update information
                if (binding.length > 1) {
                    setDeepDate(binding, object[binding.shift()]);
                } else {
                    //Get the last value from binding
                    const leaf = binding.shift();

                    //Change its property
                    if (object[leaf] !== undefined) {
                        //From '2020-02-24T00:00:000Z' to '2020-02-24'
                        object[leaf] = (object[leaf] as Date)
                            .toISOString()
                            .substr(0, 10);
                    }
                }
            }
        };

        //For each date column call setDeepDate
        columns.forEach((col) => {
            data.forEach((item) => {
                //Transform string in array => Sample_Products.Date > ['Sample_Products', 'Date']
                const binding = col.config.binding.split('.');

                setDeepDate(binding, item);
            });
        });
    }
}
