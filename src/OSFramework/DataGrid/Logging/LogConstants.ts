// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Logging.LogConstants {
	/* Three letters that identify this component in the exported logs. */
	export const ComponentCode = 'DGR';
	/* Default number of entries kept in memory. The oldest entries are discarded first. */
	export const DefaultCapacity = 500;
	/* Version of the shape of the exported lines. Increase it when the shape changes. */
	export const FormatVersion = 1;
	/* Maximum length of the serialized data of one entry. Longer data is replaced by a truncated preview. */
	export const MaxDataLength = 10000;
	/* sessionStorage key that keeps the active level across page reloads of the same browser tab. */
	export const StorageKey = 'outsystems-datagrid-log-level';
}
