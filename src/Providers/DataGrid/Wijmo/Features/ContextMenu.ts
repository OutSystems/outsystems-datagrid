// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
	/**
	 * Representation of the ContextMenu feature
	 */
	export class ContextMenu
		implements
			OSFramework.DataGrid.Interface.IBuilder,
			OSFramework.DataGrid.Interface.IDisposable,
			OSFramework.DataGrid.Feature.IContextMenu
	{
		/** Events from the Context Menu  */
		private _columnBinding: string;
		private _columnUniqueId: string;
		private _columnWidgetId: string;
		private _contextMenuEvents: OSFramework.DataGrid.Event.Feature.ContextMenuEventManager;
		private _grid: Grid.IGridWijmo;
		private _isOpening: boolean;
		/** Map a UniqueId to its MenuItem */
		private _menuItems: Map<string, OSFramework.DataGrid.Feature.Auxiliar.MenuItem>;
		/** Our provider ContextMenu instance */
		private _provider: wijmo.input.Menu;
		/** Only the root MenuItems to be shown on Input.Menu */
		private _rootMenuItems: OSFramework.DataGrid.Feature.Auxiliar.MenuItem[];

		constructor(grid: Grid.IGridWijmo) {
			this._grid = grid;
			this._menuItems = new Map();
			this._rootMenuItems = [];
			this._contextMenuEvents = new OSFramework.DataGrid.Event.Feature.ContextMenuEventManager(this);
		}

		/**
		 * Adds a MenuItem to the the Mapper and ContextMenu.itemsSource
		 * @param menuItem Instance of the new MenuItem just before insertion
		 */
		private _addMenuItem(menuItem: OSFramework.DataGrid.Feature.Auxiliar.MenuItem) {
			//If already inserted to the Map  exit the method
			if (this._menuItems.has(menuItem.uniqueId)) {
				return;
			}

			//Add to the Map
			this._menuItems.set(menuItem.uniqueId, menuItem);

			//Find its parent MenuItem
			menuItem.parentMenuItemId = this._getMenuParentId(menuItem.uniqueId);

			//Define menu item's order
			const menuItemOrder = this._defineMenuItemOrder(menuItem.uniqueId);

			//If it is a root item, push it to the rootMenuItems array.
			//Otherwise, get the correct array.
			const arrayItem = menuItem.isRootItem
				? this._rootMenuItems
				: this._menuItems.get(menuItem.parentMenuItemId).items;

			//Check if it is the last item, if so, push it to the end of the array.
			//Otherwise, insert it in the correct position.
			const isLastItem = menuItemOrder === arrayItem.length;

			if (isLastItem) {
				arrayItem.push(menuItem);
			} else {
				arrayItem.splice(menuItemOrder, 0, menuItem);
			}

			//If the menu is opening, let's refresh the itemsSource
			if (this._isOpening) {
				this._provider.itemsSource.refresh();
			}
		}

		/**
		 * Responsable for the creation of the context menu object
		 */
		private _buildProvider(): void {
			const itemsSource = new wijmo.collections.CollectionView(this._rootMenuItems);

			this._provider = new wijmo.input.Menu(document.createElement('div'), {
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
					executeCommand: this._raiseClickEvent.bind(this),
				},
				isDroppedDownChanging: (e) => {
					// The event is raised when the context menu opens or closes.

					//If the menu is (currently) open, then this event was fired to close it.
					//Otherwise, if closed, means that it will open, so we'll not do anything here.
					if (e.isDroppedDown) {
						// It is easier to understand if it will open instead of analysing if the menu is dropped down.
						this._isOpening = false;
						//Trigger the event menu was closed.
						this._contextMenuEvents.trigger(OSFramework.DataGrid.Event.Feature.ContextMenuEventType.Toggle);
					}
				},
			});
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
			const menuItemElem = OSFramework.DataGrid.Helper.GetElementByUniqueId(menuItemId);
			const menuItem = this._menuItems.get(menuItemId);

			//When its a root element
			if (menuItem.isRootItem) {
				//Find the placeholder where the menu items are dragged into
				allItemElems = menuItemElem.closest(OSFramework.DataGrid.Helper.Constants.contextMenuCss).children;
			}
			//When its a sub-menu-item
			else {
				//Find its parent placeholder
				allItemElems = menuItemElem.closest(OSFramework.DataGrid.Helper.Constants.contextSubMenuCss).children;
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
			item: OSFramework.DataGrid.Feature.Auxiliar.MenuItem
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
			const menuItem = OSFramework.DataGrid.Helper.GetElementByUniqueId(menuItemId);
			const menuParentSubMenu = menuItem.closest(OSFramework.DataGrid.Helper.Constants.contextSubMenuCss);

			if (
				menuParentSubMenu &&
				menuParentSubMenu.parentNode.querySelector(
					OSFramework.DataGrid.Helper.Constants.contextMenuItemUniqueIdCss
				)
			) {
				parentID = menuParentSubMenu.parentNode
					.querySelector(OSFramework.DataGrid.Helper.Constants.contextMenuItemUniqueIdCss)
					.getAttribute(OSFramework.DataGrid.Helper.Constants.uniqueIdAttribute);
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

			// Trigger to open
			this._isOpening = true;
			const columns = this._grid.getColumns();
			const htColumn = ht.getColumn();

			// Will need to have an extra validation looking at the binding because of the column picker column
			if (columns.length && htColumn && htColumn.binding !== null) {
				const columnHit = this._grid.getColumns().find((x) => {
					return x.config.binding === htColumn.binding;
				});
				if (columnHit) {
					this._columnBinding = columnHit.config.binding;
					this._columnUniqueId = columnHit.uniqueId;
					//If the id of the widget id starts with a $, means that the developer didn't set the Id. So it's not useful to return it.
					this._columnWidgetId = columnHit.widgetId;
					if (OSFramework.DataGrid.Helper.HasPlatformDefaultId(columnHit.widgetId)) {
						this._columnWidgetId = '';
					}
				}
			}
			//Trigger the event Opening. It is synchronous to allow the developer to change the
			//Context Menu items before the menu is visible.
			this._contextMenuEvents.trigger(OSFramework.DataGrid.Event.Feature.ContextMenuEventType.Opening);

			//Filtering menuItem based on the clicked area =D
			this._provider.collectionView.filter = this._filterMenuItem.bind(this, e);

			//Control the menu opening
			if (this._provider.collectionView.items.length) {
				//Show the context menu
				this._provider.show(e);

				// cancel the browser's default menu
				e.preventDefault();

				//Trigger the event menu was opened.
				this._contextMenuEvents.trigger(OSFramework.DataGrid.Event.Feature.ContextMenuEventType.Toggle);
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

		public get contextMenuEvents(): OSFramework.DataGrid.Event.Feature.ContextMenuEventManager {
			return this._contextMenuEvents;
		}

		public get isOpening(): boolean {
			return this._isOpening;
		}

		public get columnBinding(): string {
			return this._columnBinding;
		}

		/**
		 * Returns the Id of the column in which the context menu was
		 * triggered in. Tries to return the widgetId (if the dev gave one to the column block),
		 * and if not available, returns the uniqueId.
		 * In the case of auto-generated grids, the uniqueId will be equal to the column binding.
		 *
		 * @readonly
		 * @type {string}
		 * @memberof ContextMenu
		 */
		public get columnId(): string {
			return this._columnWidgetId || this._columnUniqueId;
		}

		public get columnUniqueId(): string {
			return this._columnUniqueId;
		}

		public get columnWidgetId(): string {
			return this._columnWidgetId;
		}

		public get grid(): OSFramework.DataGrid.Grid.IGrid {
			return this._grid;
		}

		public addMenuItem(
			menuItemId: string,
			label: string,
			enabled: boolean,
			executeCommand: OSFramework.DataGrid.Callbacks.ContextMenu.OSClickEvent
		): void {
			const menuItem = new OSFramework.DataGrid.Feature.Auxiliar.MenuItem(menuItemId);
			// Sanitize the label if the configuration is set to do so
			menuItem.label = this.grid.config.sanitizeInputValues ? OSFramework.DataGrid.Helper.Sanitize(label) : label;
			menuItem.enabled = enabled;
			menuItem.clickEvent = executeCommand;

			this._addMenuItem(menuItem);
		}

		public addMenuItemSeparator(menuItemId: string): void {
			const menuItem = new OSFramework.DataGrid.Feature.Auxiliar.MenuItem(menuItemId);
			menuItem.label = '-'; // this header is known by the provider, and is used to create the line separator

			this._addMenuItem(menuItem);
		}

		public build(): void {
			this._buildProvider();

			const host = this._grid.provider.hostElement;
			host.addEventListener('contextmenu', this._handleRightClick.bind(this), true);
		}

		public changeProperty(menuItemId: string, propertyName: string, propertyValue: unknown): void {
			const menuItem = this._menuItems.get(menuItemId);
			if (menuItem) {
				if (menuItem.hasOwnProperty(propertyName)) {
					if (propertyName === 'label' && this.grid.config.sanitizeInputValues) {
						// Sanitize the label if the configuration is set to do so
						menuItem.label = OSFramework.DataGrid.Helper.Sanitize(propertyValue as string);
					} else {
						menuItem[propertyName] = propertyValue;
					}
				} else {
					console.error(`MenuItem "${menuItem.label}" has no property "${propertyName}" defined.`);
				}
			} else {
				console.error(`MenuItem "${menuItemId}" not registered.`);
			}

			this._provider.itemsSource.refresh();
		}

		public dispose(): void {
			this._grid.provider.hostElement.removeEventListener('contextmenu', this._handleRightClick.bind(this), true);
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
				const parentGroup = this._menuItems.get(menuItem.parentMenuItemId);
				const idx = parentGroup.items.indexOf(menuItem);
				idx > -1 && parentGroup.items.splice(idx, 1);
			}

			//Remove it from the Map
			this._menuItems.delete(menuItemId);

			//If the menu is opening, let's refresh the itemsSource
			if (this._isOpening) {
				this._provider.itemsSource.refresh();
			}
		}
	}
}
