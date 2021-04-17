// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Grid {
    export namespace GridFactory {
        export function MakeGrid(
            type: GridType,
            gridID: string,
            configs: IConfiguration
        ): IGrid {
            switch (type) {
                case GridType.FlexGrid:
                    return new FlexGrid(gridID, configs as FlexGridConfig);
                default:
                    throw `There is no factory for this type of grid (${type})`;
            }
        }
    }
}
