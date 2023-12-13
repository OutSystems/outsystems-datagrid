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
        externalLink?: string
    ): wijmo.grid.ICellTemplateFunction {
        let cellTemplate: wijmo.grid.ICellTemplateFunction;

        const hasFixedText = binding.startsWith('$');
        const hasExternalURL = externalLink.substring(0, 4) === 'http';
        const url = hasExternalURL
            ? externalLink
            : '${item.' + externalLink + '}';
        const text = hasFixedText
            ? binding.substring(1)
            : '${item.' + binding + '}';

        let imgAltText = '';
        if (altText !== undefined) {
            const hasFixedAltText = altText.startsWith('$');
            imgAltText = hasFixedAltText
                ? altText.substring(1)
                : '${item.' + altText + '}';
        }

        switch (type) {
            case OSFramework.DataGrid.Enum.CellTemplateElementType.Button:
                cellTemplate = wijmo.grid.cellmaker.CellMaker.makeButton({
                    text,
                    click: (e, ctx) => {
                        callback(ctx);
                    }
                });
                break;
            case OSFramework.DataGrid.Enum.CellTemplateElementType.Image:
                cellTemplate = wijmo.grid.cellmaker.CellMaker.makeImage({
                    label: imgAltText,
                    click: (e, ctx) => {
                        callback(ctx);
                    }
                });
                break;
            case OSFramework.DataGrid.Enum.CellTemplateElementType.Link: {
                console.log('here', externalLink);

                if (externalLink !== '') {
                    cellTemplate = wijmo.grid.cellmaker.CellMaker.makeLink({
                        text: text,
                        href: url,
                        attributes: {
                            target: '_blank',
                            tabIndex: -1
                        }
                    });
                } else {
                    cellTemplate = wijmo.grid.cellmaker.CellMaker.makeLink({
                        text,
                        click: (e, ctx) => {
                            callback(ctx);
                        }
                    });
                }
                break;
            }
            default:
                throw new Error(
                    `There is no factory for this type of action column (${type})`
                );
        }

        return cellTemplate;
    }
}
