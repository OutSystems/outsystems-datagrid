// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Helper {
    /**
     * Returns the closest IGrid based on an element
     * @param elem Element used as reference or its uniqueId
     */
    export function GetClosestGrid(
        elem: Element | string
    ): OSFramework.Grid.IGrid {
        let child: Element;

        if (typeof elem === 'string' || elem instanceof String)
            child = OSFramework.Helper.GetElementByUniqueId(elem as string);
        else child = elem;

        const domGrid = child.closest(OSFramework.Helper.Constants.gridTag);

        if (domGrid) {
            const uniqueId = domGrid
                .querySelector(OSFramework.Helper.Constants.gridUniqueIdCss)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .getAttribute(OSFramework.Helper.Constants.uniqueIdAttribute);

            return GridAPI.GridManager.GetGridById(uniqueId);
        }

        return null;
    }
}
