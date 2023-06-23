// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Helper.ActionColumnFactory {
    /**
     * Responsable for create the ActionColumn's cellTemplate
     * @param type ActionColumn Type
     * @param binding Column binding
     * @param callback Callback to be invoked in the click event
     */
    export function MakeActionColumnCellTemplate(
        type: OSFramework.DataGrid.Enum.ActionColumnElementType,
        binding: string,
        externalURL: string,
        callback: (item) => void
    ): wijmo.grid.ICellTemplateFunction {
        let cellTemplate: wijmo.grid.ICellTemplateFunction;

        const hasFixedText = binding.charAt(0) === '$';
        const hasExternalURL = externalURL.substring(0, 4) === 'http';
        const text = hasFixedText
            ? binding.substring(1)
            : '${item.' + binding + '}';
        const url = hasExternalURL
            ? externalURL
            : '${item.' + externalURL + '}';

        switch (type) {
            case OSFramework.DataGrid.Enum.ActionColumnElementType.Button:
                cellTemplate = wijmo.grid.cellmaker.CellMaker.makeButton({
                    text: text,
                    click: (e, ctx) => {
                        callback(ctx);
                    }
                });
                break;
            case OSFramework.DataGrid.Enum.ActionColumnElementType.Link:
                cellTemplate = wijmo.grid.cellmaker.CellMaker.makeLink({
                    text: text,
                    click: (e, ctx) => {
                        callback(ctx);
                    }
                });
                break;
            case OSFramework.DataGrid.Enum.ActionColumnElementType.ExternalURL:
                cellTemplate = wijmo.grid.cellmaker.CellMaker.makeLink({
                    text: text,
                    href: url,
                    attributes: {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        tabIndex: -1
                    }
                });
                break;
            default:
                throw new Error(
                    `There is no factory for this type of action column (${type})`
                );
        }

        return cellTemplate;
    }
}
