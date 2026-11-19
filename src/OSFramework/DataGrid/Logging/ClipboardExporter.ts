// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Logging {
	/**
	 * Copies text to the clipboard.
	 *
	 * @export
	 * @class ClipboardExporter
	 */
	export class ClipboardExporter {
		/**
		 * Copies the text to the clipboard. The clipboard can be unavailable (page without HTTPS, document
		 * without focus, some webviews), in which case the text is printed in the console instead.
		 *
		 * @param {string} text Text to copy.
		 * @returns {*}  {Promise<boolean>} True if the text reached the clipboard, false if it was printed instead.
		 * @memberof ClipboardExporter
		 */
		public async copy(text: string): Promise<boolean> {
			try {
				await navigator.clipboard.writeText(text);
				return true;
			} catch {
				console.log(text);
				return false;
			}
		}
	}
}
