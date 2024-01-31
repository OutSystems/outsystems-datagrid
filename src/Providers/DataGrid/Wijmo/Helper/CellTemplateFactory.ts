// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Helper.CellTemplateFactory {
	/**
	 * Responsable for create the ActionColumn's cellTemplate
	 * @param type ActionColumn Type
	 * @param binding Column binding
	 * @param callback Callback to be invoked in the click event
	 */
	export function MakeCellTemplate(
		type: OSFramework.DataGrid.Enum.CellTemplateElementType,
		binding: string,
		callback: (item) => void,
		altText?: string,
		externalURL?: string
	): wijmo.grid.ICellTemplateFunction {
		let cellTemplate: wijmo.grid.ICellTemplateFunction;

		const hasFixedText = binding.startsWith('$');
		const hasExternalURL = externalURL?.toLocaleLowerCase().startsWith('http');

		const url = hasExternalURL ? externalURL : '${item.' + externalURL + '}';
		const text = hasFixedText ? binding.substring(1) : undefined;

		let imgAltText = '';
		if (altText !== undefined) {
			const hasFixedAltText = altText.startsWith('$');
			imgAltText = hasFixedAltText ? altText.substring(1) : '${item.' + altText + '}';
		}

		switch (type) {
			case OSFramework.DataGrid.Enum.CellTemplateElementType.Button:
				cellTemplate = wijmo.grid.cellmaker.CellMaker.makeButton({
					text,
					click: (e, ctx) => {
						callback(ctx);
					},
				});
				break;
			case OSFramework.DataGrid.Enum.CellTemplateElementType.Image:
				cellTemplate = wijmo.grid.cellmaker.CellMaker.makeImage({
					label: imgAltText,
					click: (e, ctx) => {
						callback(ctx);
					},
				});
				break;
			case OSFramework.DataGrid.Enum.CellTemplateElementType.Link: {
				// Set the object for Wijmo makeLink method call
				const cellTemplateOptions = {
					text,
					href: undefined,
					attributes: undefined,
					click: undefined,
				};

				// Validate if is a link and defined the default options
				if (externalURL === '') {
					cellTemplateOptions.click = (e, ctx) => {
						callback(ctx);
					};
				} else {
					cellTemplateOptions.href = url;
					cellTemplateOptions.attributes = {
						target: '_blank',
					};
				}

				// Set the Object with defined attributes based on validation
				cellTemplate = wijmo.grid.cellmaker.CellMaker.makeLink(cellTemplateOptions);

				break;
			}
			default:
				throw new Error(`There is no factory for this type of action column (${type})`);
		}

		return cellTemplate;
	}
}
