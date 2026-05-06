// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
	// The function is recursive to support obtaining the value of nested properties,
	// like "Product.Price" or "Product.Struct.Value".
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const getValueFromLine = (lineObj: any, arrayKeys: string[]): number => {
		const currKey = arrayKeys[0];
		if (arrayKeys.length === 1) return lineObj[currKey];
		return getValueFromLine(lineObj[currKey], arrayKeys.slice(1));
	};

	// This function orchestrates the retrieval of the value of the formula.
	// If the value is a number, it will return the number.
	// If the value is a string, it will invoke getValueFromLine function
	// to retrieve the value of the cell.
	const resolveValue = (lineObj: unknown, value: string): number => {
		if (isNaN(parseFloat(value))) {
			return Number(getValueFromLine(lineObj, value.split('.')));
		}
		return Number(value);
	};

	// This function will return a function will be be used by wijmo,
	// to calculate the value of the cell in the calculated column. CSP safe.
	function Evaluate(formula: OSFramework.DataGrid.OSStructure.Formula): ($: unknown) => number | string {
		const fn: OSFramework.DataGrid.OSStructure.Functions = formula.function;

		switch (fn) {
			case OSFramework.DataGrid.OSStructure.Functions.Avg:
				//`(${parsedValues.join(' + ')}) / ${parsedValues.length}`;
				return ($: unknown) => {
					const total = Number(
						formula.values.reduce((accumulation, value) =>
							(resolveValue($, accumulation) + resolveValue($, value)).toString()
						)
					);
					return Number((total / formula.values.length).toFixed(2));
				};
			case OSFramework.DataGrid.OSStructure.Functions.Diff:
				// parsedValues.join(' - ');
				return ($: unknown) => {
					const total = Number(
						formula.values.reduce((accumulation, value) =>
							(resolveValue($, accumulation) - resolveValue($, value)).toString()
						)
					);
					return Number(total.toFixed(2));
				};
			case OSFramework.DataGrid.OSStructure.Functions.Div:
				// parsedValues.join(' / ');
				return ($: unknown) => {
					const total = Number(
						formula.values.reduce((accumulation, value) =>
							(resolveValue($, accumulation) / resolveValue($, value)).toString()
						)
					);
					return Number(total.toFixed(2));
				};
			case OSFramework.DataGrid.OSStructure.Functions.Max:
				// `Math.max(${parsedValues.join(', ')})`;
				return ($: unknown) => {
					const total = Number(
						formula.values.reduce((accumulation, value) =>
							Math.max(resolveValue($, accumulation), resolveValue($, value)).toString()
						)
					);
					return Number(total.toFixed(2));
				};
			case OSFramework.DataGrid.OSStructure.Functions.Min:
				// `Math.min(${parsedValues.join(', ')})`;
				return ($: unknown) => {
					const total = Number(
						formula.values.reduce((accumulation, value) =>
							Math.min(resolveValue($, accumulation), resolveValue($, value)).toString()
						)
					);
					return total;
				};
			case OSFramework.DataGrid.OSStructure.Functions.Mult:
				// parsedValues.join(' * ');
				return ($: unknown) => {
					const total = Number(
						formula.values.reduce((accumulation, value) =>
							(resolveValue($, accumulation) * resolveValue($, value)).toString()
						)
					);
					return total;
				};
			case OSFramework.DataGrid.OSStructure.Functions.Sum:
				// parsedValues.join(' + ');
				return ($: unknown) => {
					const total = Number(
						formula.values.reduce((accumulation, value) =>
							(resolveValue($, accumulation) + resolveValue($, value)).toString()
						)
					);
					return total;
				};
			default:
				return () => '';
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

		private _validateValues(values: string[], header: string): void {
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

		public get calculatedFields(): object {
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
