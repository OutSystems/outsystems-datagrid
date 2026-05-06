// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const getValueFromLine = (lineObj: any, arrayKeys: string[]): number => {
		const currKey = arrayKeys[0];
		if (arrayKeys.length === 1) return lineObj[currKey];
		return getValueFromLine(lineObj[currKey], arrayKeys.slice(1));
	};

	const resolveValue = (lineObj: unknown, value: string): number => {
		if (isNaN(parseFloat(value))) {
			return Number(getValueFromLine(lineObj, value.split('.')));
		}
		return Number(value);
	};

	function Evaluate(formula: OSFramework.DataGrid.OSStructure.Formula) {
		const fn: OSFramework.DataGrid.OSStructure.Functions = formula.function;

		switch (fn) {
			case OSFramework.DataGrid.OSStructure.Functions.Avg:
				//`(${parsedValues.join(' + ')}) / ${parsedValues.length}`;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return ($: any) => {
					const total = formula.values.reduce(
						(accumulation, value) => accumulation + resolveValue($, value),
						0
					);
					return Number((total / formula.values.length).toFixed(2));
				};
			case OSFramework.DataGrid.OSStructure.Functions.Diff:
				// parsedValues.join(' - ');
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return ($: any) => {
					const total = formula.values.reduce(
						(accumulation, value) => resolveValue($, value) - accumulation,
						0
					);
					return Number(total.toFixed(2));
				};
			case OSFramework.DataGrid.OSStructure.Functions.Div:
				// parsedValues.join(' / ');
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return ($: any) => {
					const total = formula.values.reduce(
						(accumulation, value, index) =>
							index === 0 ? resolveValue($, value) : accumulation / resolveValue($, value),
						0
					);
					return Number(total.toFixed(2));
				};
			case OSFramework.DataGrid.OSStructure.Functions.Max:
				// `Math.max(${parsedValues.join(', ')})`;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return ($: any) => {
					const total = formula.values.reduce(
						(accumulation, value) => Math.max(accumulation, resolveValue($, value)),
						Number.MIN_SAFE_INTEGER
					);
					return Number(total.toFixed(2));
				};
			case OSFramework.DataGrid.OSStructure.Functions.Min:
				// `Math.min(${parsedValues.join(', ')})`;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return ($: any) => {
					const total = formula.values.reduce(
						(accumulation, value) => Math.min(accumulation, resolveValue($, value)),
						Number.MAX_SAFE_INTEGER
					);
					return Number(total.toFixed(2));
				};
			case OSFramework.DataGrid.OSStructure.Functions.Mult:
				// parsedValues.join(' * ');
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return ($: any) => {
					const total = formula.values.reduce(
						(accumulation, value) => accumulation * resolveValue($, value),
						1
					);
					return Number(total.toFixed(2));
				};
			case OSFramework.DataGrid.OSStructure.Functions.Sum:
				// parsedValues.join(' + ');
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return ($: any) => {
					const total = formula.values.reduce(
						(accumulation, value) => accumulation + resolveValue($, value),
						0
					);
					return Number(total.toFixed(2));
				};
			default:
				return '';
		}
	}

	export class CalculatedField
		implements OSFramework.DataGrid.Feature.ICalculatedField, OSFramework.DataGrid.Interface.IBuilder
	{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _calculatedFields: any;
		private _grid: Grid.IGridWijmo;

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
									col.columnType === OSFramework.DataGrid.Enum.ColumnType.Currency ||
									col.columnType === OSFramework.DataGrid.Enum.ColumnType.Number
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

		public addFormula(binding: string, header: string, formula: OSFramework.DataGrid.OSStructure.Formula): void {
			this._validateValues(formula.values, header);

			this._calculatedFields[binding] = Evaluate(formula);
		}

		public build(): void {
			return;
		}

		public removeFormula(binding: string): void {
			if (this._calculatedFields.hasOwnProperty(binding)) delete this._calculatedFields[binding];
		}
	}
}
