/// <reference path="../../OSFramework/OSStructure/changesDone.ts" />
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSStructure {
    export class GridChanges extends OSFramework.OSStructure.ChangesDone {
        hasInvalidLines: boolean;
        invalidLinesJSON: string;
    }
}
