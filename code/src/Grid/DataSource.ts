// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace DS {
    export class ChangesDone {
        public addedLinesJSON: string;
        public editedLinesJSON: string;
        public hasChanges: boolean;
        public removedLinesJSON: string;
    }

    /**
     * Used to flatten the data array
     * @param dataArray
     * @returns
     */
    function FlattenArray(dataArray: JSON[]): JSON[] {
        const returnDataArray = [];
        dataArray.forEach((item) => {
            returnDataArray.push(Helper.Flatten(item));
        });

        return returnDataArray;
    }

    /**
     * Responsible for parsing string fields to its correct data type
     *
     * @param data A string of the JSON data object
     * @example OS Date fields is send as strings, and we should parse it to Date, the is done for Datetime fields.
     */
    function ToJSONFormat(
        data: string,
        convertions: Map<string, Set<string>>
        // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
    ): any {
        //regex expressions for date and datetime should be described here
        const regex = {
            datetime: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z?$/, //yyyy-MM-ddThh:mm:ssZ
            date: /^(\d{4})-(\d{2})-(\d{2})$/ //yyyy-MM-dd
        };

        // Parse dates saved as JSON-strings
        return JSON.parse(data, (key, value) => {
            if (typeof value === 'string') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let m: any;

                const match = (value: string, exp: RegExp) => {
                    m = value.match(exp);
                    return m;
                };

                const saveConvertion = (type: string, key: string) => {
                    const done = convertions.get(type) || new Set<string>();
                    done.add(key);
                    convertions.set(type, done);
                };

                if (match(value, regex.datetime)) {
                    saveConvertion('datetime', key);
                    return new Date(
                        Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6])
                    );
                } else if (match(value, regex.date)) {
                    //Considering that OS Date field do not consider GMT
                    //DataGrid also won't consider it for Date Columns
                    //PS: Datetime will consider GMT just like OS consider
                    saveConvertion('date', key);
                    return new Date(+m[1], +m[2] - 1, +m[3]);
                } else if (value === '') {
                    return undefined;
                }
            }
            return value;
        });
    }

    /**
     * Used to send data to Outsystems, converting data to OS format.
     * @param grid Grid to format data
     * @param data Data to format
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    function ToOSFormat(
        convertions: Map<string, Set<string>>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: Array<any>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): void {
        //TODO: [RGRIDT-638] Regression 2021-02-12: Is this method the best solution
        const columns = convertions.get('date');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const setDeepDate = (binding: string, object: any) => {
            if (object[binding]) {
                const dt = object[binding] as Date;

                object[binding] = new Date(
                    dt.getTime() - dt.getTimezoneOffset() * 60000
                )
                    .toISOString()
                    .substr(0, 10);
            }
        };

        columns.forEach((col) => {
            data.forEach((item) => {
                setDeepDate(col, item);
            });
        });
    }

    /**
     * Defines the basic interface for a DataSource
     */
    export interface IDataSource extends IBuilder {
        /**
         * Idenfity if metadata was given
         * @description Only works during the use of ArrangeData
         */
        hasMetadata: boolean;
        /**
         * Identify if the datasource has single entity
         */
        isSingleEntity: boolean;
        /**
         * Add row to an specific position on the DataSource
         * @param position index position (0-based)
         * @param data The array of items to be inserted
         */
        addRow(position?: number, data?: JSON[]);
        /**
         * Clear all changes in the datasource
         */
        clear(): void;
        /**
         * Filter the datasource by the given value
         * @param searchedValue the value used as filter
         */
        filter(searchedValue: string): void;
        /**
         * Used to flatten the datasource
         */
        flatten(): void;
        /**
         * Returns the changes made on the grid
         */
        getChanges<T extends ChangesDone>(c: new () => T): T;
        /**
         * Return the full data source
         */
        getData(): JSON[];
        /**
         * Return metadata information
         */
        getMetadata(): JSON;
        /**
         * Return the provider's dataSource
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getProviderDataSource(): any;
        /**
         * Indicate whether the filtered dataSource has Results to show
         */
        hasResults(): boolean;
        /**
         * Responsabem to items from the datasource
         * @param item Can be the index position (0-based) or the dataItem of that row
         */
        removeRow(item: number | JSON): boolean;
        /**
         * Set data to be printed on the grid
         * @param data data source in JSON stringify format
         */
        setData(data: string): void;
        /**
         * Transform dataItem to OS format
         * @param dataItem 
         */
        toOSFormat(dataItem: any): any;
    }

    abstract class AbstractDataSource implements IDataSource {
        protected _convertions: Map<string, Set<string>>;
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        protected _ds: Array<any>;
        protected _metadata: JSON;

        constructor() {
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
            this._ds = new Array<any>();
            this._convertions = new Map<string, Set<string>>();
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        protected _getChangesString(itemsChanged: any): string {
            let tempArray = itemsChanged.map((p) => _.cloneDeep(p));

            //In-place convert data to Outsystems Format
            ToOSFormat(this._convertions, tempArray);

            if (this.isSingleEntity) {
                //if the line has a single entity or structure, let's flatten it, so that we avoid the developer
                //when deserializing to need to put in the JSONDeserialize in the target "List Record {ENTITY}" -> would require extra step.
                tempArray = FlattenArray(tempArray);
            }

            return JSON.stringify(tempArray);
        }

        /**
         * Parse JSON and get the structure of the new item.
         * @param json
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        protected _parseNewItem(): any {
            const parsedNewItem = _.cloneDeep(this._metadata);
            const converter = (object) => {
                Object.keys(object).forEach((key) => {
                    if (typeof object[key] === 'object') converter(object[key]);
                    else object[key] = undefined;
                });
            };

            converter(parsedNewItem);

            return parsedNewItem;
        }

        public get hasMetadata(): boolean {
            return !!this._metadata;
        }

        public get isSingleEntity(): boolean {
            return Object.keys(this._ds[0] || {}).length <= 1;
        }

        public addRow(position?: number, data?: JSON[]) {
            this._ds.splice(position, 0, ...data);
        }

        public flatten(): void {
            const newData = FlattenArray(this._ds);
            this._ds.splice(0);
            this._ds.push(newData);
        }

        public getData(): JSON[] {
            return this._ds;
        }

        public getMetadata(): JSON {
            return this._metadata;
        }

        public removeRow(item: number | JSON): boolean {
            const index =
                typeof item === 'number' ? item : this._ds.indexOf(item);

            if (index === -1) return false;

            this._ds.splice(index, 1);

            return true;
        }

        public setData(data: string): void {
            // Use with a Date reviver to restore date fields
            this._convertions.clear();
            const dataJson = ToJSONFormat(data, this._convertions);

            this._metadata = dataJson.metadata;

            if (this.hasMetadata) {
                this._ds.push(...dataJson.data);
            } else {
                this._ds.push(...dataJson);
            }
        }

        public toOSFormat(dataItem: any): any {
            return this._getChangesString(dataItem);
        }

        public abstract build(): void;

        public abstract clear(): void;

        public abstract filter(info: string): void;

        public abstract getChanges<T extends ChangesDone>(c: new () => T): T;

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public abstract getProviderDataSource(): any;

        public abstract hasResults(): boolean;
    }

    export class ProviderDataSource extends AbstractDataSource {
        private _provider: wijmo.collections.CollectionView;

        public addRow(position?: number, data?: JSON[]) {
            super.addRow(position, data);
            this._provider.refresh();
        }

        public build(): void {
            this._provider = new wijmo.collections.CollectionView();
            this._provider.trackChanges = true;
        }

        public clear(): void {
            this._provider.clearChanges();
        }

        public filter(searchedValue: string): void {
            const rx = new RegExp(searchedValue, 'i');

            // always move to first page when a search is done
            this._provider.moveToFirstPage();

            this._provider.filter = function (x) {
                return !searchedValue || JSON.stringify(x).match(rx) !== null;
            };
        }

        public getChanges<T extends ChangesDone>(c: new () => T): T {
            const changes = new c();
            const itemsSource = this._provider;

            if (itemsSource.itemsAdded.length > 0) {
                changes.hasChanges = true;
                changes.addedLinesJSON = this._getChangesString(
                    itemsSource.itemsAdded
                );
            }

            if (itemsSource.itemsEdited.length > 0) {
                changes.hasChanges = true;
                changes.editedLinesJSON = this._getChangesString(
                    itemsSource.itemsEdited
                );
            }

            if (itemsSource.itemsRemoved.length > 0) {
                changes.hasChanges = true;
                changes.removedLinesJSON = this._getChangesString(
                    itemsSource.itemsRemoved
                );
            }

            return changes;
        }

        public getProviderDataSource(): wijmo.collections.CollectionView {
            return this._provider;
        }

        public hasResults(): boolean {
            return this._provider.isEmpty === false;
        }

        public setData(data: string): void {
            super.setData(data);
            this._provider.sourceCollection = this._ds;
        }
    }
}
