// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSStructure {
    export enum Sorting {
        Ascending = 'ASC',
        Descending = 'DESC'
    }

    export class ActiveSort {
        public binding: string;
        public columnId: string;
        public sorting: Sorting;
    }
}
