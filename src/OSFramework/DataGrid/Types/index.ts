// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Types {
    /**
     * Column configs common properties between provider and OS
     */
    interface IColumnCommonConfigs {
        align: string;
        binding: string;
        cssClass: string;
        dataType: wijmo.DataType;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        editor: any;
        format: string;
        header: string;
        multiLine: boolean;
        visible: boolean;
        width: number;
        wordWrap: boolean;
    }

    export type IConfiguration = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    };

    export interface IGridConfig extends IConfiguration {
        allowColumnReorder: boolean;
        allowColumnResize: boolean;
        allowColumnSort: boolean;
        allowEdit: boolean;
        allowFiltering: boolean;
        allowGrouping: boolean;
        allowKeyTabNavigation: boolean;
        allowRowSelector: boolean;
        autoGenerateColumns: boolean;
        groupPanelId: string;
        keyBinding: string;
        rowHeader: number;
        rowHeight: number;
        rowsPerPage: number;
        selectionMode: number;
        serverSidePagination: boolean;
        showAggregateValues: boolean;
        uniqueId: string;
        validateEdits: boolean;
    }

    /**
     * Basic structure for all provider configuration
     */
    export type IProviderConfiguration<T> = T;

    /**
     * Structure for grid provider configuration
     */
    export interface IGridProviderConfigs {
        allowMerging: string;
        autoGenerateColumns: boolean;
        isReadOnly: boolean;
        showSelectedHeaders: string;
        validateEdits: boolean;
    }

    /**
     * Basic structure for all column provider configuration
     */
    export interface IColumnProviderConfiguration {}

    /**
     * Specific structure for Column provider configuration
     */
    export interface IColumnProviderConfigs
        extends IColumnProviderConfiguration,
            IColumnCommonConfigs {
        allowDragging: boolean;
        allowResizing: boolean;
        allowSorting: boolean;
        cellTemplate?: wijmo.grid.ICellTemplateFunction;
        collapseTo?: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dataMap?: any;
        dataMapEditor?: wijmo.grid.DataMapEditor;
        isCollapsed?: boolean;
        isReadOnly: boolean;
        isRequired: boolean;
    }
    /**
     * Specific structure for group column provider configuration
     */
    export interface IColumnGroupProviderConfigs
        extends IColumnProviderConfiguration {
        align: string;
        collapseTo: string;
        header: string;
        isCollapsed: boolean;
    }

    /**
     * Specific structure for Column editor provider configuration
     */
    export interface IEditorProviderConfigs {}

    /**
     * Specific structure for number column editor provider configuration
     */
    export interface INumberEditorProviderConfigs
        extends IEditorProviderConfigs {
        format: string;
        isRequired: boolean;
        max: number;
        min: number;
        step: number;
    }

    /**
     * Specific structure for date column editor provider configuration
     */
    export interface IDateEditorProviderConfigs extends IEditorProviderConfigs {
        format: string;
        isRequired: boolean;
        max: Date;
        min: Date;
    }

    /**
     * OS column configs
     */
    export interface IColumnConfigs extends IColumnCommonConfigs {
        allowEdit: boolean;
        allowMerging: boolean;
        allowReorder: boolean;
        allowResize: boolean;
        allowSort: boolean;
        autoGenerated: boolean;
        canBeHidden: boolean;
        conditionalFormat: Array<OSStructure.ConditionalFormat>;
        errorMessage: string;
        genericColumnId: string;
        headerTooltip: string;
        isMandatory: boolean;
        required: boolean;
        uniqueId: string;
        validateBinding: boolean;
    }

    /**
     * Base column extra configs
     */
    export interface IColumnExtraConfigs {}

    export interface IActionColumnExtraConfigs extends IColumnExtraConfigs {
        actionColumnElementType: DataGrid.Enum.ActionColumnElementType;
        externalURL: string;
    }

    /**
     * Base column extra configs
     */
    export interface ICommonExtraConfigs extends IColumnExtraConfigs {
        conditionalFormat: Array<OSStructure.ConditionalFormat>;
    }

    /**
     * Checkbox column extra configs
     */
    export interface ICheckboxColumnExtraConfigs extends ICommonExtraConfigs {}

    /**
     * Currency column extra configs
     */
    export interface ICurrencyColumnExtraConfigs extends ICommonExtraConfigs {
        decimalPlaces: number;
        symbol: boolean;
    }

    /**
     * Number column extra configs
     */
    export interface INumberColumnExtraConfigs extends ICommonExtraConfigs {
        decimalPlaces: number;
        hasThousandSeparator: boolean;
        maxPerDecPlaces: number;
        maxValue: number;
        minPerDecPlaces?: number;
        minValue: number;
        step: number;
    }

    /**
     * Date/Datetime column extra configs
     */
    export interface IDateColumnExtraConfigs extends ICommonExtraConfigs {
        format: string;
    }

    /**
     * Dropdown column extra configs
     */
    export interface IDropdownColumnExtraConfigs extends ICommonExtraConfigs {
        datamap: IDropdownDataMap;
        parentBinding: string;
    }

    export interface IDropdownDataMap {
        key: string;
        parentKey: string;
        text: string;
    }

    /**
     * Group column extra configs
     */
    export interface IGroupColumnExtraConfigs extends ICommonExtraConfigs {
        align: string;
        collapseTo: string;
        isCollapsed: boolean;
    }

    /**
     * Text column extra configs
     */
    export interface ITextColumnExtraConfigs extends ICommonExtraConfigs {}

    /**
     * Calculated column extra configs
     */
    export interface ICalculatedColumnExtraConfigs extends ICommonExtraConfigs {
        decimalPlaces: number;
        formula: DataGrid.OSStructure.Formula;
        hasThousandSeparator: boolean;
    }

    export type RowData = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dataItem?: any;
        rowIndex: number;
        selected: OSStructure.BindingValue[];
    };
}
