// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Helper {
    export function GetElementByWidgetId(widgetId: string): HTMLElement {
        const obj = document.getElementById(widgetId);

        if (obj) return obj;
        else throw new Error(`Object with name '${widgetId}' not found.`);
    }
}
