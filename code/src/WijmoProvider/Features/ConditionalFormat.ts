// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    enum NumberRules {
        GreaterOrEqualsTo = '>=',
        GreaterThan = '>',
        Equals = '===',
        LessOrEqualsTo = '<=',
        LessThan = '<',
        NotEquals = '!=='
    }

    function Evaluate(operator, comparedValue, cellValue) {
        switch (operator) {
            case NumberRules.GreaterOrEqualsTo:
                return cellValue >= comparedValue;
            case NumberRules.GreaterThan:
                return cellValue > comparedValue;
            case NumberRules.Equals:
                return comparedValue === cellValue;
            case NumberRules.NotEquals:
                return comparedValue !== cellValue;
            case NumberRules.LessOrEqualsTo:
                return cellValue <= comparedValue;
            case NumberRules.LessThan:
                return cellValue < comparedValue;
            default:
                break;
        }
    }

    class Condition {
        public condition: NumberRules;
        public value: any;

        constructor(condition: NumberRules, value: any) {
            this.condition = condition;
            this.value = value;
        }
    }

    class ConditionAnd {
        public cssClass: string;
        public rules: Array<Condition>;

        constructor(cssClass: string, rules: Array<Condition>) {
            this.cssClass = cssClass;
            this.rules = rules;
        }

        public evaluate(cellValue: any = 0): boolean {
            const evaluated = this.rules.map((rule) => {
                return Evaluate(rule.condition, rule.value, cellValue);
            });

            return evaluated.indexOf(false) === -1;
        }
    }

    class ConditionExecuter {
        public conditions: Array<ConditionAnd>;

        constructor(conditions: Array<ConditionAnd>) {
            this.conditions = conditions;
        }

        public execute(cellValue: any, cell: HTMLElement) {
            this.conditions.some((p) => {
                const isTrue = p.evaluate(cellValue);

                if (isTrue) {
                    wijmo.addClass(cell, p.cssClass);
                }

                return isTrue;
            });
        }
    }

    export class ConditionalFormat
        implements
            OSFramework.Interface.IBuilder,
            OSFramework.Interface.IDisposable {
        private _grid: Grid.IGridWijmo;
        private _mappedRules: Map<string, ConditionExecuter>;

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
            this._mappedRules = new Map<string, ConditionExecuter>();

            this._mappedRules.set(
                'Sample_Product.Id',
                new ConditionExecuter([
                    new ConditionAnd('red', [
                        new Condition(NumberRules.GreaterThan, 30),
                        new Condition(NumberRules.LessThan, 50)
                    ]),
                    new ConditionAnd('blue', [
                        new Condition(NumberRules.Equals, 29),
                        new Condition(NumberRules.Equals, 40)
                    ])
                ])
            );
        }
        private _parseRule(
            rules: Array<OSFramework.OSStructure.ConditionalFormat>
        ): ConditionExecuter {
            const conditionExecuters = [];
            rules.forEach((element) => {
                const conditions: Array<Condition> = element.format.map((c) => {
                    return new Condition(NumberRules[c.condition], c.value);
                });
                const conditionAnds = new ConditionAnd(
                    element.cellClass,
                    conditions
                );
                conditionExecuters.push(conditionAnds);
            });
            return new ConditionExecuter(conditionExecuters);
        }
        public addRule(
            column: string,
            rules: Array<OSFramework.OSStructure.ConditionalFormat>
        ): void {
            this._mappedRules.set(column, this._parseRule(rules));
        }

        public build(): void {
            this._grid.provider.formatItem.addHandler(
                (s: wijmo.grid.FlexGrid, e: wijmo.grid.FormatItemEventArgs) => {
                    const col = s.getColumn(e.col);

                    if (this._mappedRules.has(col.binding)) {
                        const cellData = s.getCellData(e.row, e.col, false);

                        this._mappedRules
                            .get(col.binding)
                            .execute(cellData, e.cell);
                    }
                }
            );
        }
        public dispose(): void {
            throw new Error('Method not implemented.');
        }
    }
}
