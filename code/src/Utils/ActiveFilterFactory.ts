namespace ActiveFilterFactory {
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

    const startOperatorId = 600;

    export function MakeFromActiveFilters(
        serializedActiveFilters: string
    ): GridAPI.Structures.ActiveFilter[] {
        const wijmoActiveFilters: WijmoActiveFilters = JSON.parse(
            serializedActiveFilters
        );
        const activeFilters = [];
        let activeFilter: GridAPI.Structures.ActiveFilter;
        let filterCondition: GridAPI.Structures.FilterCondition;

        wijmoActiveFilters.filters.forEach((filter) => {
            activeFilter = new GridAPI.Structures.ActiveFilter();
            activeFilter.binding = filter.binding;
            activeFilter.columnId = '<unknown>';
            activeFilter.filterTypeId = filter.type;

            switch (activeFilter.filterTypeId) {
                case 'condition':
                    filterCondition = new GridAPI.Structures.FilterCondition();
                    filterCondition.and = filter.and;
                    if (filter.condition1.operator !== null) {
                        filterCondition.operatorTypeId =
                            startOperatorId + filter.condition1.operator;
                        filterCondition.value = filter.condition1.value;
                        activeFilter.filterConditions.push(filterCondition);
                        if (filter.condition2.operator !== null) {
                            filterCondition = new GridAPI.Structures.FilterCondition();
                        }
                    }
                    if (filter.condition2.operator !== null) {
                        filterCondition.operatorTypeId =
                            startOperatorId + filter.condition2.operator;
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
