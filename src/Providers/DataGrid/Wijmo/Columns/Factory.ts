// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Column {
    export namespace ColumnFactory {
        export function MakeColumn(
            grid: OSFramework.DataGrid.Grid.IGrid,
            type: OSFramework.DataGrid.Enum.ColumnType,
            columnID: string,
            configs: JSON,
            extraConfigs: JSON
        ): OSFramework.DataGrid.Column.IColumn {
            switch (type) {
                case OSFramework.DataGrid.Enum.ColumnType.Action:
                    return new ActionColumn(grid, columnID, configs);
                case OSFramework.DataGrid.Enum.ColumnType.Checkbox:
                    return new CheckboxColumn(
                        grid,
                        columnID,
                        configs,
                        extraConfigs
                    );
                case OSFramework.DataGrid.Enum.ColumnType.Currency:
                    return new CurrencyColumn(
                        grid,
                        columnID,
                        configs,
                        new OSFramework.DataGrid.Configuration.Column.EditorConfigCurrency(
                            extraConfigs
                        )
                    );
                case OSFramework.DataGrid.Enum.ColumnType.Date:
                    return new DateColumn(
                        grid,
                        columnID,
                        configs,
                        extraConfigs
                    );
                case OSFramework.DataGrid.Enum.ColumnType.DateTime:
                    return new DateTimeColumn(
                        grid,
                        columnID,
                        configs,
                        extraConfigs
                    );
                case OSFramework.DataGrid.Enum.ColumnType.Dropdown:
                    return new DropdownColumn(
                        grid,
                        columnID,
                        configs,
                        extraConfigs
                    );
                case OSFramework.DataGrid.Enum.ColumnType.Group:
                    return new GroupColumn(
                        grid,
                        columnID,
                        configs,
                        extraConfigs
                    );
                case OSFramework.DataGrid.Enum.ColumnType.Number:
                    return new NumberColumn(
                        grid,
                        columnID,
                        configs,
                        new OSFramework.DataGrid.Configuration.Column.EditorConfigNumber(
                            extraConfigs
                        )
                    );
                case OSFramework.DataGrid.Enum.ColumnType.Calculated:
                    return new CalculatedColumn(
                        grid,
                        columnID,
                        configs,
                        extraConfigs
                    );
                case OSFramework.DataGrid.Enum.ColumnType.Text:
                    return new TextColumn(
                        grid,
                        columnID,
                        configs,
                        extraConfigs
                    );
                default:
                    throw `There is no factory for this type of column (${type})`;
            }
        }
    }
}
