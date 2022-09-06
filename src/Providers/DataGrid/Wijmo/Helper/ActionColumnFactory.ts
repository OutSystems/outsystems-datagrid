// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Helper.ActionColumnFactory {
    export function MakeActionColumnCellTemplate(
        type: OSFramework.DataGrid.Enum.ActionColumnType,
        binding: string,
        callback: (item) => void,
        extendedClass?: string,
        url?: string
    ): wijmo.grid.ICellTemplateFunction {
        let cellTemplate: wijmo.grid.ICellTemplateFunction;

        const hasFixedText = binding.charAt(0) === '$';
        const text = hasFixedText
            ? binding.substr(1)
            : '${item.' + binding + '}';

        switch (type) {
            case OSFramework.DataGrid.Enum.ActionColumnType.Button:
                cellTemplate = wijmo.grid.cellmaker.CellMaker.makeButton({
                    text,
                    click: (e, ctx) => {
                        callback(ctx);
                    },
                    cssClass: extendedClass ?? null
                });
                break;
            case OSFramework.DataGrid.Enum.ActionColumnType.Image:
                cellTemplate = wijmo.grid.cellmaker.CellMaker.makeImage({
                    label: text,
                    click: (e, ctx) => {
                        callback(ctx);
                    },
                    cssClass: extendedClass ?? null
                });
                break;
            case OSFramework.DataGrid.Enum.ActionColumnType.Link: {
                const options = url
                    ? {
                          href: url,
                          text,
                          cssClass: extendedClass ?? null,
                          attributes: {
                              target: '_blank',
                              rel: 'noopener noreferrer',
                              tabIndex: -1
                          }
                      }
                    : {
                          text,
                          click: (e, ctx) => {
                              callback(ctx);
                          },
                          cssClass: extendedClass ?? null
                      };

                cellTemplate = wijmo.grid.cellmaker.CellMaker.makeLink(options);
                break;
            }
            default:
                throw `There is no factory for this type of action column (${type})`;
        }

        return cellTemplate;
    }
}
