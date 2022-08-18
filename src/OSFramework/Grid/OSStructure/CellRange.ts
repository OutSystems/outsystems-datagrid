// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSStructure {
    /**
     * Representation of a generic range
     * Used to express selections, defining start and end
     */
    export class CellRange {
        public bottomRowIndex: number;
        public leftColumnIndex: number;
        public rightColumnIndex: number;
        public topRowIndex: number;
    }
}
