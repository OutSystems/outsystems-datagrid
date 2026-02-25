// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
	export class CellDataSanitizer
		implements OSFramework.DataGrid.Feature.ICellDataSanitizer, OSFramework.DataGrid.Interface.IBuilder
	{
		// Characters that can trigger CSV injection by being interpreted as formula starts in spreadsheet applications (Excel, LibreOffice, etc.)
		private readonly _dangerousStarts = ['=', '+', '-', '@'];
		private readonly _grid: Grid.IGridWijmo;

		constructor(grid: Grid.IGridWijmo) {
			this._grid = grid;
		}

		public build(): void {
			// Callback for when the grid is being exported to CSV.
			// Made available in the Wijmo 2025 v2 (Build 5.20252.42).
			this._grid.provider.gettingCellClipString.addHandler(
				(s: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) => {
					e.data = this.escapeCsvInjection(e.data);
				}
			);
		}

		/**
		 * Mitigates CSV/Excel formula injection by neutralizing values that could be
		 * interpreted as formulas by spreadsheet applications.
		 *
		 * A value is considered dangerous if it starts with any of the characters
		 * defined in `_dangerousStarts` (`=`, `+`, `-`, `@`), either directly, inside
		 * an initial double-quoted field (e.g. `"=1+1"`), or immediately after a
		 * tab, newline, or carriage-return character within the string.
		 *
		 * Escaping strategy:
		 * - If the string starts with a dangerous character (e.g. `=1+1`), a single
		 *   quote (`'`) is prepended (resulting in `'=1+1`), so the value is treated
		 *   as literal text by most CSV/Excel consumers.
		 * - If the string starts with a double quote followed by a dangerous
		 *   character (e.g. `"=1+1"`), a single quote is inserted after the opening
		 *   quote (resulting in `"'=1+1"`).
		 * - If a dangerous character appears immediately after a tab, newline, or
		 *   carriage-return character, a single quote is inserted between the
		 *   whitespace and the dangerous character (e.g. `\n=1+1` becomes
		 *   `\n'=1+1`).
		 *
		 * This function does not perform general CSV quoting/escaping; it only
		 * addresses formula-like patterns to reduce the risk of CSV injection.
		 *
		 * @param cellString Raw cell content to be exported to CSV. If this value is
		 *        falsy (e.g. empty string), it is returned as-is without modification.
		 * @returns The sanitized string with potentially dangerous formula prefixes
		 *          neutralized, or the original falsy value (such as `''` or `null`)
		 *          unchanged.
		 */
		public escapeCsvInjection(cellString: string): string | null {
			if (!cellString) return cellString;

			// Prefix values that start with dangerous characters with a single quote to prevent CSV injection
			const needEscape = this._dangerousStarts.some((char) => cellString.startsWith(char));
			if (needEscape) {
				cellString = `'${cellString}`;
			}

			// Also handle values that start with a quote followed by a dangerous character
			const containsQuote = this._dangerousStarts.some((char) => cellString.startsWith('"' + char));
			if (containsQuote) {
				cellString = cellString.replace(/^"([=+\-@])/, (match, $1) => '"\'' + $1);
			}

			// Also handle values that start with a quote followed by a dangerous character
			const containsWrap = /[\t\n\r]/.test(cellString);
			if (containsWrap) {
				cellString = cellString.replace(/([\t\n\r])([=+\-@])/g, (match, $1, $2) => $1 + "'" + $2);
			}

			return cellString;
		}
	}
}
