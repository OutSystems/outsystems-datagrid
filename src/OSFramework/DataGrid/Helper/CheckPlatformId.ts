// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Helper {
    /**
     * Regular expression that enables to identify if the widget Id was given by the developer or not.
     */
    const RegExHasDefaultPlatformId = /^\$b\d{1,5}$/;

    export function HasPlatformDefaultId(widgetId: string): boolean {
        let isDefaultId = false;
        if (widgetId) {
            isDefaultId = widgetId.search(RegExHasDefaultPlatformId) > -1;
        }
        return isDefaultId;
    }
}
