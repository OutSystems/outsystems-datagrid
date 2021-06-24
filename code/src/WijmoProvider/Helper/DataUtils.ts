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

    export function TrimSeconds(value: string): string {
        return value.replace(/:(\d{2})Z/, ':00Z');
    }
}
