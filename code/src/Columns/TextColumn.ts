// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Column {
    export class TextColumn extends AbstractProviderColumn<ColumnConfigText> {
        constructor(grid: Grid.IGrid, columnID: string, configs: JSON) {
            super(grid, columnID, new ColumnConfigText(configs));
        }

        public get columnType(): ColumnType {
            return ColumnType.Text;
        }

        public get providerType(): wijmo.DataType {
            return wijmo.DataType.String;
        }
    }
}
