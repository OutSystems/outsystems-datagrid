// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    /**
     * Defines the interface of communication for ContextMenu feature
     */
    export interface IContextMenu {
        /**
         * Getter for the contextMenu events
         */

        columnUniqueId: string;
        contextMenuEvents: Event.Feature.ContextMenuEventManager;
        /**
         * Grid's reference
         */
        grid: Grid.IGrid;
        /**
         * Defines if context menu is opening or closing
         */
        isOpening: boolean;

        /**
         * Responsable for adding menu items
         * @param menuItemId UniqueId defined on OS side
         * @param label Label presented on menu
         * @param enabled Flag used to enable the menu item
         * @param clickEvent Function executed by the menu item
         */
        addMenuItem(
            menuItemId: string,
            label: string,
            enabled: boolean,
            clickEvent: OSFramework.Callbacks.ContextMenu.OSClickEvent
        ): void;

        /**
         * Responsable for adding a line separator on context menu
         * @param menuItemId UniqueId defined on OS side
         */
        addMenuItemSeparator(menuItemId: string): void;

        /**
         * Responsable for maintain ContextMenu parameters sincronized with OutSystems
         * @param menuItemId UniqueId defined on OS side
         * @param propertyName Property that will be changed on the MenuItem
         * @param propertyValue New property value
         */
        changeProperty(
            menuItemId: string,
            propertyName: string,
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
            propertyValue: any
        ): void;

        /**
         * Responsable for removing a menu item
         * @param menuItemId
         */
        removeMenuItem(menuItemId: string): void;
    }
}
