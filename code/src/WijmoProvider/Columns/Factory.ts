// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Column {
    export namespace ColumnFactory {
        export function MakeColumn(
            grid: OSFramework.Grid.IGrid,
            type: OSFramework.Enum.ColumnType,
            columnID: string,
            configs: JSON,
            editorConfigs: JSON
        ): OSFramework.Column.IColumn {
            switch (type) {
                case OSFramework.Enum.ColumnType.Action:
                    return new ActionColumn(grid, columnID, configs);
                case OSFramework.Enum.ColumnType.Checkbox:
                    return new CheckboxColumn(grid, columnID, configs);
                case OSFramework.Enum.ColumnType.Currency:
                    return new CurrencyColumn(
                        grid,
                        columnID,
                        configs,
                        new OSFramework.Configuration.Column.EditorConfigCurrency(
                            editorConfigs
                        )
                    );
                case OSFramework.Enum.ColumnType.Date:
                    return new DateColumn(
                        grid,
                        columnID,
                        configs,
                        editorConfigs
                    );
                case OSFramework.Enum.ColumnType.DateTime:
                    return new DateTimeColumn(
                        grid,
                        columnID,
                        configs,
                        editorConfigs
                    );
                case OSFramework.Enum.ColumnType.Dropdown:
                    return new DropdownColumn(
                        grid,
                        columnID,
                        configs,
                        editorConfigs
                    );
                case OSFramework.Enum.ColumnType.Group:
                    return new GroupColumn(
                        grid,
                        columnID,
                        configs,
                        editorConfigs
                    );
                case OSFramework.Enum.ColumnType.Number:
                    return new NumberColumn(
                        grid,
                        columnID,
                        configs,
                        new OSFramework.Configuration.Column.EditorConfigNumber(
                            editorConfigs
                        )
                    );
                case OSFramework.Enum.ColumnType.Text:
                    return new TextColumn(grid, columnID, configs);
                default:
                    throw `There is no factory for this type of column (${type})`;
            }
        }
    }
}
