// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Column {
    export class DropdownColumn extends AbstractProviderColumn<OSFramework.Configuration.Column.ColumnConfigDropdown> {
        private _handlerAdded: boolean;
        constructor(
            grid: OSFramework.Grid.IGrid,
            columnID: string,
            configs: JSON,
            extraConfig: JSON
        ) {
            super(
                grid,
                columnID,
                new OSFramework.Configuration.Column.ColumnConfigDropdown(
                    configs,
                    extraConfig
                )
            );
            this.config.dataMap = new wijmo.grid.DataMap([], 'key', 'text');
            this._columnEvents =
                new OSFramework.Event.Column.ColumnEventsManager(this);
            this._handlerAdded = false;
        }

        private _parentCellValueChangeHandler(
            gridID: string,
            rowNumber: number,
            columnID: string,
            oldValue: any,
            newValue: any
        ): void {
            // only set to blank if there is a different value
            if (oldValue !== newValue) {
                const currentValue = this.grid.provider.getCellData(
                    rowNumber,
                    this.provider.index,
                    true
                );

                this.grid.features.dirtyMark.saveOriginalValue(
                    rowNumber,
                    this.provider.index
                );
                this.grid.provider.setCellData(
                    rowNumber,
                    this.provider.index,
                    '',
                    true
                );
                this.grid.features.validationMark.validateCell(rowNumber, this);

                const column = this.grid.getColumn(columnID);

                // trigger cell value change event
                if (column) {
                    this.columnEvents.trigger(
                        OSFramework.Event.Column.ColumnEventType
                            .OnCellValueChange,
                        '',
                        currentValue,
                        rowNumber
                    );
                }
            }
        }

        private _parentHandler() {
            if (this.config.parentBinding) {
                const column = this.grid.getColumn(this.config.parentBinding);

                if (column) {
                    // set child column to non mandatory, so we can set it to blank when parent changes value
                    this.provider.isRequired = false;

                    // on parent cell change subscription, to set child cell's to blank
                    column.columnEvents.addHandler(
                        OSFramework.Event.Column.ColumnEventType
                            .OnCellValueChange,
                        this._parentCellValueChangeHandler.bind(this)
                    );
                }
            }
        }

        /** Returns all the events associated to the column */
        public get columnEvents(): OSFramework.Event.Column.ColumnEventsManager {
            return this._columnEvents;
        }

        public get columnType(): OSFramework.Enum.ColumnType {
            return OSFramework.Enum.ColumnType.Dropdown;
        }

        public get providerType(): wijmo.DataType {
            return wijmo.DataType.String;
        }

        public applyConfigs(): void {
            if (this.isReady) {
                const providerConfig = this.getProviderConfig();
                delete providerConfig.dataMap;

                providerConfig.visible = this._getVisibility();

                wijmo.copy(this.provider, providerConfig);
            } else {
                console.log('applyConfigs - Column needs to be build');
            }
        }

        public build(): void {
            (
                this.config.dataMap as wijmo.grid.DataMap
            ).collectionView.sourceCollection = this.config.dropdownOptions;
            this.config.dataMapEditor = wijmo.grid.DataMapEditor.DropDownList;

            super.build();

            if (
                this.config.dropdownOptions &&
                this.config.dropdownOptions.length > 0
            ) {
                // eslint-disable-next-line no-extra-boolean-cast
                if (!!this.config.parentBinding) {
                    this.changeDisplayValues();
                    if (!this._handlerAdded) {
                        this._parentHandler();
                        this._handlerAdded = true;
                    }
                }
            }
        }

        public changeDisplayValues(): void {
            const dataMap = this.config.dataMap;
            const values = dataMap.collectionView.items;

            const parentColumn = this.grid.getColumn(this.config.parentBinding);

            if (
                parentColumn &&
                parentColumn.columnType === OSFramework.Enum.ColumnType.Dropdown
            ) {
                // override getDisplayValues method to get values that
                // correspond to the parent
                dataMap.getDisplayValues = (dataItem) => {
                    const colBinding = this.config.parentBinding.split('.');
                    let value = dataItem;
                    for (let i = 0; i < colBinding.length; i++) {
                        // in case we get undefined we want to break
                        if (
                            value === undefined &&
                            i === colBinding.length - 1
                        ) {
                            break;
                        }
                        value = value[colBinding[i]];
                    }

                    // if there is no value, we don't return anything
                    if (value) {
                        const validValues = values.filter(
                            (x) => x.parentKey === value.toString()
                        );
                        return validValues.map((value) => value.text);
                    }
                };
            }
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public changeProperty(propertyName: string, propertyValue: any): void {
            switch (propertyName) {
                case 'dropdownOptions':
                    // eslint-disable-next-line
                    const dataMap = this.config.dataMap as wijmo.grid.DataMap;
                    // eslint-disable-next-line
                    const values = JSON.parse(propertyValue) as [];
                    this.config.dropdownOptions = values;
                    dataMap.collectionView.sourceCollection = values;
                    dataMap.collectionView.refresh();

                    // eslint-disable-next-line no-extra-boolean-cast
                    if (!!this.config.parentBinding) {
                        this.changeDisplayValues();

                        if (!this._handlerAdded) {
                            this._parentHandler();
                            this._handlerAdded = true;
                        }
                    }
                    break;
                default:
                    super.changeProperty(propertyName, propertyValue);
            }
        }
    }
}
