// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    /**
     * Representation of the ContextMenu feature
     */
    export class ContextMenu
        implements
            OSFramework.Interface.IBuilder,
            OSFramework.Interface.IDisposable,
            OSFramework.Feature.IContextMenu
    {
        /** Events from the Context Menu  */
        private _columnUniqueId: string;
        private _contextMenuEvents: OSFramework.Event.Feature.ContextMenuEventManager;
        private _grid: Grid.IGridWijmo;
        private _isOpening: boolean;
        /** Map a UniqueId to its MenuItem */
        private _menuItems: Map<string, OSFramework.Feature.Auxiliar.MenuItem>;
        /** Our provider ContextMenu instance */
        private _provider: wijmo.input.Menu;
        /** Only the root MenuItems to be shown on Input.Menu */
        private _rootMenuItems: OSFramework.Feature.Auxiliar.MenuItem[];

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
            this._menuItems = new Map();
            this._rootMenuItems = [];
            this._contextMenuEvents =
                new OSFramework.Event.Feature.ContextMenuEventManager(this);
        }

        /**
         * Adds a MenuItem to the the Mapper and ContextMenu.itemsSource
         * @param menuItem Instance of the new MenuItem just before insertion
         */
        private _addMenuItem(menuItem: OSFramework.Feature.Auxiliar.MenuItem) {
            //If already inserted to the Map return error message
            if (this._menuItems.has(menuItem.uniqueId)) {
                console.log(
                    '_addMenuItem - MenuItem already added to the list'
                );
            }

            //Add to the Map
            this._menuItems.set(menuItem.uniqueId, menuItem);

            //Find its parent MenuItem
            menuItem.parentMenuItemId = this._getMenuParentId(
                menuItem.uniqueId
            );

            //Define menu item's order
            menuItem.order = this._defineMenuItemOrder(menuItem.uniqueId);

            //If this menuItem is rootItem, means has no parent menu item
            if (menuItem.isRootItem) {
                this._rootMenuItems.push(menuItem);
            }
            //Otherwise find its parent and save it as a child
            else {
                this._menuItems
                    .get(menuItem.parentMenuItemId)
                    .items.push(menuItem);
            }

            //Sort menu by order - Usefull when the developer inserts a IF statement hiding/showing elements
            this._sortMenuItems(this._rootMenuItems);
        }

        /**
         * Responsable for the creation of the context menu object
         */
        private _buildProvider(): void {
            const itemsSource = new wijmo.collections.CollectionView(
                this._rootMenuItems
            );

            this._provider = new wijmo.input.Menu(
                document.createElement('div'),
                {
                    owner: this._grid.provider.hostElement,
                    displayMemberPath: 'label', // Property of MenuItem - display label
                    subItemsPath: 'items', // Property of MenuItem - sub-menu-items
                    commandParameterPath: 'uniqueId', // Property of MenuItem - key to the item (Used as parameter to execute WJ commands)
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
                            OSFramework.Event.Feature.ContextMenuEventType
                                .Toggle
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
            return menuItem && menuItem.enabled;
        }

        /**
         * Define MenuItem position on the menu
         * @param menuItemId UniqueId for the MenuItem
         */
        private _defineMenuItemOrder(menuItemId: string): number {
            let itemPosition = -1;
            let allItemElems: HTMLCollection;
            const menuItemElem =
                OSFramework.Helper.GetElementByUniqueId(menuItemId);
            const menuItem = this._menuItems.get(menuItemId);

            //When its a root element
            if (menuItem.isRootItem) {
                //Find the placeholder where the menu items are dragged into
                allItemElems = menuItemElem.closest(
                    OSFramework.Helper.Constants.contextMenuCss
                ).children;
            }
            //When its a sub-menu-item
            else {
                //Find its parent placeholder
                allItemElems = menuItemElem.closest(
                    OSFramework.Helper.Constants.contextSubMenuCss
                ).children;
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
        private _filterMenuItem(
            e: MouseEvent,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            item: OSFramework.Feature.Auxiliar.MenuItem
        ): boolean {
            // Get info from clicked area
            const ht = this._grid.provider.hitTest(e);
            //How to filter menu options, based on the clicked area =D
            //Can be usefull in the future

            //Validate clicked area
            switch (ht.cellType) {
                case wijmo.grid.CellType.Cell: //Over a Cell
                case wijmo.grid.CellType.None: //Not known area, used for empty grids
                    return true;
                case wijmo.grid.CellType.ColumnHeader: //Over a ColumnHeader
                case wijmo.grid.CellType.RowHeader: //Over a RowHeader
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
            const menuItem =
                OSFramework.Helper.GetElementByUniqueId(menuItemId);
            const menuParentSubMenu = menuItem.closest(
                OSFramework.Helper.Constants.contextSubMenuCss
            );

            if (
                menuParentSubMenu &&
                menuParentSubMenu.parentNode.querySelector(
                    OSFramework.Helper.Constants.contextMenuItemUniqueIdCss
                )
            ) {
                parentID = menuParentSubMenu.parentNode
                    .querySelector(
                        OSFramework.Helper.Constants.contextMenuItemUniqueIdCss
                    )
                    .getAttribute(
                        OSFramework.Helper.Constants.uniqueIdAttribute
                    );
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
            const isOverSelection = this._grid.features.selection.contains(
                ht.range
            );

            //If not performed over a selection, reset the selection
            if (!isOverSelection) {
                this._grid.features.selection.clear();
                this._grid.provider.select(ht.range);
            }

            // Trigger to open
            this._isOpening = true;
            const columns = this._grid.getColumns();

            if (columns.length) {
                this._columnUniqueId = this._grid.getColumns().find((x) => {
                    return x.config.binding === ht.getColumn().binding;
                }).uniqueId;
            }

            this._contextMenuEvents.trigger(
                OSFramework.Event.Feature.ContextMenuEventType.Toggle
            );

            //Filtering menuItem based on the clicked area =D
            this._provider.collectionView.filter = this._filterMenuItem.bind(
                this,
                e
            );

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
                menuItem.clickEvent(this._grid.uniqueId, this._grid);
            }
        }

        /**
         * Sort menu by its order
         * @param items list of menu items
         */
        private _sortMenuItems(items: OSFramework.Feature.Auxiliar.MenuItem[]) {
            items.sort((a, b): number => {
                this._sortMenuItems(a.items);
                return a.order - b.order;
            });
        }
        public get contextMenuEvents(): OSFramework.Event.Feature.ContextMenuEventManager {
            return this._contextMenuEvents;
        }

        public get isOpening(): boolean {
            return this._isOpening;
        }

        public get columnUniqueId(): string {
            return this._columnUniqueId;
        }

        public get grid(): OSFramework.Grid.IGrid {
            return this._grid;
        }

        public addMenuItem(
            menuItemId: string,
            label: string,
            enabled: boolean,
            executeCommand: OSFramework.Callbacks.ContextMenu.OSClickEvent
        ): void {
            const menuItem = new OSFramework.Feature.Auxiliar.MenuItem(
                menuItemId
            );

            menuItem.label = label;
            menuItem.enabled = enabled;
            menuItem.clickEvent = executeCommand;

            this._addMenuItem(menuItem);
        }

        public addMenuItemSeparator(menuItemId: string): void {
            const menuItem = new OSFramework.Feature.Auxiliar.MenuItem(
                menuItemId
            );
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

        public changeProperty(
            menuItemId: string,
            propertyName: string,
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
            propertyValue: any
        ): void {
            const menuItem = this._menuItems.get(menuItemId);
            if (menuItem) {
                if (menuItem.hasOwnProperty(propertyName)) {
                    menuItem[propertyName] = propertyValue;
                } else {
                    console.error(
                        `MenuItem "${menuItem.label}" has no property "${propertyName}" defined.`
                    );
                }
            } else {
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
                console.log(
                    `removeMenuItem - Menu item "${menuItemId}" not available on grid "${this._grid.uniqueId}"`
                );
            }

            const menuItem = this._menuItems.get(menuItemId);

            // if isRootItem delete from rootMenuItems
            if (menuItem.isRootItem) {
                const idx = this._rootMenuItems.indexOf(menuItem);
                idx > -1 && this._rootMenuItems.splice(idx, 1);
            }
            // Kill this child from its parent
            else {
                const parentGroup = this._menuItems.get(
                    menuItem.parentMenuItemId
                );
                const idx = parentGroup.items.indexOf(menuItem);
                idx > -1 && parentGroup.items.splice(idx, 1);
            }

            //Remove it from the Map
            this._menuItems.delete(menuItemId);
        }
    }
}
