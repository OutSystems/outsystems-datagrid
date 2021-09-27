// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    function Evaluate(formula: OSFramework.OSStructure.Formula) {
        let fn: OSFramework.OSStructure.Functions = formula.function;

        let parsedValues = formula.values.map((val) => {
            if (isNaN(parseInt(val))) return `$.${val}`;
            return val;
        });

        switch (fn) {
            case OSFramework.OSStructure.Functions.Avg:
                let vals = parsedValues.join(' + ');
                return `(${vals}) / ${parsedValues.length}`;
            case OSFramework.OSStructure.Functions.Diff:
                return parsedValues.join(' - ');
            case OSFramework.OSStructure.Functions.Div:
                return parsedValues.join(' / ');
            case OSFramework.OSStructure.Functions.Max:
                return `Math.max(${parsedValues.join(', ')})`;
            case OSFramework.OSStructure.Functions.Min:
                return `Math.min(${parsedValues.join(', ')})`;
            case OSFramework.OSStructure.Functions.Mult:
                return parsedValues.join(' * ');
            case OSFramework.OSStructure.Functions.Sum:
                return parsedValues.join(' + ');
            default:
                return '';
        }
    }

    export class CalculatedField
        implements
            OSFramework.Feature.ICalculatedField,
            OSFramework.Interface.IBuilder {
        private _grid: Grid.IGridWijmo;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _calculatedFields: any;

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
            this._calculatedFields = {};
        }

        private _validateValues(values, header) {
            const isValid = values
                .filter((val) => isNaN(parseInt(val)))
                .every(
                    (value) =>
                        this._grid
                            // get columns
                            .getColumns()
                            // filter number and currency only
                            .filter(
                                (col) =>
                                    col.columnType ===
                                        OSFramework.Enum.ColumnType.Currency ||
                                    col.columnType ===
                                        OSFramework.Enum.ColumnType.Number
                            )
                            // get binding
                            .map((col) => col.config.binding)
                            .indexOf(value) !== -1
                );

            if (!isValid) {
                throw `The content of ${header} column is not being displayed because the given formula is not valid. Formula values must be bindings to Currency or Number columns or numeric values written as text.
                Example: "Product.Price" or "10"`;
            }
        }

        public get calculatedFields(): boolean {
            return this._calculatedFields;
        }

        public addFormula(
            binding: string,
            header: string,
            formula: OSFramework.OSStructure.Formula
        ): void {
            this._validateValues(formula.values, header);

            this._calculatedFields[binding] = Evaluate(formula);
        }

        public removeFormula(binding: string) {
            if (this._calculatedFields.hasOwnProperty(binding))
                delete this._calculatedFields[binding];
        }

        public build(): void {
            return;
        }
    }
}
