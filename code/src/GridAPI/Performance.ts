/**
 *  Namespace that contains functions responsible for interactions with the grid.
 */
// eslint-disable-next-line
namespace GridAPI.Performance {
    /**
     * Function that clears all the created marks from the current session.
     *
     * @export
     */
    export function ClearMarks(): void {
        performance.clearMarks();
    }

    /**
     * Function that clears all the created measures from the current session.
     *
     * @export
     */
    export function ClearMeasures(): void {
        performance.clearMeasures();
    }

    /**
     * Function that gets all the measures according a specified keyword.
     *
     * @param {string} keyword (optional) keyword to allow filtering the measures
     */
    export function GetAllMeasures(keyword = ''): PerformanceEntryList {
        if (keyword === '') {
            return performance.getEntriesByType('measure');
        }
        const regex = new RegExp(`${keyword}`);
        return performance
            .getEntriesByType('measure')
            .filter((rec) => regex.test(rec.name));
    }

    /**
     * Function that gets the isDebug configuration from the localStorage
     *
     * @export
     */
    export function GetDebug(): boolean {
        return JSON.parse(window.localStorage.getItem('isDebug'));
    }

    /**
     * Function that gets the duration from an already created measure.
     *
     * @export
     * @param {string} name name of the measure to get the duration from.
     */
    export function GetDuration(name: string): number {
        const measure: PerformanceEntry = performance.getEntriesByName(name)[0];
        return measure.duration;
    }

    /**
     * Function that gets a measure by setting its name and 2 already existing and different marks from the code.
     *
     * @export
     * @param {string} name name of the measure.
     * @param {string} key1 name of the first mark to create the measure.
     * @param {string} key2 name of the second mark to create the measure.
     */
    export function GetMeasure(
        name: string,
        key1: string,
        key2: string
    ): PerformanceEntry {
        performance.measure(name, key1, key2);

        return performance.getEntriesByName(name)[0];
    }

    /**
     * Function that sets the isDebug configuration as active or not according to the desired status.
     *
     * @export
     * @param {boolean} status Boolean that indicates whether the isDebug is active or not.
     */
    export function SetDebug(status: boolean): void {
        window.localStorage.setItem('isDebug', status.toString());
    }

    /**
     * Function that allows to set a mark on the code.
     *
     * @export
     * @param {string} key name of the mark.
     */
    export function SetMark(key: string): void {
        if (GetDebug()) {
            performance.mark(key);
        }
    }
}
