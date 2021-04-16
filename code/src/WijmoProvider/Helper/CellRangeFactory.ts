/**
 * Internal class used to build a Provider range into a CellRange
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace CellRangeFactory {
    export function MakeFromProviderCellRange(
        cellRange: wijmo.grid.CellRange
    ): GridAPI.Structures.CellRange {
        const range = new GridAPI.Structures.CellRange();
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
    ): GridAPI.Structures.CellRange {
        const range = new GridAPI.Structures.CellRange();
        range.topRowIndex = topRow;
        range.leftColumnIndex = leftColumn;
        range.bottomRowIndex = bottomRow !== undefined ? bottomRow : topRow;
        range.rightColumnIndex =
            rightColumn !== undefined ? rightColumn : leftColumn;

        return range;
    }
}
