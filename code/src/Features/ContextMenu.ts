// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Features {
    /**
     * Representation of a menu item
     */
    class MenuItem {
        /** The method executed by the MenuItem  */
        public clickEvent: GridAPI.OSCallbacks.ContextMenu.OSClickEvent;
        /** Used to indicate if a menuItem can be executed */
        public isActive: boolean;
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

        constructor(uniqueId) {
            this.uniqueId = uniqueId;
        }
    }

    /**
     * Defines the interface of communication for ContextMenu feature
     */
    export interface IContextMenu {
        contextMenuEvents: ExternalEvents.ContextMenuEventManager;

        /**
         * Responsable for adding menu items
         * @param menuItemId UniqueId defined on OS side
         * @param label Label presented on menu 
         * @param isActive Flag used to enable the menu item
         * @param clickEvent Function executed by the menu item
         */
        addMenuItem(menuItemId: string,
            label: string,
            isActive: boolean,
            clickEvent: GridAPI.OSCallbacks.ContextMenu.OSClickEvent);

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
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        changeProperty(menuItemId: string, propertyName: string, propertyValue: any): void;

        /**
         * Responsable for removing a menu item
         * @param menuItemId 
         */
        removeMenuItem(menuItemId: string): void;

    }

    /**
     * Representation of the ContextMenu feature
     */
    export class ContextMenu implements IBuilder, IDisposable, IContextMenu {
        private _contextMenuEvents: ExternalEvents.ContextMenuEventManager;
        private _grid: Grid.IGridWijmo;
        private _isOpening: boolean;
        /** Map a UniqueId to its MenuItem */
        private _menuItems: Map<string, MenuItem>;
        /** Our provider ContextMenu instance */
        private _provider: wijmo.input.Menu;
        /** Only the root MenuItems to be shown on Input.Menu */
        private _rootMenuItems: MenuItem[];

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
            this._menuItems = new Map();
            this._rootMenuItems = [];
            this._contextMenuEvents = new ExternalEvents.ContextMenuEventManager(this);
        }

        public get contextMenuEvents(): ExternalEvents.ContextMenuEventManager {
            return this._contextMenuEvents;
        }

        public get isOpening(): boolean {
            return this._isOpening;
        }

        /**
         * Adds a MenuItem to the the Mapper and ContextMenu.itemsSource
         * @param menuItem Instance of the new MenuItem just before insertion
         */
        private _addMenuItem(menuItem: MenuItem) {
            //If already inserted to the Map return error message
            if (this._menuItems.has(menuItem.uniqueId)) {
                console.log('_addMenuItem - MenuItem already added to the list');
            }

            //Add to the Map
            this._menuItems.set(menuItem.uniqueId, menuItem);

            //Find its parent MenuItem
            menuItem.parentMenuItemId = this._getMenuParentId(menuItem.uniqueId);

            //Define menu item's order
            menuItem.order = this._defineMenuItemOrder(menuItem.uniqueId);

            //If this menuItem is rootItem, means has no parent menu item
            if (menuItem.isRootItem) {
                this._rootMenuItems.push(menuItem);
            }
            //Otherwise find its parent and save it as a child
            else {
                this._menuItems.get(menuItem.parentMenuItemId).items.push(menuItem);
            }

            //Sort menu by order - Usefull when the developer inserts a IF statement hiding/showing elements
            this._sortMenuItems(this._rootMenuItems);
        }

        /**
         * Responsable for the creation of the context menu object
         */
        private _buildProvider(): void {
            const itemsSource = new wijmo.collections.CollectionView(this._rootMenuItems);

            this._provider = new wijmo.input.Menu(
                document.createElement('div'),
                {
                    owner: this._grid.provider.hostElement,
                    displayMemberPath: 'label',        // Property of MenuItem - display label
                    subItemsPath: 'items',              // Property of MenuItem - sub-menu-items
                    commandParameterPath: 'uniqueId',   // Property of MenuItem - key to the item (Used as parameter to execute WJ commands)
                    dropDownCssClass: 'ctx-menu',
                    openOnHover: true,
                    closeOnLeave: true,
                    itemsSource,
                    command: {
                        canExecuteCommand: this._canRaiseClickEvent.bind(this),
                        executeCommand: this._raiseClickEvent.bind(this)
                    },
                    isDroppedDownChanging: (e) => {
                        // The event is raised when the context menu opens or closes. 
                        // It is easier to understand if it will open instead of analysing if the menu is dropped down.
                        this._isOpening = !e.isDroppedDown;
                        this._contextMenuEvents.trigger(
                            ExternalEvents.ContextMenuEventType.Toggle
                        );
                    }
                }
            );
        }

        /**
         * Defines wheter the menuItem is enabled or not
         * @param menuItemId Menu item's identificator
         */
        private _canRaiseClickEvent(menuItemId: string): boolean {
            const menuItem = this._menuItems.get(menuItemId);
            return menuItem && menuItem.isActive;
        }

        /**
         * Define MenuItem position on the menu
         * @param menuItemId UniqueId for the MenuItem
         */
        private _defineMenuItemOrder(menuItemId: string): number {
            let itemPosition = -1;
            let allItemElems: HTMLCollection;
            const menuItemElem = Helper.GetElementByUniqueId(menuItemId);
            const menuItem = this._menuItems.get(menuItemId);

            //When its a root element
            if (menuItem.isRootItem) {
                //Find the placeholder where the menu items are dragged into
                allItemElems = menuItemElem.closest(Helper.Constants.contextMenuCss).children;
            }
            //When its a sub-menu-item
            else {
                //Find its parent placeholder
                allItemElems = menuItemElem.closest(Helper.Constants.contextSubMenuCss).children;
            }

            //Iterate throught elements searching for the menuItem block
            for (let i = 0; i < allItemElems.length; i++) {
                if (allItemElems[i].contains(menuItemElem)) {
                    itemPosition = i;
                    break;
                }
            }

            return itemPosition;
        }

        /**
         * Filter which items to show
         * @param e Mouse event
         * @param item Menu item to validate
         * 
         * @returns A boolean indicating if the current item should be shown
         */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private _filterMenuItem(e: MouseEvent, item: MenuItem): boolean {
            // Get info from clicked area
            const ht = this._grid.provider.hitTest(e);
            //How to filter menu options, based on the clicked area =D
            //Can be usefull in the future

            //Validate clicked area
            switch (ht.cellType) {
                case wijmo.grid.CellType.Cell:          //Over a Cell
                case wijmo.grid.CellType.None:          //Not known area, used for empty grids
                    return true;
                case wijmo.grid.CellType.ColumnHeader:  //Over a ColumnHeader
                case wijmo.grid.CellType.RowHeader:     //Over a RowHeader
                default:
                    return false;
            }
        }

        /**
         * Returns the parent menu item's Id
         * @param menuItemId Menu items id
         */
        private _getMenuParentId(menuItemId: string): string {
            let parentID: string = undefined;
            const menuItem = Helper.GetElementByUniqueId(menuItemId);
            const menuParentSubMenu = menuItem.closest(Helper.Constants.contextSubMenuCss);

            if (menuParentSubMenu && menuParentSubMenu.parentNode.querySelector(Helper.Constants.contextMenuItemUniqueIdCss)) {
                parentID = menuParentSubMenu
                    .parentNode
                    .querySelector(Helper.Constants.contextMenuItemUniqueIdCss)
                    .getAttribute(Helper.Constants.uniqueIdAttribute);
            }

            return parentID;
        }

        /**
         * Used to open the context menu based on the position on screen
         * @param e 
         */
        private _handleRightClick(e: MouseEvent): void {
            // select the cell/column that was clicked
            const ht = this._grid.provider.hitTest(e);
            // Verify it action occurred over an already selected range
            const isOverSelection = this._grid.features.selection.contains(ht.range);

            //If not performed over a selection, reset the selection
            if (!isOverSelection) {
                this._grid.features.selection.clear();
                this._grid.provider.select(ht.range);
            }

            //Filtering menuItem based on the clicked area =D
            this._provider.collectionView.filter = this._filterMenuItem.bind(this, e);

            //Control the menu opening
            if (this._provider.collectionView.items.length) {
                //Show the context menu
                this._provider.show(e);

                // cancel the browser's default menu
                e.preventDefault();
            }
        }

        /**
         * Responsable to execute a menu item's action
         * @param menuItemId Menu item's identificator
         */
        private _raiseClickEvent(menuItemId: string): void {
            const menuItem = this._menuItems.get(menuItemId);
            if (menuItem && menuItem.clickEvent) {
                //RUG: the platform requires to receive the input parameters inline
                menuItem.clickEvent(
                    this._grid.uniqueId,
                    this._grid
                );
            }
        }

        /**
         * Sort menu by its order
         * @param items list of menu items
         */
        private _sortMenuItems(items: MenuItem[]) {
            items.sort((a, b): number => {
                this._sortMenuItems(a.items);
                return a.order - b.order;
            });
        }

        public get grid(): Grid.IGrid {
            return this._grid;
        }

        public addMenuItem(
            menuItemId: string,
            label: string,
            isActive: boolean,
            executeCommand: GridAPI.OSCallbacks.ContextMenu.OSClickEvent
        ): void {
            const menuItem = new MenuItem(menuItemId);

            menuItem.label = label;
            menuItem.isActive = isActive;
            menuItem.clickEvent = executeCommand;

            this._addMenuItem(menuItem);
        }

        public addMenuItemSeparator(menuItemId: string): void {
            const menuItem = new MenuItem(menuItemId);
            menuItem.label = '-'; // this header is known by the provider, and is used to create the line separator

            this._addMenuItem(menuItem);
        }

        public build(): void {
            this._buildProvider();

            const host = this._grid.provider.hostElement;
            host.addEventListener(
                'contextmenu',
                this._handleRightClick.bind(this),
                true
            );
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public changeProperty(menuItemId: string, propertyName: string, propertyValue: any): void {
            const menuItem = this._menuItems.get(menuItemId);
            if (menuItem) {
                if (menuItem.hasOwnProperty(propertyName)) {
                    menuItem[propertyName] = propertyValue;
                }
                else {
                    console.error(`MenuItem "${menuItem.label}" has no property "${propertyName}" defined.`);
                }
            }
            else {
                console.error(`MenuItem "${menuItemId}" not registered.`);
            }

            this._provider.itemsSource.refresh();
        }

        public dispose(): void {
            this._grid.provider.hostElement.removeEventListener(
                'contextmenu',
                this._handleRightClick.bind(this),
                true
            );
            this._provider.dispose();
            this._provider = undefined;
            this._menuItems = undefined;
        }

        public removeMenuItem(menuItemId: string): void {
            if (!this._menuItems.has(menuItemId)) {
                console.log(`removeMenuItem - Menu item "${menuItemId}" not available on grid "${this._grid.uniqueId}"`);
            }

            const menuItem = this._menuItems.get(menuItemId);

            // if isRootItem delete from rootMenuItems
            if (menuItem.isRootItem) {
                const idx = this._rootMenuItems.indexOf(menuItem);
                idx > -1 && this._rootMenuItems.splice(idx, 1);
            }
            // Kill this child from its parent
            else {
                const parentGroup = this._menuItems.get(menuItem.parentMenuItemId);
                const idx = parentGroup.items.indexOf(menuItem);
                idx > -1 && parentGroup.items.splice(idx, 1);
            }

            //Remove it from the Map
            this._menuItems.delete(menuItemId);
        }
    }
}
