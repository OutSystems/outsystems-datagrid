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
/**
 * {@module wijmo.chart.radar}
 * Defines the {@link FlexRadar} control and its associated classes.
 */
/**
 *
 */
export declare var ___keepComment: any;
import { Point, Rect, DataType, Size } from '@mescius/wijmo';
import { _BarPlotter, _DataInfo, _DataPoint, IRenderEngine, _IAxis, _ISeries, _IPalette, SeriesBase, Stacking, _LinePlotter, ChartType, FlexChartCore, _IPlotter, RenderEventArgs, Axis, AxisType } from '@mescius/wijmo.chart';
/**
 * Represents a series of data points to display in the chart.
 *
 * The {@link FlexRadarSeries} class supports all basic chart types. You may define
 * a different chart type on each {@link FlexRadarSeries} object that you add to the
 * {@link FlexRadar} series collection. This overrides the {@link chartType}
 * property set on the chart that is the default for all {@link FlexRadarSeries} objects
 * in its collection.
 */
export declare class FlexRadarSeries extends SeriesBase {
    private _finChartType;
    /**
     * Gets or sets the chart type for a specific series, overriding the chart type
     * set on the overall chart. Please note that ColumnVolume, EquiVolume,
     * CandleVolume and ArmsCandleVolume chart types are not supported and should be
     * set on the {@link FinancialChart}.
     */
    chartType: RadarChartType;
    _getChartType(): ChartType;
}
/**
 * Line/scatter radar chart plotter.
 */
export declare class _RadarLinePlotter extends _LinePlotter {
    isArea: boolean;
    _getLabelPoint(series: any, dataPoint: _DataPoint): Point;
    plotSeries(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, series: _ISeries, palette: _IPalette, iser: number, nser: number): void;
    _drawData(engine: IRenderEngine, dx: any, dy: any, chartType: any, style: any, si: any): void;
}
/**
 * Column(Rose) radar chart plotter.
 */
export declare class _RadarBarPlotter extends _BarPlotter {
    adjustLimits(dataInfo: _DataInfo, plotRect: Rect): Rect;
    _getLabelPoint(series: any, dataPoint: _DataPoint): Point;
    plotSeries(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, series: _ISeries, palette: _IPalette, iser: number, nser: number): void;
}
/**
 * Specifies the type of radar chart.
 */
export declare enum RadarChartType {
    /** Shows vertical bars and allows you to compare values of items across categories. */
    Column = 0,
    /** Shows patterns within the data using X and Y coordinates. */
    Scatter = 1,
    /** Shows trends over a period of time or across categories. */
    Line = 2,
    /** Shows line chart with a symbol on each data point. */
    LineSymbols = 3,
    /** Shows line chart with the area below the line filled with color. */
    Area = 4
}
/**
 * radar chart control.
 */
export declare class FlexRadar extends FlexChartCore {
    private _chartType;
    private _startAngle;
    private _totalAngle;
    private _reversed;
    _center: Point;
    _radius: number;
    _angles: number[];
    _isPolar: boolean;
    _areas: any[];
    private __radarLinePlotter;
    private __radarColumnPlotter;
    /**
     * Initializes a new instance of the {@link FlexRadar} class.
     *
     * @param element The DOM element that hosts the control, or a selector for the
     * host element (e.g. '#theCtrl').
     * @param options A JavaScript object containing initialization data for the
     * control.
     */
    constructor(element: any, options?: any);
    private readonly _radarLinePlotter;
    private readonly _radarColumnPlotter;
    _initAxes(): void;
    _layout(rect: Rect, size: Size, engine: IRenderEngine): void;
    /**
     * Gets or sets the type of radar chart to be created.
     */
    chartType: RadarChartType;
    /**
     * Gets or sets the starting angle for the radar, in degrees.
     *
     * Angles are measured clockwise, starting at the 12 o'clock position.
     */
    startAngle: number;
    /**
     * Gets or sets the total angle for the radar, in degrees.  Its default value is 360.
     * The value must be greater than 0, or less than or equal to 360.
     */
    totalAngle: number;
    /**
     * Gets or sets a value that determines whether angles are reversed
     * (counter-clockwise).
     *
     * The default value is false, which causes angles to be measured in
     * the clockwise direction.
     */
    reversed: boolean;
    /**
     * Gets or sets a value that determines whether and how the series objects are stacked.
     */
    stacking: Stacking;
    onRendered(e: RenderEventArgs): void;
    _getChartType(): ChartType;
    _getPlotter(series: FlexRadarSeries): _IPlotter;
    _convertPoint(radius: any, angle: any): Point;
    _createSeries(): SeriesBase;
    _clearCachedValues(): void;
    _performBind(): void;
    _prepareRender(): void;
}
/**
 * Represents an axis in the radar chart.
 */
export declare class FlexRadarAxis extends Axis {
    private _points;
    private _axisLabels;
    _height: number;
    private __actualMin;
    private __actualMax;
    _render(e: IRenderEngine): void;
    _renderLabels(e: IRenderEngine): void;
    _getHeight(engine: IRenderEngine, maxw: number): number;
    _getActualRange(): number;
    _updateActualLimits(dataType: DataType, dataMin: number, dataMax: number, labels?: string[], values?: number[]): void;
    _updateActualLimitsByChartType(labels: any, min: any, max: any): {
        min: any;
        max: any;
    };
    _isOverlapped(engine: IRenderEngine, w: number, lblClass: string, axisType: AxisType): boolean;
    /**
     * Converts the specified value from data to pixel coordinates.
     *
     * @param val The data value to convert.
     * @param maxValue The max value of the data, it's optional.
     * @param minValue The min value of the data, it's optional.
     */
    convert(val: number, maxValue?: number, minValue?: number): number;
    _renderLineAndTitle(engine: any): void;
    _renderPolygon(engine: any, r: any, cls: any): void;
    _renderMinors(engine: IRenderEngine, ticks: number[], isVert: boolean, isNear: boolean): void;
    private _drawMinorTickLength;
    _renderLabelsAndTicks(engine: any, index: any, val: any, sval: any, labelAngle: any, tickMarks: any, showLabel: any, t1: any, t2: any): boolean;
    private _renderXGridLine;
    private _renderXTick;
    private _renderYGridLine;
    private _getXLabelVAlign;
    private _getXLabelAlign;
    _createTimeLabels(start: number, len: number, vals: number[], lbls: string[]): void;
    _niceNumber(x: number, exp: number, round: boolean): number;
}
