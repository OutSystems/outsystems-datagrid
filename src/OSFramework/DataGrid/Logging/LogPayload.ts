// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Logging {
	/**
	 * Function that returns the data to be logged. It is only called when the message is going to be recorded,
	 * so the cost of building the data is not paid while logging is off or below the message level.
	 */
	export type LogPayload = () => unknown;
}
