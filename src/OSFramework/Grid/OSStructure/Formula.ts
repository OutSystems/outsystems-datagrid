// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSStructure {
    export enum Functions {
        Avg = 'Avg',
        Diff = 'Diff',
        Div = 'Div',
        Max = 'Max',
        Min = 'Min',
        Mult = 'Mult',
        Sum = 'Sum'
    }

    export class Formula {
        public function: Functions;
        public values: Array<string>;

        constructor() {
            this.values = new Array<string>();
        }
    }
}
