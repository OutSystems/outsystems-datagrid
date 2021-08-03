// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Feature {
    enum Rules {
        GreaterOrEqualsTo = '>=',
        GreaterThan = '>',
        Equals = '===',
        LessOrEqualsTo = '<=',
        LessThan = '<',
        NotEquals = '!=='
    }

    function Evaluate(operator: Rules, comparedValue: any, cellValue: any) {
        // in case we are comparing dates
        if (typeof cellValue.getMonth === 'function') {
            cellValue = WijmoProvider.Helper.DataUtils.GetTicksFromDate(
                cellValue,
                comparedValue.indexOf('Z') > -1
            );
            comparedValue = Date.parse(
                WijmoProvider.Helper.DataUtils.ResetSeconds(comparedValue)
            );
        }

        switch (operator) {
            case Rules.GreaterOrEqualsTo:
                return cellValue >= comparedValue;
            case Rules.GreaterThan:
                return cellValue > comparedValue;
            case Rules.Equals:
                return comparedValue === cellValue;
            case Rules.NotEquals:
                return comparedValue !== cellValue;
            case Rules.LessOrEqualsTo:
                return cellValue <= comparedValue;
            case Rules.LessThan:
                return cellValue < comparedValue;
            default:
                return false;
        }
    }

    class Condition {
        public condition: Rules;
        public value: any;

        constructor(condition: Rules, value: any) {
            this.condition = condition;
            this.value = value;
        }
    }

    class ConditionAnd {
        public cellClass: string;
        public rowClass: string;
        public rules: Array<Condition>;

        constructor(
            cellClass: string,
            rowClass: string,
            rules: Array<Condition>
        ) {
            this.cellClass = cellClass;
            this.rowClass = rowClass;
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

        public execute(grid: Grid.IGridWijmo, cellValue: any, e: any) {
            this.conditions.some((p) => {
                const isTrue = p.evaluate(cellValue);
                const binding = grid.provider.getColumn(e.col).binding;

                if (isTrue) {
                    if (p.rowClass) {
                        grid.features.rows.addClass(e.row, p.rowClass);
                    }
                    if (p.cellClass) {
                        grid.features.cellStyle.addClass(
                            binding,
                            e.row,
                            p.cellClass
                        );
                    }
                } else {
                    if (p.rowClass) {
                        grid.features.rows.removeClass(e.row, p.rowClass);
                    }
                    if (p.cellClass) {
                        grid.features.cellStyle.removeClass(
                            e.row,
                            binding,
                            p.cellClass
                        );
                    }
                }
                const classes = grid.features.cellStyle
                    .getMetadata(e.row)
                    .getCssClassesByBinding(binding);

                return isTrue && classes.length === 0;
            });
        }
    }

    export class ConditionalFormat
        implements
            OSFramework.Feature.IConditionalFormat,
            OSFramework.Interface.IBuilder
    {
        private _grid: Grid.IGridWijmo;
        private _mappedRules: Map<string, ConditionExecuter>;

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
            this._mappedRules = new Map<string, ConditionExecuter>();
        }

        private _parseRule(
            rules: Array<OSFramework.OSStructure.ConditionalFormat>
        ): ConditionExecuter {
            const conditionExecuters = [];
            rules.forEach((element) => {
                const conditions: Array<Condition> = element.format.map((c) => {
                    return new Condition(Rules[c.condition], c.value);
                });
                const conditionAnds = new ConditionAnd(
                    element.cellClass,
                    element.rowClass,
                    conditions
                );
                conditionExecuters.push(conditionAnds);
            });
            return new ConditionExecuter(conditionExecuters);
        }

        private _updatingViewHandler(s, e) {
            const columns = this._grid
                .getColumns()
                .filter((x) => this._mappedRules.get(x.config.binding));

            s.rows.forEach((row, index) => {
                columns.forEach((column) => {
                    const colBinding = column.config.binding.split('.');
                    let value = row.dataItem;
                    for (let i = 0; i < colBinding.length; i++) {
                        // in case we get undefined we want to break
                        if (
                            value === undefined &&
                            i === colBinding.length - 1
                        ) {
                            break;
                        }
                        value = value[colBinding[i]];
                    }
                    this._mappedRules
                        .get(column.config.binding)
                        .execute(this._grid, value, {
                            row: index,
                            col: GridAPI.GridManager.GetActiveGrid().provider.columns.find(x => x.binding === column.provider.binding).index
                        });
                });
            });
        }

        public addRules(
            binding: string,
            rules: Array<OSFramework.OSStructure.ConditionalFormat>
        ): void {
            this._mappedRules.set(binding, this._parseRule(rules));
        }

        public build(): void {
            this._grid.provider.updatingView.addHandler(
                this._updatingViewHandler.bind(this)
            );
        }

        public removeRules(binding: string): void {
            this._mappedRules.delete(binding);
        }
    }
}
