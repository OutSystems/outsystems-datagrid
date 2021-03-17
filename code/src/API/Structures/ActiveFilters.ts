// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.Structures {
    export class ActiveFilter {
        public binding: string;
        public columnId: string;
        public filterConditions: FilterCondition[];
        public filterShowValues: string[];
        public filterTypeId: string;

        constructor() {
            this.filterConditions = [];
            this.filterShowValues = [];
        }
    }

    export class FilterCondition {
        public and: boolean;
        public operatorTypeId: number;
        public value: string;
    }
}
