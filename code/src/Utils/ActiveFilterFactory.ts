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

                condition1: WijmoFilterCondition;

                condition2: WijmoFilterCondition;

                showValues: Array<string>;
                type: string;
            }
        ];
    };
    function _createCondition(
        condition: WijmoFilterCondition,
        filterAnd: boolean
    ): GridAPI.Structures.FilterCondition {
        const filterCondition = new GridAPI.Structures.FilterCondition();
        filterCondition.and = filterAnd;
        filterCondition.operatorTypeId = _getOperatorString(condition.operator);
        filterCondition.value = condition.value;

        return filterCondition;
    }
    /**
     * Function that matches the wijmo Operator with the OutSystems string code.
     *
     * @param {wijmo.grid.filter.Operator} operator
     * @returns {*}  {string}
     */
    function _getOperatorString(operator: wijmo.grid.filter.Operator): string {
        let osOperatorID = wijmo.grid.filter.Operator[operator];

        if (osOperatorID === undefined) osOperatorID = '';

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
        const activeFilters = new Array<GridAPI.Structures.ActiveFilter>();

        wijmoActiveFilters.filters.forEach((filter) => {
            const activeFilter = new GridAPI.Structures.ActiveFilter();
            const column = grid.getColumn(filter.binding);

            activeFilter.binding = filter.binding;
            activeFilter.columnId = (column && column.widgetId) || '';
            activeFilter.filterTypeId = filter.type;

            switch (activeFilter.filterTypeId) {
                case 'condition':
                    if (filter.condition1.operator !== null) {
                        activeFilter.filterConditions.push(
                            _createCondition(filter.condition1, filter.and)
                        );
                    }
                    if (filter.condition2.operator !== null) {
                        activeFilter.filterConditions.push(
                            _createCondition(filter.condition2, filter.and)
                        );
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
