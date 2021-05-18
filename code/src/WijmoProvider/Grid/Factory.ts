// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Grid {
    export namespace GridFactory {
        export function MakeGrid(
            type: OSFramework.Enum.GridType,
            gridID: string,
            configs: OSFramework.Configuration.IConfiguration
        ): OSFramework.Grid.IGrid {
            switch (type) {
                case OSFramework.Enum.GridType.FlexGrid:
                    return new FlexGrid(
                        gridID,
                        configs as OSFramework.Configuration.Grid.FlexGridConfig
                    );
                default:
                    throw `There is no factory for this type of grid (${type})`;
            }
        }
    }
}
