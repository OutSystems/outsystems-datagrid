/*!
    *
    * Wijmo Library 5.20242.30
    * https://developer.mescius.com/wijmo
    *
    * Copyright(c) MESCIUS inc. All rights reserved.
    *
    * Licensed under the End-User License Agreement For MESCIUS Wijmo Software.
    * us.sales@mescius.com
    * https://developer.mescius.com/wijmo/licensing
    *
    */
declare module wijmo.rest {
    /**
     * Base class for REST-based CollectionView classes.
     *
     * To use it, create a class that extends {@link:RestCollectionView}
     * and add overrides for the following methods:
     *
     * <ul>
     *     <li><b>getItems</b>: Gets a list of items from the server. The list may be sorted, filtered, and paged.</li>
     *     <li><b>getGroupItems</b>: Gets a list of group items from the Server only if ServerSide Grouping is required. The list may be sorted, filtered. </li>
     *     <li><b>addItem</b>: Adds an item to the collection on the server.</li>
     *     <li><b>patchItem</b>: Edits an item in the collection on the server.</li>
     *     <li><b>deleteItem</b>: Deletes an item fom the collection on the server.</li>
     * </ul>
     *
     * By default, the class should perform sorting, filtering, and paging on the server.
     *
     * If the REST service does not support any of these operations, make sure the
     * **sortOnServer**, **pageOnServer**, or **filterOnServer** properties are set
     * to **false**, and the corresponding operations will be performed on the client instead.
     *
     * The default value for **groupOnServer** property is false and should be set to true if the server-based grouping is required.
     */
    class RestCollectionView extends wijmo.collections.CollectionView {
        _toGetData: any;
        _loading: boolean;
        _fields: string[] | null;
        _keys: string[] | null;
        _sortOnServer: boolean;
        _pageOnServer: boolean;
        _filterOnServer: boolean;
        _filterProvider: any;
        _totalItemCount: number;
        _requestHeaders: any;
        _aggregates: string;
        _groupOnServer: boolean;
        _groupLazyLoading: boolean;
        _virtualization: boolean;
        _totalGroupItemCount: number;
        _start: number;
        _end: number;
        _firstLoad: boolean;
        _expandedGroups: wijmo.collections.CollectionViewGroup[];
        _groupItems: any[];
        _data: any[];
        _loadOffset: number;
        _toSetWindow: any;
        _pendingReq: XMLHttpRequest;
        _groupRefresh: boolean;
        _refresh: boolean;
        _requestCanceled: wijmo.Event<RestCollectionView, wijmo.EventArgs>;
        /**
         * Initializes a new instance of the @see:RestCollectionView class.
         *
         * @param options JavaScript object containing initialization data (property
         * values and event handlers) for the @see:RestCollectionView.
         */
        constructor(options?: any);
        /**
         * Gets or sets a value that determines whether grouping should be performed on
         * the server or on the client.
         *
         * The default value for this property is false and should be enabled only when the Server API supports grouping.
         */
        groupOnServer: boolean;
        /**
         * Gets or Sets a value that detemines whether the group data should be loaded
         * on demand or at once.
         *
         * The default value for this property is false and should be set to true only when {@link:groupOnServer} is set to true.
         */
        groupLazyLoading: boolean;
        /**
         * Gets or Set a value that determines whether the data should be loaded virtually or not.
         *
         * The default value for this property is false and should be set to true only when {@link:groupOnServer} is set to true.
         */
        virtualization: boolean;
        /**
         * Gets or sets an array containing the names of the fields to retrieve from
         * the data source.
         *
         * If this property is set to null or to an empty array, all fields are
         * retrieved.
         */
        fields: string[] | null;
        /**
         * Gets or sets a value that determines whether sort operations
         * should be performed on the server or on the client.
         *
         * Use the @see:sortDescriptions property to specify how the
         * data should be sorted.
         */
        sortOnServer: boolean;
        /**
         * Gets or sets a value that determines whether paging should be
         * performed on the server or on the client.
         *
         * Use the @see:pageSize property to enable paging.
         */
        pageOnServer: boolean;
        /**
         * Gets or sets a value that determines whether filtering should be performed on
         * the server or on the client.
         */
        filterOnServer: boolean;
        /**
         * Gets or sets an object containing request headers to be used when sending
         * or requesting data.
         *
         * The most typical use for this property is in scenarios where authentication
         * is required. For example:
         *
         * ```typescript
         * import { ODataCollectionView } from '@mescius/wijmo.odata';
         * const url = 'http://services.odata.org/V4/Northwind/Northwind.svc/';
         * const categories = new ODataCollectionView(serviceUrl, 'Categories', {
         *   fields: ['Category_ID', 'Category_Name'],
         *   requestHeaders: { Authorization: db.token }
         * });
         * ```
         */
        requestHeaders: any;
        /**
        * Gets or Sets the aggregates query which would parsed by the REST/Web API and returns the aggregates as result.
        * This property is should be set when aggregate property is set for FlexGrid columns and {@see groupOnServer} is
        * set to true with groupDescriptions.
        *
        * ```typescript
        * // instance of RestCollectionView / derived class from RestCollectionView
        * let cv = new RestCollectionView({
        *     groupOnServer: true,
        *     aggregates: `Sum(actualCost) as actualCost,Sum(quantity) as quantity`,
        *     groupDescriptions: [
        *       // group description to add groups
        *       new PropertyGroupDescription('productName'),
        *       new PropertyGroupDescription('transactionType')
        *     ]
        * });
        * ```
        */
        aggregates: string;
        /**
         * Updates the filter definition based on a known filter provider such as
         * the @see:FlexGridFilter.
         *
         * @param filterProvider Known filter provider, typically an instance of
         * a @see:FlexGridFilter.
         */
        updateFilterDefinition(filterProvider: any): void;
        /**
        * This method would allow to load the items for specified group {@link CollectionViewGroup} when {@link groupLazyLoading} is enabled.
        * @param item {@link CollectionViewGroup} items to load the data.
        *
        */
        lazyLoadGroup(item: wijmo.collections.CollectionViewGroup): void;
        /**
         * Sets the data window to ensure a range of records are loaded into the view.
         *
         * @param start Index of the first item in the data window.
         * @param end Index of the last item in the data window.
         */
        setWindow(start: number, end: number): void;
        private _getFilterGroupItems;
        /**
         * Retrieves the aggregate value for a specified `GroupRow`. The `aggregate` property value should correspond to the specified
         * for `columnBinding` in the associated @see:aggregates.
         *
         * @param columnBinding The name of the property on which to perform the aggregation.
         * @param groupItem The {@link CollectionViewGroup} instance representing the group for which the aggregation is to be calculated.
         * @param aggregate The type of {@link Aggregate} to compute, which should also be defined in the @see:aggregates for the specified `columnBinding`.
         * @returns The calculated aggregate value.
         */
        getGroupAggregate(columnBinding: string, groupItem: wijmo.collections.CollectionViewGroup, aggregate?: wijmo.Aggregate): any;
        /**
         * Gets a value that indicates the @see:ServerCollectionView is
         * currently loading data.
         *
         * This property can be used to provide progress indicators.
         */
        readonly isLoading: boolean;
        /**
         * Occurs when the @see:ServerCollectionView starts loading data.
         */
        loading: Event<any, EventArgs>;
        /**
         * Raises the @see:loading event.
         */
        onLoading(e?: wijmo.EventArgs): void;
        /**
         * Occurs when the @see:ServerCollectionView finishes loading data.
         */
        loaded: Event<any, EventArgs>;
        /**
         * Raises the @see:loaded event.
         */
        onLoaded(e?: wijmo.EventArgs): void;
        /**
         * Loads or re-loads the data from the server.
         */
        load(): void;
        /**
         * Occurs when there is an error reading or writing data.
         */
        error: Event<any, EventArgs>;
        /**
         * Raises the @see:error event.
         *
         * By default, errors throw exceptions and trigger a data refresh. If you
         * want to prevent this behavior, set the @see:RequestErrorEventArgs.cancel
         * parameter to true in the event handler.
         *
         * @param e @see:ErrorEventArgs that contains information about the error.
         */
        onError(e: RESTErrorEventArgs): boolean;
        _performRefresh(): void;
        /**
         * Gets the total number of items in the view before paging is applied.
         */
        readonly totalItemCount: number;
        /**
         * Gets the total number of pages.
         */
        readonly pageCount: number;
        /**
         * Gets or sets the number of items to display on a page.
         */
        pageSize: number;
        /**
         * Raises the @see:pageChanging event.
         *
         * @param e @see:PageChangingEventArgs that contains the event data.
         */
        onPageChanging(e: wijmo.collections.PageChangingEventArgs): boolean;
        /**
         * Override @see:commitNew to add the new item to the database.
         */
        commitNew(): void;
        /**
         * Override @see:commitEdit to modify the item in the database.
         */
        commitEdit(): void;
        /**
         * Override @see:remove to remove the item from the database.
         *
         * @param item Item to be removed from the database.
         */
        remove(item: any): void;
        _getPageView(): any[];
        private _getData;
        private _loadExpandedGroups;
        private _updateSubGroups;
        private _loadSubGroupsData;
        _updateExpandedGroups(item: wijmo.collections.CollectionViewGroup, isCollapsed: boolean): void;
        _storeItems(items: any[], append: boolean): Promise<void>;
        _isVirtualRefreshNeeded(start: number, end: number): boolean;
        _performSetWindow(start: number, end: number): void;
        protected _fetchSize(): number;
        protected _raiseError(error: any, reload: boolean): void;
        readonly requestCanceled: wijmo.Event<RestCollectionView, wijmo.EventArgs>;
        /**
         * Raises the {@link requestCanceled} event.
         */
        onRequestCanceled(e?: wijmo.EventArgs): void;
        protected getGroupItems(item?: wijmo.collections.CollectionViewGroup): Promise<any[]>;
        /**
         * Gets a Promise that returns an array containing all the items,
         * possibly filtered/paged/and sorted on the server.
         */
        protected getItems(item?: string | wijmo.collections.CollectionViewGroup): Promise<any[]>;
        /**
         * Gets a Promise that adds a new item to the database.
         */
        protected addItem(item: any): Promise<any>;
        /**
         * Gets a Promise that modifies an item in the database.
         */
        protected patchItem(item: any): Promise<any>;
        /**
         * Gets a Promise that removes an item from the database.
         */
        protected deleteItem(item: any): Promise<any>;
    }
    /**
     * Class that provides information for REST errors.
     */
    class RESTErrorEventArgs extends wijmo.CancelEventArgs {
        _error: any;
        constructor(error: any);
        readonly error: any;
    }
}
declare module wijmo.rest {
}
