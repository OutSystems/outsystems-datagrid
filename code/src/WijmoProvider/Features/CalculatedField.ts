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
            OSFramework.Interface.IBuilder
    {
        private _grid: Grid.IGridWijmo;
        private _calculatedFields: any;

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
            this._calculatedFields = {};
        }

        public get calculatedFields(): boolean {
            return this._calculatedFields;
        }

        public addFormula(
            binding: string,
            formula: OSFramework.OSStructure.Formula
        ): void {
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
