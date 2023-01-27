// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Helper.CellTemplateFactory {
    export function MakeCellTemplate(
        binding: string,
        callback: (item) => void,
        options:
            | OSFramework.DataGrid.Types.IRatingColumnExtraConfigs
            | OSFramework.DataGrid.Types.IActionColumnExtraConfigs
            | OSFramework.DataGrid.Types.IImageColumnExtraConfigs
            | OSFramework.DataGrid.Types.ISparklineColumnExtraConfigs
    ): wijmo.grid.ICellTemplateFunction {
        let cellTemplate: wijmo.grid.ICellTemplateFunction;

        const hasFixedText = binding.charAt(0) === '$';
        const text = hasFixedText
            ? binding.substring(1)
            : '${item.' + binding + '}';

        switch (options.cellTemplateType) {
            case OSFramework.DataGrid.Enum.CellTemplateType.Button:
                cellTemplate = wijmo.grid.cellmaker.CellMaker.makeButton({
                    text,
                    click: (e, ctx) => {
                        callback(ctx);
                    },
                    cssClass: options.extendedClass ?? null
                });
                break;
            case OSFramework.DataGrid.Enum.CellTemplateType.Image:
                cellTemplate = wijmo.grid.cellmaker.CellMaker.makeImage({
                    label: text,
                    click: (e, ctx) => {
                        callback(ctx);
                    },
                    cssClass: options.extendedClass ?? null
                });
                break;
            case OSFramework.DataGrid.Enum.CellTemplateType.Link: {
                const opt = options.url
                    ? {
                          href: options.url,
                          text,
                          cssClass: options.extendedClass ?? null,
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
                          cssClass: options.extendedClass ?? null
                      };

                cellTemplate = wijmo.grid.cellmaker.CellMaker.makeLink(opt);
                break;
            }
            case OSFramework.DataGrid.Enum.CellTemplateType.Rating:
                cellTemplate = wijmo.grid.cellmaker.CellMaker.makeRating({
                    label: options.label,
                    range: [0, options.maxRating],
                    cssClass: options.extendedClass ?? null,
                    click: (e, ctx) => {
                        callback(ctx);
                    }
                });
                break;
            case OSFramework.DataGrid.Enum.CellTemplateType.Sparkline:
                cellTemplate = wijmo.grid.cellmaker.CellMaker.makeSparkline({
                    type: options.type,
                    markers: options.markers, // add markers
                    //maxPoints: options., // limit number of points
                    label: options.label, // accessibility
                    cssClass: options.extendedClass ?? null,
                    click: (e, ctx) => {
                        callback(ctx);
                    }
                });
                break;
            default:
                throw `There is no factory for this type of action column (${
                    options['cellTemplateType'] as string
                })`;
        }

        return cellTemplate;
    }
}
