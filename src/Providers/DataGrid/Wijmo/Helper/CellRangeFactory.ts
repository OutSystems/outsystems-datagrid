// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Helper.CellRangeFactory {
    /**
     * Internal class used to build a Provider range into a CellRange
     */
    export function MakeFromProviderCellRange(
        cellRange: wijmo.grid.CellRange
    ): OSFramework.DataGrid.OSStructure.CellRange {
        const range = new OSFramework.DataGrid.OSStructure.CellRange();
        range.topRowIndex = cellRange.topRow;
        range.leftColumnIndex = cellRange.leftCol;
        range.bottomRowIndex = cellRange.bottomRow;
        range.rightColumnIndex = cellRange.rightCol;

        return range;
    }

    export function MakeFromCoordinates(
        topRow: number,
        leftColumn: number,
        bottomRow?: number,
        rightColumn?: number
    ): OSFramework.DataGrid.OSStructure.CellRange {
        const range = new OSFramework.DataGrid.OSStructure.CellRange();
        range.topRowIndex = topRow;
        range.leftColumnIndex = leftColumn;
        range.bottomRowIndex = bottomRow !== undefined ? bottomRow : topRow;
        range.rightColumnIndex =
            rightColumn !== undefined ? rightColumn : leftColumn;

        return range;
    }
}
