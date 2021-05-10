// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    export class ValidationMark
        implements
            OSFramework.Feature.IValidationMark,
            OSFramework.Interface.IBuilder {
        private _grid: WijmoProvider.Grid.IGridWijmo;
        /** Internal label for the validation marks */
        private readonly _internalLabel = '__validationMarkFeature';
        /** Array containing all invalid rows */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _invalidRows: Array<any>;
        /** Exposed methods to manipulate RowMetadata */
        private _metadata: OSFramework.Interface.IRowMetadata;

        constructor(grid: WijmoProvider.Grid.IGridWijmo) {
            this._grid = grid;
            this._metadata = this._grid.rowMetadata;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this._invalidRows = new Array<any>();
        }

        /**
         * Future Implementation -> Handler for the addNewRows.
         * @param rowNumber Number of the row that has been added to the grid.
         */
        // private _addNewRowEndingHandler(rowNumber: number): void {
        //     this._bindToColumn.forEach((columnX) => {
        //         this.__triggerEventsFromColumn(rowNumber, columnX.provider.binding, undefined);
        //     });
        // }

        /**
         * Handler for the CellEditEnded.
         */
        private _cellEditHandler(
            s: wijmo.grid.FlexGrid,
            e: wijmo.grid.CellRangeEventArgs
        ): void {
            const binding = s.getColumn(e.col).binding;
            const newValue = s.getCellData(e.row, e.col, false);
            // The old value can be captured on the dirtyMark feature as it is the one responsible for saving the original values
            const oldValue = this._grid.features.dirtyMark.getOldValue(
                e.row,
                binding
            );
            this._triggerEventsFromColumn(e.row, binding, oldValue, newValue);
        }

        /** Helper to convert the formats of Date and DateTime columns to the format of OS */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _convertToFormat(
            column: OSFramework.Column.IColumn,
            value: any
        ) {
            switch (column.columnType) {
                case OSFramework.Enum.ColumnType.Number:
                case OSFramework.Enum.ColumnType.Currency:
                    return parseFloat(value ?? 0);
                case OSFramework.Enum.ColumnType.Date:
                    return OSFramework.Helper.ToOSDate(
                        value ?? new Date(1900, 0, 1)
                    );
                case OSFramework.Enum.ColumnType.DateTime:
                    return OSFramework.Helper.ToOSDatetime(
                        value ?? new Date(1900, 0, 1)
                    );
                case OSFramework.Enum.ColumnType.Checkbox:
                    return value ?? false;
                default:
                    return value ?? '';
            }
        }

        /** Handler for the formatItem. Should add the invalid class to the cells or rows if those are invalid. */
        private _formatItems(
            grid: wijmo.grid.FlexGrid,
            e: wijmo.grid.FormatItemEventArgs
        ) {
            if (
                e.panel.cellType === wijmo.grid.CellType.Cell &&
                this._isInvalidCell(e.row, e.col)
            ) {
                wijmo.addClass(e.cell, 'wj-state-invalid');
            } else if (
                e.panel.cellType === wijmo.grid.CellType.RowHeader &&
                this._isInvalidRow(e.row)
            ) {
                wijmo.addClass(e.cell, 'wj-state-invalid');
            }
        }

        /**
         * Checks if a specific cell is invalid.
         * @param rowNumber Number of the row to check if the cell is invalid.
         * @param colNumber Number of the column to check if the cell is invalid.
         * @returns Boolean that indicates if the cell is invalid. Returns True if invalid. False, otherwise.
         */
        private _isInvalidCell(rowNumber: number, colNumber: number): boolean {
            const provider = this._grid.provider;

            if (this.hasMetadata(rowNumber)) {
                const binding = provider.getColumn(colNumber).binding;
                const metadata = this.getMetadata(rowNumber);

                return (
                    metadata.validation.has(binding) &&
                    metadata.validation.get(binding) === false
                );
            }
            return false;
        }

        /**
         * Checks if a specific row is invalid by checking if it contains any invalid cells.
         * @param rowNumber Number of the row to check if a row has invalid cells
         * @returns Boolean that indicates if the row is invalid. Returns True if invalid. False, otherwise.
         */
        private _isInvalidRow(rowNumber: number): boolean {
            if (this.hasMetadata(rowNumber)) {
                const metadata = this.getMetadata(rowNumber);
                let notInvalidCells = 0;

                for (const binding of metadata.validation.keys()) {
                    //If validation of a specific cell is equal to True
                    if (metadata.validation.get(binding) === true)
                        //Add 1 to the the validCells summatory
                        notInvalidCells++;
                    //One cell is invalid so the mark should be shown
                    else break;
                }

                //If Total changes - equals > 0 there is some dirty register on the row
                return metadata.validation.size - notInvalidCells > 0;
            }

            return false;
        }

        /**
         * Handler for the RedoingAction.
         */
        private _redoingActionHandler(
            s: wijmo.undo.UndoStack,
            e: wijmo.undo.UndoActionEventArgs
        ): void {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const action: any = e.action;

            // we only want to redo on GridEditAction
            if (action.dataItem === undefined) return;

            const binding = this._grid.provider.getColumn(action.col).binding;
            const oldValue = this._grid.features.dirtyMark.getOldValue(
                action.row,
                binding
            );
            this._triggerEventsFromColumn(
                action.row,
                binding,
                oldValue,
                action._newState
            );
        }

        /**
         * Set invalid rows
         * @param rowNumber Number of the row to trigger the events
         * @param isValid Wether or not row is valid
         */
        private _setInvalidRows(rowNumber: number, isValid: boolean): void {
            const dataItem = this._grid.provider.rows[rowNumber].dataItem;

            if (this._invalidRows.indexOf(dataItem) === -1) {
                if (isValid === false) {
                    this._invalidRows.push(dataItem);
                }
            } else {
                if (isValid === true) {
                    this._invalidRows.splice(
                        this._invalidRows.indexOf(dataItem),
                        1
                    );
                }
            }
        }

        /**
         * Triggers the events of OnCellValueChange associated to a specific column in OS
         * @param rowNumber Number of the row to trigger the events
         * @param binding Binding of the column that contains the associated events
         * @param oldValue Value of the cell before its value has changed (Old)
         * @param newValue Value of the cell after its value has changed (New)
         */
        private _triggerEventsFromColumn(
            rowNumber: number,
            binding: string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            oldValue: any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            newValue: any
        ) {
            const column = this._grid.getColumn(binding);
            if (column !== undefined) {
                if (column.config.isMandatory) {
                    let isValid = true;
                    if (
                        newValue === '' ||
                        newValue === undefined ||
                        newValue === null
                    ) {
                        isValid = false;
                    }
                    // Sets cell as valid or invalid depending on the newValue
                    GridAPI.Cells.SetValidationStatus(
                        this._grid.uniqueId,
                        rowNumber,
                        column.widgetId,
                        isValid,
                        column.config.errorMessage
                    );
                }
                if (
                    column.hasEvents &&
                    column.columnEvents.handlers.has(
                        OSFramework.Event.Column.ColumnEventType
                            .OnCellValueChange
                    )
                ) {
                    column.columnEvents.trigger(
                        OSFramework.Event.Column.ColumnEventType
                            .OnCellValueChange,
                        this._convertToFormat(column, newValue),
                        this._convertToFormat(column, oldValue),
                        rowNumber
                    );
                }
            }
        }

        /**
         * Handler for the UndoingAction.
         */
        private _undoingActionHandler(
            s: wijmo.undo.UndoStack,
            e: wijmo.undo.UndoActionEventArgs
        ): void {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const action: any = e.action;

            // we only want to undo on GridEditAction
            if (action.dataItem === undefined) return;

            const binding = this._grid.provider.getColumn(action.col).binding;
            const oldValue = this._grid.features.dirtyMark.getOldValue(
                action.row,
                binding
            );
            this._triggerEventsFromColumn(
                action.row,
                binding,
                oldValue,
                action._oldState
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public get invalidRows(): Array<any> {
            return this._invalidRows;
        }

        public build(): void {
            this._grid.provider.cellEditEnded.addHandler(
                this._cellEditHandler.bind(this)
            );
            this._grid.provider.pastedCell.addHandler(
                this._cellEditHandler.bind(this)
            );
            this._grid.features.undoStack.stack.undoingAction.addHandler(
                this._undoingActionHandler.bind(this)
            );
            this._grid.features.undoStack.stack.redoingAction.addHandler(
                this._redoingActionHandler.bind(this)
            );
            // Future Implementation -> adding new rows will trigger this event
            // this._grid.addedRows.addHandler(
            //     this._addNewRowEndingHandler.bind(this)
            // );
            this._grid.provider.formatItem.addHandler(
                this._formatItems.bind(this)
            );
        }

        /** Clears all the validation mark metadata associated to the rows */
        public clear(): void {
            this._metadata.clearProperty(this._internalLabel);
            this._grid.provider.invalidate(); //Mark to be refreshed
        }

        /**
         * Gets the message associated to the validation error for a specific row.
         * @param rowNumber Number of the row to get the error message.
         * @param binding Binding of the column to complement the matching on the errorMessage map
         * @returns Error message of the row specified.
         */
        public errorMessage(rowNumber: number, binding: string): string {
            return this.getMetadata(rowNumber).errorMessage.get(binding);
        }

        /**
         * Gets the metadata associated to the validation marks for a specific row.
         * @param rowNumber Number of the row to check if there is any metadata associated to the validation marks.
         * @returns ValidationMarkInfo of the row specified.
         */
        public getMetadata(
            rowNumber: number
        ): OSFramework.Feature.Auxiliar.ValidationMarkInfo {
            if (!this.hasMetadata(rowNumber))
                this._metadata.setMetadata(
                    rowNumber,
                    this._internalLabel,
                    new OSFramework.Feature.Auxiliar.ValidationMarkInfo()
                );

            return this._metadata.getMetadata(
                rowNumber,
                this._internalLabel
            ) as OSFramework.Feature.Auxiliar.ValidationMarkInfo;
        }

        /**
         * Indicates if a specific row has any metadata associated to the validation marks.
         * @param rowNumber Number of the row to check if there is any metadata associated to the validation marks.
         * @returns Boolean that indicates whether a specific row has metadata associated to the validation marks.
         */
        public hasMetadata(rowNumber: number): boolean {
            return this._metadata.hasOwnProperty(
                rowNumber,
                this._internalLabel
            );
        }

        /**
         * Indicates if a specific cell value is valid or not by giving the row number and the binding.
         * @param rowNumber Number of the row to get the validation state.
         * @param binding Binding of the column to complement the matching on the validation map
         * @returns Boolean that indicates whether a specific cell is valid or not.
         */
        public isInvalid(rowNumber: number, binding: string): boolean {
            return (
                this.getMetadata(rowNumber).validation.get(binding) === false
            );
        }

        /**
         * Used to validate a cell by defining its metadata with a state that indicates if it is valid or not.
         * @param rowNumber Number of the row in which the action of validation should be triggered.
         * @param columnWidgetID ID of the Column block in which the action of validation should be triggered.
         * @param isValid Boolean that indicates whether the cell value meets a validation or data type rule. True, if the value conforms to the rule. False, otherwise.
         * @param errorMessage Message to be shown to the user when the value introduced is not valid.
         */
        public setStatus(
            rowNumber: number,
            columnWidgetID: string,
            isValid: boolean,
            errorMessage: string
        ): void {
            const column = GridAPI.ColumnManager.GetColumnById(columnWidgetID)
                .provider;

            // Sets the validation map by matching the binding of the columns with the boolean that indicates whether theres is an invalid cell in the row or not.
            this.getMetadata(rowNumber).validation.set(column.binding, isValid);

            // Sets the errorMessage map by matching the binding of the columns with the error that indicates the error of the validation to be shown when this one is not valid.
            this.getMetadata(rowNumber).errorMessage.set(
                column.binding,
                // If the error message is empty we want to return the message -> Invalid [Column Name]
                // Make sure all the end of lines from the error that comes from OS are replaced with <br>
                errorMessage !== ''
                    ? errorMessage.replace(/\n/g, '<br>')
                    : 'Invalid ' + column.header
            );

            // set invalidRows with row number and flag that checks if status isValid and if there are invalid values on metadata
            this._setInvalidRows(
                rowNumber,
                isValid && !this._isInvalidRow(rowNumber)
            );

            // Makes sure the grid gets refreshed after validation
            this._grid.provider.invalidate();
        }

        /**
         * Used to run the actions responsible for row validation per column.
         * Those actions might be included in the OnCellValueChange handler or in case the isMandatory column configuration is set.
         * @param {number} rowNumber Index of the row that contains the cells to be validated.
         */
        public validateRow(rowNumber: number): void {
            // Triggers the validation method per column
            this._grid
                .getColumns()
                .forEach((column: OSFramework.Column.IColumn) => {
                    // This method gets executed by an API. No values change in columns, so the current value and the original one (old value) are the same.
                    const currValue = this._grid.provider.getCellData(
                        rowNumber,
                        column.provider.index,
                        false
                    );
                    // Triggers the events of OnCellValueChange associated to a specific column in OS
                    this._triggerEventsFromColumn(
                        rowNumber,
                        column.provider.binding,
                        currValue,
                        currValue
                    );
                });
        }
    }
}