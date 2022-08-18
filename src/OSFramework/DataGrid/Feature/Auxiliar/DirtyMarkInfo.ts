// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature.Auxiliar {
    export class DirtyMarksInfo {
        public isDirtyRow: boolean;
        public isNew: boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public originalValues: Map<string, any>;

        constructor() {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.originalValues = new Map<string, any>();
        }
    }
}
