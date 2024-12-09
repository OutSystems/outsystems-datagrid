/*!
    *
    * Wijmo Library 5.20241.19
    * https://developer.mescius.com/wijmo
    *
    * Copyright(c) MESCIUS inc. All rights reserved.
    *
    * Licensed under the End-User License Agreement For MESCIUS Wijmo Software.
    * us.sales@mescius.com
    * https://developer.mescius.com/wijmo/licensing
    *
    */
declare module wijmo.meta {
    function softChart(): typeof wijmo.chart;
    function softChartAnalytics(): typeof wijmo.chart.analytics;
    function softChartAnimation(): typeof wijmo.chart.animation;
    function softChartAnnotation(): typeof wijmo.chart.annotation;
    function softChartFinance(): typeof wijmo.chart.finance;
    function softChartFinanceAnalytics(): typeof wijmo.chart.finance.analytics;
    function softChartHierarchical(): typeof wijmo.chart.hierarchical;
    function softChartInteraction(): typeof wijmo.chart.interaction;
    function softChartRadar(): typeof wijmo.chart.radar;
    function softChartMap(): typeof wijmo.chart.map;
    function softGauge(): typeof wijmo.gauge;
    function softGrid(): typeof wijmo.grid;
    function softGridDetail(): typeof wijmo.grid.detail;
    function softGridFilter(): typeof wijmo.grid.filter;
    function softGridGrouppanel(): typeof wijmo.grid.grouppanel;
    function softGridSearch(): typeof wijmo.grid.search;
    function softGridMultirow(): typeof wijmo.grid.multirow;
    function softGridSheet(): typeof wijmo.grid.sheet;
    function softGridTransposed(): typeof wijmo.grid.transposed;
    function softGridTransposedMultiRow(): typeof wijmo.grid.transposedmultirow;
    function softGridImmutable(): typeof wijmo.grid.immutable;
    function softNav(): typeof wijmo.nav;
    function softOlap(): typeof wijmo.olap;
    function softViewer(): typeof wijmo.viewer;
    function softInput(): typeof wijmo.input;
    function softBarcode(): typeof wijmo.barcode;
    function softBarcodeCommon(): typeof wijmo.barcode.common;
    function softBarcodeComposite(): typeof wijmo.barcode.composite;
    function softBarcodeSpecialized(): typeof wijmo.barcode.specialized;
}
declare module wijmo.meta {
    class ControlMetaFactory {
        static CreateProp(propertyName: string, propertyType: PropertyType, changeEvent?: string, enumType?: any, isNativeControlProperty?: boolean, priority?: number): PropDescBase;
        static CreateEvent(eventName: string, isPropChanged?: boolean): EventDescBase;
        static CreateComplexProp(propertyName: string, isArray: boolean, ownsObject?: boolean): ComplexPropDescBase;
        static findProp(propName: string, props: PropDescBase[]): PropDescBase;
        static findEvent(eventName: string, events: EventDescBase[]): EventDescBase;
        static findComplexProp(propName: string, props: ComplexPropDescBase[]): ComplexPropDescBase;
        static getMetaData(metaDataId: any): MetaDataBase;
        static getClassName(classRef: any): string;
        static toCamelCase(s: any): any;
        private static findInArr;
    }
    class PropDescBase {
        private _propertyName;
        private _propertyType;
        private _changeEvent;
        private _enumType;
        private _isNativeControlProperty;
        private _priority;
        constructor(propertyName: string, propertyType: PropertyType, /*bindingMode: BindingMode = BindingMode.OneWay*/ changeEvent?: string, enumType?: any, isNativeControlProperty?: boolean, priority?: number);
        readonly propertyName: string;
        readonly propertyType: PropertyType;
        readonly changeEvent: string;
        readonly enumType: any;
        readonly bindingMode: BindingMode;
        readonly isNativeControlProperty: boolean;
        readonly priority: number;
        readonly shouldUpdateSource: boolean;
        initialize(options: any): void;
        castValueToType(value: any): any;
        private _parseDate;
    }
    enum PropertyType {
        Boolean = 0,
        Number = 1,
        Date = 2,
        String = 3,
        AnyPrimitive = 4,
        Enum = 5,
        Function = 6,
        EventHandler = 7,
        Any = 8
    }
    function isSimpleType(type: PropertyType): boolean;
    enum BindingMode {
        OneWay = 0,
        TwoWay = 1
    }
    class EventDescBase {
        private _eventName;
        private _isPropChanged;
        constructor(eventName: string, isPropChanged?: boolean);
        readonly eventName: string;
        readonly isPropChanged: boolean;
    }
    class ComplexPropDescBase {
        propertyName: string;
        isArray: boolean;
        private _ownsObject;
        constructor(propertyName: string, isArray: boolean, ownsObject?: boolean);
        readonly ownsObject: boolean;
    }
    class MetaDataBase {
        private _props;
        private _events;
        private _complexProps;
        parentProperty: string;
        isParentPropertyArray: boolean;
        ownsObject: boolean;
        parentReferenceProperty: string;
        ngModelProperty: string;
        constructor(props: PropDescBase[], events?: EventDescBase[], complexProps?: ComplexPropDescBase[], parentProperty?: string, isParentPropertyArray?: boolean, ownsObject?: boolean, parentReferenceProperty?: string, ngModelProperty?: string);
        props: PropDescBase[];
        events: EventDescBase[];
        complexProps: ComplexPropDescBase[];
        add(props: PropDescBase[], events?: EventDescBase[], complexProps?: ComplexPropDescBase[], parentProperty?: string, isParentPropertyArray?: boolean, ownsObject?: boolean, parentReferenceProperty?: string, ngModelProperty?: string): MetaDataBase;
        addOptions(options: any): this;
        prepare(): void;
    }
}
declare module wijmo.meta {
}
