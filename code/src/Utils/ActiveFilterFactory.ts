// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace ActiveFilterFactory {
    /* 
    The type below is a mapper of the serialized object sent by wijmo to facilitate our usage of it, while mapping to OutSystems structure.
    */
    type WijmoActiveFilters = {
        filters: [
            {
                and: boolean;
                binding: string;

                condition1: {
                    operator: number;
                    value: string;
                };

                condition2: {
                    operator: number;
                    value: string;
                };

                showValues: string[];
                type: string;
            }
        ];
    };

    /**
     * Function that matches the wijmo Operator with the OutSystems string code.
     *
     * @param {wijmo.grid.filter.Operator} operator
     * @returns {*}  {string}
     */
    function _getOperatorString(operator: wijmo.grid.filter.Operator): string {
        let osOperatorID = '';
        switch (operator) {
            case wijmo.grid.filter.Operator.BW:
                osOperatorID = 'BW';
                break;
            case wijmo.grid.filter.Operator.CT:
                osOperatorID = 'CT';
                break;
            case wijmo.grid.filter.Operator.EQ:
                osOperatorID = 'EQ';
                break;
            case wijmo.grid.filter.Operator.EW:
                osOperatorID = 'EW';
                break;
            case wijmo.grid.filter.Operator.GE:
                osOperatorID = 'GE';
                break;
            case wijmo.grid.filter.Operator.GT:
                osOperatorID = 'GT';
                break;
            case wijmo.grid.filter.Operator.LE:
                osOperatorID = 'LE';
                break;
            case wijmo.grid.filter.Operator.LT:
                osOperatorID = 'LT';
                break;
            case wijmo.grid.filter.Operator.NC:
                osOperatorID = 'NC';
                break;
            case wijmo.grid.filter.Operator.NE:
                osOperatorID = 'NE';
                break;
        }
        return osOperatorID;
    }
    /**
     * Function that will transform the structure received from the provider, into the OutSystems structure format.
     *
     * @export
     * @param {Grid.IGrid} grid
     * @param {string} serializedActiveFilters
     * @returns {*}  {GridAPI.Structures.ActiveFilter[]}
     */
    export function MakeFromActiveFilters(
        grid: Grid.IGrid,
        serializedActiveFilters: string
    ): GridAPI.Structures.ActiveFilter[] {
        const wijmoActiveFilters: WijmoActiveFilters = JSON.parse(
            serializedActiveFilters
        );

        const activeFilters = [];
        let activeFilter: GridAPI.Structures.ActiveFilter;
        let filterCondition: GridAPI.Structures.FilterCondition;
        let column: Column.IColumn;

        wijmoActiveFilters.filters.forEach((filter) => {
            activeFilter = new GridAPI.Structures.ActiveFilter();
            activeFilter.binding = filter.binding;
            column = grid.columns.get(activeFilter.binding);
            activeFilter.columnId = (column && column.widgetId) || '';
            activeFilter.filterTypeId = filter.type;

            switch (activeFilter.filterTypeId) {
                case 'condition':
                    if (filter.condition1.operator !== null) {
                        filterCondition = new GridAPI.Structures.FilterCondition();
                        filterCondition.and = filter.and;
                        filterCondition.operatorTypeId = _getOperatorString(
                            filter.condition1.operator
                        );
                        filterCondition.value = filter.condition1.value;
                        activeFilter.filterConditions.push(filterCondition);
                    }
                    if (filter.condition2.operator !== null) {
                        filterCondition = new GridAPI.Structures.FilterCondition();
                        filterCondition.and = filter.and;
                        filterCondition.operatorTypeId = _getOperatorString(
                            filter.condition2.operator
                        );
                        filterCondition.value = filter.condition2.value;
                        activeFilter.filterConditions.push(filterCondition);
                    }
                    break;
                case 'value':
                    activeFilter.filterShowValues = activeFilter.filterShowValues.concat(
                        Object.keys(filter.showValues)
                    );
                    break;
                default:
                    throw `Filter type ${activeFilter.filterTypeId} not supported.`;
            }

            activeFilters.push(activeFilter);
        });

        return activeFilters;
    }
}
