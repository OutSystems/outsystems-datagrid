// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Helper.Constants {
	export enum CssClasses {
		CellClass = 'div.dg-cell',
		ColumnGroup = 'wj-colgroup',
		Tooltip = 'wj-tooltip',
		TooltipErrorValidation = 'errorValidation',
	}

	export enum ColumnProperty {
		// Expando key used to store the OutSystems column uniqueId on a Wijmo column instance.
		// Accessed exclusively through Helper.GetColumnUniqueId / Helper.SetColumnUniqueId.
		OSUniqueId = '__osUniqueId',
	}
}
