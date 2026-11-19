/// <reference path="Logger.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Logging {
	/**
	 * The single logger shared by every Grid on the page.
	 */
	export const Log = new Logger(
		new SessionLogSettings(LogConstants.StorageKey),
		new LogBuffer(LogConstants.DefaultCapacity),
		new LogSerializer(),
		new ClipboardExporter()
	);
}
