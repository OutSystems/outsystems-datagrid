/// <reference path="./NumberColumn.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Column {
    export class CurrencyColumn extends NumberColumn<EditorConfigCurrency> {
        constructor(
            grid: OSFramework.Grid.IGrid,
            columnID: string,
            configs: JSON,
            editorConfig: EditorConfigCurrency
        ) {
            super(grid, columnID, configs, editorConfig);
            this._columnEvents = new OSFramework.Event.Column.ColumnEventsManager(this);
        }

        protected _setFormat(decimalPlaces: number, symbol?: string): void {
            //The supper will calculate the Min and Max and validate decimalPlaces
            super._setFormat(decimalPlaces);

            this.config.format = `c${this.editorConfig.decimalPlaces} ${
                symbol || this.editorConfig.symbol
            }`;
            this.editorConfig.format = this.config.format;
        }

        /** Returns all the events associated to the column */
        public get columnEvents(): OSFramework.Event.Column.ColumnEventsManager {
            return this._columnEvents;
        }

        public get columnType(): OSFramework.Enum.ColumnType {
            return ColumnType.Currency;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
        public changeProperty(propertyName: string, propertyValue: any): void {
            switch (propertyName) {
                case 'symbol':
                    this._setFormat(
                        this.editorConfig.decimalPlaces,
                        propertyValue
                    );
                    this.applyConfigs();
                    break;
                default:
                    super.changeProperty(propertyName, propertyValue);
            }
        }
    }
}
