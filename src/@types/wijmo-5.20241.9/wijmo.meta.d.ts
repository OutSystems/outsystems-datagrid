/*!
    *
    * Wijmo Library 5.20241.9
    * https://developer.mescius.com/wijmo
    *
    * Copyright(c) MESCIUS inc. All rights reserved.
    *
    * Licensed under the End-User License Agreement For MESCIUS Wijmo Software.
    * us.sales@mescius.com
    * https://developer.mescius.com/wijmo/licensing
    *
    */
import * as wjcInput from '@mescius/wijmo.input';
import * as wjcGrid from '@mescius/wijmo.grid';
import * as wjcGridFilter from '@mescius/wijmo.grid.filter';
import * as wjcGridGrouppanel from '@mescius/wijmo.grid.grouppanel';
import * as wjcGridDetail from '@mescius/wijmo.grid.detail';
import * as wjcGridSearch from '@mescius/wijmo.grid.search';
import * as wjcGridSheet from '@mescius/wijmo.grid.sheet';
import * as wjcGridMultirow from '@mescius/wijmo.grid.multirow';
import * as wjcGridTransposed from '@mescius/wijmo.grid.transposed';
import * as wjcGridTransposedMultiRow from '@mescius/wijmo.grid.transposedmultirow';
import * as wjcGridImmutable from '@mescius/wijmo.grid.immutable';
import * as wjcChart from '@mescius/wijmo.chart';
import * as wjcChartHierarchical from '@mescius/wijmo.chart.hierarchical';
import * as wjcChartAnnotation from '@mescius/wijmo.chart.annotation';
import * as wjcChartInteraction from '@mescius/wijmo.chart.interaction';
import * as wjcChartAnimation from '@mescius/wijmo.chart.animation';
import * as wjcChartFinance from '@mescius/wijmo.chart.finance';
import * as wjcChartRadar from '@mescius/wijmo.chart.radar';
import * as wjcChartAnalytics from '@mescius/wijmo.chart.analytics';
import * as wjcChartFinanceAnalytics from '@mescius/wijmo.chart.finance.analytics';
import * as wjcChartMap from '@mescius/wijmo.chart.map';
import * as wjcGauge from '@mescius/wijmo.gauge';
import * as wjcOlap from '@mescius/wijmo.olap';
import * as wjcViewer from '@mescius/wijmo.viewer';
import * as wjcNav from '@mescius/wijmo.nav';
import * as wjcBarcode from '@mescius/wijmo.barcode';
import * as wjcBarcodeCommon from '@mescius/wijmo.barcode.common';
import * as wjcBarcodeComposite from '@mescius/wijmo.barcode.composite';
import * as wjcBarcodeSpecialized from '@mescius/wijmo.barcode.specialized';
export declare function softChart(): typeof wjcChart;
export declare function softChartAnalytics(): typeof wjcChartAnalytics;
export declare function softChartAnimation(): typeof wjcChartAnimation;
export declare function softChartAnnotation(): typeof wjcChartAnnotation;
export declare function softChartFinance(): typeof wjcChartFinance;
export declare function softChartFinanceAnalytics(): typeof wjcChartFinanceAnalytics;
export declare function softChartHierarchical(): typeof wjcChartHierarchical;
export declare function softChartInteraction(): typeof wjcChartInteraction;
export declare function softChartRadar(): typeof wjcChartRadar;
export declare function softChartMap(): typeof wjcChartMap;
export declare function softGauge(): typeof wjcGauge;
export declare function softGrid(): typeof wjcGrid;
export declare function softGridDetail(): typeof wjcGridDetail;
export declare function softGridFilter(): typeof wjcGridFilter;
export declare function softGridGrouppanel(): typeof wjcGridGrouppanel;
export declare function softGridSearch(): typeof wjcGridSearch;
export declare function softGridMultirow(): typeof wjcGridMultirow;
export declare function softGridSheet(): typeof wjcGridSheet;
export declare function softGridTransposed(): typeof wjcGridTransposed;
export declare function softGridTransposedMultiRow(): typeof wjcGridTransposedMultiRow;
export declare function softGridImmutable(): typeof wjcGridImmutable;
export declare function softNav(): typeof wjcNav;
export declare function softOlap(): typeof wjcOlap;
export declare function softViewer(): typeof wjcViewer;
export declare function softInput(): typeof wjcInput;
export declare function softBarcode(): typeof wjcBarcode;
export declare function softBarcodeCommon(): typeof wjcBarcodeCommon;
export declare function softBarcodeComposite(): typeof wjcBarcodeComposite;
export declare function softBarcodeSpecialized(): typeof wjcBarcodeSpecialized;
export declare class ControlMetaFactory {
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
export declare class PropDescBase {
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
export declare enum PropertyType {
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
export declare function isSimpleType(type: PropertyType): boolean;
export declare enum BindingMode {
    OneWay = 0,
    TwoWay = 1
}
export declare class EventDescBase {
    private _eventName;
    private _isPropChanged;
    constructor(eventName: string, isPropChanged?: boolean);
    readonly eventName: string;
    readonly isPropChanged: boolean;
}
export declare class ComplexPropDescBase {
    propertyName: string;
    isArray: boolean;
    private _ownsObject;
    constructor(propertyName: string, isArray: boolean, ownsObject?: boolean);
    readonly ownsObject: boolean;
}
export declare class MetaDataBase {
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
