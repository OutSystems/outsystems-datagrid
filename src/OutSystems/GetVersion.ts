/**
 * Namespace for all public methods to access and use the OutSystemsUI components.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.Grid {
    /**
     * Function that returns the OutSystems DataGrid version value
     *
     * @export
     * @return {*}  {string}
     */
    export function GetVersion(): string {
        return OSFramework.DataGrid.Constants.OSDataGridVersion;
    }
}
