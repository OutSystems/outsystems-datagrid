namespace Providers.DataGrid.Wijmo.Column {
    function _columnGeneratorInternal(
        grid: OSFramework.DataGrid.Grid.IGrid,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata: any,
        parentRecord = '',
        allowEdit: boolean
    ): OSFramework.DataGrid.Column.IColumn[] {
        const _createdHeaders = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const _editorConfigs: OSFramework.DataGrid.Types.IColumnExtraConfigs =
            {};
        let columnType: OSFramework.DataGrid.Enum.ColumnType;
        let createdColumns: OSFramework.DataGrid.Column.IColumn[] = [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let _configs: any;

        Object.keys(metadata).forEach((key) => {
            _configs = { binding: '', header: '', autoGenerated: true };
            if (typeof metadata[key] === 'string' || metadata.length === 0) {
                switch (metadata[key].toLowerCase()) {
                    case 'int32':
                    case 'int64':
                        columnType =
                            OSFramework.DataGrid.Enum.ColumnType.Number;
                        break;
                    case 'decimal':
                        columnType =
                            OSFramework.DataGrid.Enum.ColumnType.Number;
                        // If the column is autogenerated and is decimal, we want to force 2 decimal places
                        (
                            _editorConfigs as OSFramework.DataGrid.Types.INumberColumnExtraConfigs
                        ).decimalPlaces = 2;
                        break;
                    case 'boolean':
                        columnType =
                            OSFramework.DataGrid.Enum.ColumnType.Checkbox;
                        break;
                    case 'datetime':
                        columnType =
                            OSFramework.DataGrid.Enum.ColumnType.DateTime;
                        break;
                    case 'date':
                        columnType = OSFramework.DataGrid.Enum.ColumnType.Date;
                        break;
                    case 'byte[]':
                        //rug: going to ignore for now, binary data columns.
                        columnType = undefined;
                    // eslint-disable-next-line no-fallthrough
                    case 'string':
                    default:
                        columnType = OSFramework.DataGrid.Enum.ColumnType.Text;
                }
                if (columnType !== undefined) {
                    _configs.header = key;
                    _configs.binding = parentRecord + key;
                    _configs.allowEdit = allowEdit;

                    if (_createdHeaders.indexOf(_configs.header) !== -1) {
                        _configs.header = _configs.binding;
                    }
                    _createdHeaders.push(_configs.header);

                    createdColumns.push(
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        Providers.DataGrid.Wijmo.Column.ColumnFactory.MakeColumn(
                            grid,
                            columnType,
                            parentRecord + key,
                            _configs,
                            _editorConfigs
                        )
                    );
                }
            } else {
                createdColumns = createdColumns.concat(
                    _columnGeneratorInternal(
                        grid,
                        metadata[key],
                        key + '.',
                        allowEdit
                    )
                );
            }
        });
        _createdHeaders.length = 0;
        return createdColumns;
    }

    export class ColumnGenerator
        implements OSFramework.DataGrid.Column.IColumnGenerator
    {
        public generate(
            grid: OSFramework.DataGrid.Grid.IGrid,
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
            metadata: any,
            allowEdit: boolean
        ): OSFramework.DataGrid.Column.IColumn[] {
            return _columnGeneratorInternal(grid, metadata, '', allowEdit);
        }
    }
}