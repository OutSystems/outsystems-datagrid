/**
 * Namespace that contains the callbacks signatures to be passed in the column events.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Callbacks.OSColumn {
    /**
     * This is the callback signature for events triggerend by column action.
     * @param {string} gridID which grid triggered the event
     * @param {string} columnID which column triggered the event
     * @param {string} line values present in the line
     */
    export type ClickEvent = {
        (gridID: string, columnID: string, line: string): void;
    };
}
