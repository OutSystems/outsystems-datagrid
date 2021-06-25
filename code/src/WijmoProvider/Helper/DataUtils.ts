// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Helper.DataUtils {
    export function GetTicksFromDate(
        value: Date,
        hasTimeZone: boolean
    ): string {
        let ticks;

        if (hasTimeZone) {
            ticks = value.getTime();
        } else {
            ticks = value.getTime() - value.getTimezoneOffset() * 60 * 1000;
        }

        return ticks;
    }

    /**
     * Sets the date (in ISO format) seconds as 00
     * @param value date in ISO format
     * @returns date in ISO format will seconds as 00 e.g 2021-06-25T12:23:34Z => 2021-06-25T12:23:00Z
     */
    export function ResetSeconds(value: string): string {
        return value.replace(/:(\d{2})Z/, ':00Z');
    }
}
