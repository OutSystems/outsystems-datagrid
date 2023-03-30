// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Helper.ActionColumnFactory {
    /**
     * Responsable for create the ActionColumn's cellTemplate
     * @param type ActionColumn Type
     * @param binding Column binding
     * @param callback Callback to be invoked in the click event
     */
    export function MakeActionColumnCellTemplate(
        type: OSFramework.DataGrid.Enum.ActionColumnType,
        binding: string,
        callback: (item) => void
    ): wijmo.grid.ICellTemplateFunction {
        let cellTemplate: wijmo.grid.ICellTemplateFunction;

        const hasFixedText = binding.charAt(0) === '$';
        const text = hasFixedText
            ? binding.substring(1)
            : '${item.' + binding + '}';

        switch (type) {
            case OSFramework.DataGrid.Enum.ActionColumnType.Button:
                cellTemplate = wijmo.grid.cellmaker.CellMaker.makeButton({
                    text,
                    click: (e, ctx) => {
                        callback(ctx);
                    }
                });
                break;
            case OSFramework.DataGrid.Enum.ActionColumnType.Link: {
                cellTemplate = wijmo.grid.cellmaker.CellMaker.makeLink({
                    text,
                    click: (e, ctx) => {
                        callback(ctx);
                    }
                });
                break;
            }
            default:
                throw `There is no factory for this type of action column (${type})`;
        }

        return cellTemplate;
    }
}
