// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Helper {
    /**
     * Returns the closest IGrid based on an element
     * @param elem Element used as reference or its uniqueId
     */
    export function GetClosestGrid(elem: Element | string): Grid.IGrid {
        let child: Element;

        if (typeof elem === 'string' || elem instanceof String)
            child = Helper.GetElementByUniqueId(elem as string);
        else child = elem;

        const domGrid = child.closest(Helper.Constants.gridTag);

        if (domGrid) {
            const uniqueId = domGrid
                .querySelector(Helper.Constants.gridUniqueIdCss)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .getAttribute(Helper.Constants.uniqueIdAttribute);

            return GridAPI.GridManager.GetGridById(uniqueId);
        }

        return null;
    }
}
