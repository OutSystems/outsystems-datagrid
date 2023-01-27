// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Column {
    export namespace ColumnFactory {
        export function MakeColumn(
            grid: OSFramework.DataGrid.Grid.IGrid,
            type: OSFramework.DataGrid.Enum.ColumnType,
            columnID: string,
            configs: OSFramework.DataGrid.Types.IColumnConfigs,
            extraConfigs: OSFramework.DataGrid.Types.IColumnExtraConfigs
        ): OSFramework.DataGrid.Column.IColumn {
            switch (type) {
                case OSFramework.DataGrid.Enum.ColumnType.Action:
                    return new ActionColumn(
                        grid,
                        columnID,
                        configs,
                        extraConfigs as OSFramework.DataGrid.Types.IActionColumnExtraConfigs
                    );
                case OSFramework.DataGrid.Enum.ColumnType.Image:
                    return new ImageColumn(
                        grid,
                        columnID,
                        configs,
                        extraConfigs as OSFramework.DataGrid.Types.IImageColumnExtraConfigs
                    );
                case OSFramework.DataGrid.Enum.ColumnType.Rating:
                    return new RatingColumn(
                        grid,
                        columnID,
                        configs,
                        extraConfigs as OSFramework.DataGrid.Types.IRatingColumnExtraConfigs
                    );
                case OSFramework.DataGrid.Enum.ColumnType.Sparkline:
                    return new SparklineColumn(
                        grid,
                        columnID,
                        configs,
                        extraConfigs as OSFramework.DataGrid.Types.ISparklineColumnExtraConfigs
                    );
                case OSFramework.DataGrid.Enum.ColumnType.Checkbox:
                    return new CheckboxColumn(
                        grid,
                        columnID,
                        configs,
                        extraConfigs as OSFramework.DataGrid.Types.ICheckboxColumnExtraConfigs
                    );
                case OSFramework.DataGrid.Enum.ColumnType.Currency:
                    return new CurrencyColumn(
                        grid,
                        columnID,
                        configs,
                        new OSFramework.DataGrid.Configuration.Column.EditorConfigCurrency(
                            extraConfigs as OSFramework.DataGrid.Types.ICurrencyColumnExtraConfigs
                        )
                    );
                case OSFramework.DataGrid.Enum.ColumnType.Date:
                    return new DateColumn(
                        grid,
                        columnID,
                        configs,
                        extraConfigs as OSFramework.DataGrid.Types.IDateColumnExtraConfigs
                    );
                case OSFramework.DataGrid.Enum.ColumnType.DateTime:
                    return new DateTimeColumn(
                        grid,
                        columnID,
                        configs,
                        extraConfigs as OSFramework.DataGrid.Types.IDateColumnExtraConfigs
                    );
                case OSFramework.DataGrid.Enum.ColumnType.Dropdown:
                    return new DropdownColumn(
                        grid,
                        columnID,
                        configs,
                        extraConfigs as OSFramework.DataGrid.Types.IDropdownColumnExtraConfigs
                    );
                case OSFramework.DataGrid.Enum.ColumnType.Group:
                    return new GroupColumn(
                        grid,
                        columnID,
                        configs,
                        extraConfigs as OSFramework.DataGrid.Types.IGroupColumnExtraConfigs
                    );
                case OSFramework.DataGrid.Enum.ColumnType.Number:
                    return new NumberColumn(
                        grid,
                        columnID,
                        configs,
                        new OSFramework.DataGrid.Configuration.Column.EditorConfigNumber(
                            extraConfigs as OSFramework.DataGrid.Types.INumberColumnExtraConfigs
                        )
                    );
                case OSFramework.DataGrid.Enum.ColumnType.Calculated:
                    return new CalculatedColumn(
                        grid,
                        columnID,
                        configs,
                        extraConfigs as OSFramework.DataGrid.Types.ICalculatedColumnExtraConfigs
                    );
                case OSFramework.DataGrid.Enum.ColumnType.Text:
                    return new TextColumn(
                        grid,
                        columnID,
                        configs,
                        extraConfigs as OSFramework.DataGrid.Types.ITextColumnExtraConfigs
                    );
                default:
                    throw new Error(
                        `There is no factory for this type of column (${type})`
                    );
            }
        }
    }
}
