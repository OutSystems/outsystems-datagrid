// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.Structures {
    export class ActiveFilter {
        public binding: string;
        public columnId: string;
        public filterConditions: Array<FilterCondition>;
        public filterShowValues: Array<string>;
        public filterTypeId: string;

        constructor() {
            this.filterConditions = new Array<FilterCondition>();
            this.filterShowValues = new Array<string>();
        }
    }
}
