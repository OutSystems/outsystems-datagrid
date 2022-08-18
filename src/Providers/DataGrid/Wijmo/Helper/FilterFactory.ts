// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Helper.FilterFactory {
    /**
     * The type below is a mapper of the serialized object sent by wijmo to facilitate our usage of it, while mapping to OutSystems structure.
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
    /**
     * The type below represents the wijmo filter condition. This way we can isolate and use it separately.
     */
    type WijmoFilterCondition = {
        operator: number;
        value: string;
    };

    /**
     * Function that creates a condition for for the filter to send to OutSystems.
     *
     * @param {WijmoFilterCondition} condition
     * @param {boolean} filterAnd
     * @returns {*}  {GridAPI.Structures.FilterCondition}
     */
    function _createCondition(
        condition: WijmoFilterCondition,
        filterAnd: boolean
    ): OSFramework.OSStructure.FilterCondition {
        const filterCondition = new OSFramework.OSStructure.FilterCondition();
        filterCondition.and = filterAnd;
        filterCondition.operatorTypeId = _getOperatorString(condition.operator);
        filterCondition.value = condition.value;

        return filterCondition;
    }
    /**
     * Function that matches the wijmo Operator with the OutSystems string code.
     *
     *    wijmo.grid.filter.Operator.BW = 'BW'
     *    wijmo.grid.filter.Operator.CT = 'CT'
     *    wijmo.grid.filter.Operator.EQ = 'EQ'
     *    wijmo.grid.filter.Operator.EW = 'EW'
     *    wijmo.grid.filter.Operator.GE = 'GE'
     *    wijmo.grid.filter.Operator.GT = 'GT'
     *    wijmo.grid.filter.Operator.LE = 'LE'
     *    wijmo.grid.filter.Operator.LT = 'LT'
     *    wijmo.grid.filter.Operator.NC = 'NC'
     *    wijmo.grid.filter.Operator.NE = 'NE'
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
     * @param {OSFramework.Grid.IGrid} grid
     * @param {string} serializedActiveFilters
     * @returns {*}  {GridAPI.Structures.ActiveFilter[]}
     */
    export function MakeFromActiveFilters(
        grid: OSFramework.Grid.IGrid,
        serializedActiveFilters: string
    ): Array<OSFramework.OSStructure.ActiveFilter> {
        const wijmoActiveFilters: WijmoActiveFilters = JSON.parse(
            serializedActiveFilters
        );
        const activeFilters = new Array<OSFramework.OSStructure.ActiveFilter>();

        wijmoActiveFilters.filters
            .filter(
                (activeFilters) =>
                    activeFilters.type === 'condition' ||
                    // when we change filter uniqueValues this event gets triggered with showValues being null
                    // we only want to call the added handler if we have showValues defined
                    (activeFilters.type === 'value' && activeFilters.showValues)
            )
            .forEach((filter) => {
                const activeFilter = new OSFramework.OSStructure.ActiveFilter();
                const column = grid.getColumn(filter.binding);

                activeFilter.binding = filter.binding;
                activeFilter.columnId = (column && column.widgetId) || '';
                activeFilter.filterTypeId = filter.type;

                switch (activeFilter.filterTypeId) {
                    case 'condition':
                        //Currently wijmo only supports 2 filter operators per column. However our code already sends back a list of filter operators.
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
                        //Here we will get the array coming from wijmo [{value1: true, value2: true, ...]
                        //Then we'll get only the keys [value1, value2, ...], and concatenate these to our empty array.
                        activeFilter.filterShowValues =
                            activeFilter.filterShowValues.concat(
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
