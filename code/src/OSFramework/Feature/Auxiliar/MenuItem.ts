// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature.Auxiliar {
    /**
     * Representation of a menu item
     */
    export class MenuItem {
        /** The method executed by the MenuItem  */
        public clickEvent: Callbacks.ContextMenu.OSClickEvent;
        /** Used to indicate if a menuItem can be executed */
        public enabled: boolean;
        /** The list of sub-menu-items */
        public items: MenuItem[] = [];
        /** The label or display name on the context menu */
        public label: string;
        /** Order of the element on a menu, calculated based on DOM element position */
        public order: number;
        /** Parent Id reference */
        public parentMenuItemId: string;
        /** Menu item string identifier */
        public uniqueId: string;

        /**
         * Indicates if a MenuItem has a parent
         * @returns false for "I am a child", true for "I have no parents"
         */
        public get isRootItem(): boolean {
            return !this.parentMenuItemId;
        }

        constructor(uniqueId: string) {
            this.uniqueId = uniqueId;
        }
    }
}
