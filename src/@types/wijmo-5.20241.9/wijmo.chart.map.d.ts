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
 * {@module wijmo.chart.map}
 * Defines the {@link FlexMap} control and its associated classes.
 *
 * This module includes GeoJSON type definitions from <a href="https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/geojson" target="_blank">@types/geojson</a>.
 */
/**
 *
 */
export declare var ___keepComment: any;
import { Point, ObservableArray, Rect, Size, Binding, Event, EventArgs } from '@mescius/wijmo';
import { IRenderEngine, SvgRenderEngine, ChartElement, ChartTooltip, FlexChartBase } from '@mescius/wijmo.chart';
import * as selfModule from '@mescius/wijmo.chart.map';
/** Information about hit test result. */
export declare class MapHitTestInfo {
    private _pt;
    _item: any;
    private _map;
    _chartElement: ChartElement;
    /**
     * Gets the point in control coordinates.
     */
    readonly point: Point;
    /**
     * Gets the data item associated with the point.
     */
    readonly item: any;
    /** Gets the hit point in geographical coordinates. */
    readonly geoPoint: Point;
    /** Gets chart element at the hit point. */
    readonly chartElement: ChartElement;
    /**
     * Get the map control.
     */
    readonly map: FlexMap;
}
export declare class _DrawOptions {
    className?: string;
    clipPath?: string;
    style?: any;
}
export interface IMapRenderEngine extends IRenderEngine {
    drawPolygon2(options: _DrawOptions, pts: number[][]): any;
}
export declare class _SvgMapRenderEngine extends SvgRenderEngine {
    scale: number;
    constructor(el?: HTMLElement);
    drawPolygon2(options: _DrawOptions, pts: number[][]): SVGElement;
}
export declare class _Range {
    constructor(min: number, max: number);
    min: number;
    max: number;
    readonly range: number;
    norm(val: number): number;
}
export declare class _Utils {
    static getRange(items: any[], binding: Binding | ((o: any) => number)): _Range;
}
export interface IColorScale {
    convert(val: number): string;
}
/** Color scale performs value to color transformation. */
export declare class ColorScale implements IColorScale {
    private _clrs;
    private _clrSpline;
    private _scale;
    private _clrUnknown;
    _range: _Range;
    private _colors;
    private _items;
    private _binding;
    private _fmt;
    _parent: any;
    constructor(options?: any);
    initialize(options: any): void;
    convert(val: number, norm?: boolean): string;
    /** Gets or sets the scaling function. */
    scale: (v: number) => number;
    /** Gets or sets the binding property or function. */
    binding: string | ((o: any) => number);
    /**
     * Get or sets the color for undefined values (NaN or undefined).
     */
    colorUnknown: string;
    /** Gets or sets the array of colors (palette) used for transformation. */
    colors: string[];
    /**
     * Get or sets the format string for legend items.
     */
    format: string;
    domain(items: any[]): void;
    getValue(item: any): number;
    private _interpolate;
    _drawLegend(e: IRenderEngine, rect: Rect, isVert: boolean): void;
    _measureLegend(e: IRenderEngine, isVert: boolean, w: number, h: number): Size;
}
export interface _IConverter {
    convert(pt: Point): Point;
}
/**
 * A control for visualization geographical data.
 */
export declare class FlexMap extends FlexChartBase implements _IConverter {
    private _layers;
    private _center;
    private _zoom;
    private _zoomStep;
    private _offset;
    private _size;
    private _dragStart;
    private _overlay;
    _mapRect: Rect;
    _proj: MercatorProjection;
    private _touchStartH;
    private _touchMoveH;
    private _touchEndH;
    private _touchCancelH;
    private _mouseWheelH;
    /**
     * Initializes a new instance of the {@link FlexMap} class.
     *
     * @param options A JavaScript object containing initialization data
     * for the layer.
     */
    constructor(element: any, options?: any);
    /**
     * Gets the collection of map layers.
     */
    readonly layers: ObservableArray;
    /**
     * Gets or sets the map center in geo coordinates.
     */
    center: Point;
    /**
     * Gets or sets the map zoom level.
     */
    zoom: number;
    /**
     * Gets the map tooltip.
     */
    readonly tooltip: ChartTooltip;
    /**
     * Converts the specified point from geo coordinates to control's coordinates.
     *
     * @param pt point in geo coordinates.
     */
    convert(pt: Point): Point;
    /**
     * Converts the specified point from control's coordinates to geo coordinates.
     *
     * @param pt point in control's coordinates.
     */
    convertBack(pt: Point): Point;
    /** Gets hit test information about specified point. The point can be specified as mouse event object.  */
    hitTest(pt: MouseEvent | Point | number, y?: number): MapHitTestInfo;
    /**
     * Zooms map to the specified rectangle in data coordinates.
     *
     * @param rect rectangle in geo coordinates.
     */
    zoomTo(rect: Rect): void;
    invalidate(fullUpdate?: boolean): void;
    _renderChart(engine: IRenderEngine, rect: Rect, applyElement: boolean): void;
    _getDesiredLegendSize(e: IRenderEngine, isVert: boolean, w: number, h: number): Size;
    _renderLegend(e: IRenderEngine, pt: Point, areas: any[], isVert: boolean, w: number, h: number): void;
    _copy(key: string, value: any): boolean;
    private _getMapRect;
    private _updateOffset;
    private _updateTooltip;
    private _getItemById;
    private _convertMercator;
    private _convertMercatorBack;
    _handleTouch: boolean;
    _touch1: Point;
    _touch2: Point;
    private _touchStart;
    private _touchMove;
    private _dist;
    private _touchEnd;
    private _touchCancel;
    private _mouseWheel;
    private _getItem;
}
declare class MercatorProjection {
    maxY: number;
    convert(pt: Point): Point;
    convertBack(pt: Point): Point;
    private _convertX;
    private _convertBackX;
    private _convertY;
    private _convertBackY;
}
export interface IMapLayer {
    map: FlexMap;
    render(engine: IRenderEngine, t?: SVGTransform, g?: SVGGElement): any;
}
export declare const empty: {};
/** Base class for map layers. */
export declare class MapLayerBase implements IMapLayer {
    protected _items: any;
    private _url;
    private _map;
    private _style;
    private _colorScale;
    /** Gets the parent map */
    map: FlexMap;
    /** Gets or sets the layer's style. */
    style: any;
    /**
     * Gets or sets a data source for the layer.
     *
     * Data source should be GeoJSON object(s).
     */
    itemsSource: any;
    /**
     * Occurs after the layer has been bound to a new items source.
     */
    readonly itemsSourceChanged: Event<MapLayerBase, EventArgs>;
    /**
     * Raises the {@link itemsSourceChanged} event.
     */
    onItemsSourceChanged(e: EventArgs): void;
    /** Get or sets the data source url. */
    url: string;
    /**
     * Gets or sets color scale used for fill layer's items.
     */
    colorScale: ColorScale;
    render(e: IRenderEngine, t: SVGTransform, g: SVGGElement): void;
    invalidate(): void;
    /**
     * Initializes the series by copying the properties from a given object.
     *
     * @param options JavaScript object containing initialization data for the series.
     */
    initialize(options: any): void;
    _applyStyle(e: IRenderEngine): void;
    _clearCache(): void;
    _loadUrl(): void;
    _setItems(value: any): void;
}
/**
 * Represents scatter map layer.
 *
 * The data for {@link ScatterMapLayer} is a collection of points in geographical coordinates.
 */
export declare class ScatterMapLayer extends MapLayerBase {
    private _binding;
    private _symbolSize;
    private _symbolMinSize;
    private _symbolMaxSize;
    private _index;
    private _prefix;
    private _elMap;
    private _xBnd;
    private _yBnd;
    private _szBnd;
    private _cBnd;
    private _szRange;
    private _hasBindings;
    /**
     * Initializes a new instance of the {@link ScatterMapLayer} class.
     *
     * @param options A JavaScript object containing initialization data
     * for the layer.
     */
    constructor(options?: any);
    /**
     * Gets or sets the symbol size.
     */
    symbolSize: number;
    /**
     * Gets or sets the minimal symbol size.
     *
     * For bubble plot.
     */
    symbolMinSize: number;
    /**
     * Gets or sets the maximal symbol size.
     *
     * For bubble plot.
     */
    symbolMaxSize: number;
    /**
     * Gets or sets a data source for the layer.
     *
     * Data source should be a collection of objects that provides geographical coordinates (longitude and latitude).
     * Object property or properties which contains coordinates are specified by {@link binding} property.
     */
    itemsSource: any;
    /**
     * Gets or sets the binding for the layer.
     *
     * The binding can include two comma-separated property names (longitude and latitude) 'lon,lat'
     * or a single property name that contain a pair of geographical coordinates.
     */
    binding: string;
    /**
     * Renders the layer.
     *
     * @param e Render engine.
     * @param t Svg transformation.
     * @param group SVG group element for the layer.
     */
    render(e: IRenderEngine, t: SVGTransform, group: SVGGElement): any;
    renderItem(e: IRenderEngine, item: any, x: number, y: number): void;
    getItemById(id: string): any;
    /**
     * Gets the layer bounds in geo coordinates.
     */
    getGeoBBox(): Rect;
    private getItemPos;
    private setId;
    private createId;
    private parseBindings;
}
/*! Type definitions for non-npm package geojson 7946.0
Project: https://geojson.org/
Definitions by: Jacob Bruun <https://github.com/cobster>
                Arne Schubert <https://github.com/atd-schubert>
                Jeff Jacobson <https://github.com/JeffJacobson>
                Ilia Choly <https://github.com/icholy>
                Dan Vanderkam <https://github.com/danvk>
Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
 
This project is licensed under the MIT license.
Copyrights are respective of each contributor listed at the beginning of each definition file.
 
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/
export declare module GeoJSON {
    /**
     * The valid values for the "type" property of GeoJSON geometry objects.
     * https://tools.ietf.org/html/rfc7946#section-1.4
     */
    type GeoJsonGeometryTypes = Geometry['type'];
    /**
     * The value values for the "type" property of GeoJSON Objects.
     * https://tools.ietf.org/html/rfc7946#section-1.4
     */
    type GeoJsonTypes = GeoJSON['type'];
    /**
     * Bounding box
     * https://tools.ietf.org/html/rfc7946#section-5
     */
    type BBox = [number, number, number, number] | [number, number, number, number, number, number];
    /**
     * A Position is an array of coordinates.
     * https://tools.ietf.org/html/rfc7946#section-3.1.1
     * Array should contain between two and three elements.
     * The previous GeoJSON specification allowed more elements (e.g., which could be used to represent M values),
     * but the current specification only allows X, Y, and (optionally) Z to be defined.
     */
    type Position = number[];
    /**
     * The base GeoJSON object.
     * https://tools.ietf.org/html/rfc7946#section-3
     * The GeoJSON specification also allows foreign members
     * (https://tools.ietf.org/html/rfc7946#section-6.1)
     * Developers should use "&" type in TypeScript or extend the interface
     * to add these foreign members.
     */
    interface GeoJsonObject {
        /**
         * Specifies the type of GeoJSON object.
         */
        type: GeoJsonTypes;
        /**
         * Bounding box of the coordinate range of the object's Geometries, Features, or Feature Collections.
         * The value of the bbox member is an array of length 2*n where n is the number of dimensions
         * represented in the contained geometries, with all axes of the most southwesterly point
         * followed by all axes of the more northeasterly point.
         * The axes order of a bbox follows the axes order of geometries.
         * https://tools.ietf.org/html/rfc7946#section-5
         */
        bbox?: BBox;
    }
    /**
     * Union of GeoJSON objects.
     */
    type GeoJSON = Geometry | Feature | FeatureCollection;
    /**
     * Geometry object.
     * https://tools.ietf.org/html/rfc7946#section-3
     */
    type Geometry = Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon | GeometryCollection;
    type GeometryObject = Geometry;
    /**
     * Point geometry object.
     * https://tools.ietf.org/html/rfc7946#section-3.1.2
     */
    interface Point extends GeoJsonObject {
        type: "Point";
        coordinates: Position;
    }
    /**
     * MultiPoint geometry object.
     *  https://tools.ietf.org/html/rfc7946#section-3.1.3
     */
    interface MultiPoint extends GeoJsonObject {
        type: "MultiPoint";
        coordinates: Position[];
    }
    /**
     * LineString geometry object.
     * https://tools.ietf.org/html/rfc7946#section-3.1.4
     */
    interface LineString extends GeoJsonObject {
        type: "LineString";
        coordinates: Position[];
    }
    /**
     * MultiLineString geometry object.
     * https://tools.ietf.org/html/rfc7946#section-3.1.5
     */
    interface MultiLineString extends GeoJsonObject {
        type: "MultiLineString";
        coordinates: Position[][];
    }
    /**
     * Polygon geometry object.
     * https://tools.ietf.org/html/rfc7946#section-3.1.6
     */
    interface Polygon extends GeoJsonObject {
        type: "Polygon";
        coordinates: Position[][];
    }
    /**
     * MultiPolygon geometry object.
     * https://tools.ietf.org/html/rfc7946#section-3.1.7
     */
    interface MultiPolygon extends GeoJsonObject {
        type: "MultiPolygon";
        coordinates: Position[][][];
    }
    /**
     * Geometry Collection
     * https://tools.ietf.org/html/rfc7946#section-3.1.8
     */
    interface GeometryCollection extends GeoJsonObject {
        type: "GeometryCollection";
        geometries: Geometry[];
    }
    type GeoJsonProperties = {
        [name: string]: any;
    } | null;
    /**
     * A feature object which contains a geometry and associated properties.
     * https://tools.ietf.org/html/rfc7946#section-3.2
     */
    interface Feature<G extends Geometry | null = Geometry, P = GeoJsonProperties> extends GeoJsonObject {
        type: "Feature";
        /**
         * The feature's geometry
         */
        geometry: G;
        /**
         * A value that uniquely identifies this feature in a
         * https://tools.ietf.org/html/rfc7946#section-3.2.
         */
        id?: string | number;
        /**
         * Properties associated with this feature.
         */
        properties: P;
    }
    /**
     * A collection of feature objects.
     *  https://tools.ietf.org/html/rfc7946#section-3.3
     */
    interface FeatureCollection<G extends Geometry | null = Geometry, P = GeoJsonProperties> extends GeoJsonObject {
        type: "FeatureCollection";
        features: Array<Feature<G, P>>;
    }
}
export declare class _GeoJsonRender {
    private _map;
    private _index;
    prefix: string;
    converter: _IConverter;
    hasPoints: boolean;
    symbolSize: number;
    convert(pt: Point): Point;
    render(engine: IRenderEngine, geoJson: GeoJSON.GeoJSON, itemFormatter?: (e: IRenderEngine, f: GeoJSON.Feature) => void): void;
    renderFeature(engine: IRenderEngine, f: GeoJSON.Feature<GeoJSON.Geometry, {
        [name: string]: any;
    }>, itemFormatter?: (e: IRenderEngine, f: GeoJSON.Feature) => void): void;
    renderGeometry(engine: IRenderEngine, g: GeoJSON.Geometry, id?: string): void;
    renderPoint(engine: IRenderEngine, point: GeoJSON.Point, id?: string): void;
    renderMultiPoint(engine: IRenderEngine, multiPoint: GeoJSON.MultiPoint, id?: string): void;
    renderLineString(engine: IRenderEngine, lineString: GeoJSON.LineString, id?: string): void;
    renderMultiLineString(engine: IRenderEngine, multiLineString: GeoJSON.MultiLineString, id?: string): void;
    renderMultiPolygon(e: IRenderEngine, o: GeoJSON.MultiPolygon, id?: string): void;
    renderPolygon(e: IRenderEngine, o: GeoJSON.Polygon, id?: string): void;
    getFeatureById(id: string): GeoJSON.Feature;
    getAllFeatures(geoJson: GeoJSON.GeoJSON): any[];
    getBBox(geoJson: GeoJSON.GeoJSON): Rect;
    getGeometryBBox(g: GeoJSON.Geometry, rect0?: Rect): Rect;
    getRect(coords: number[], rect0?: Rect): Rect;
    hitTest(geoJson: GeoJSON.GeoJSON, x: number, y: number): any;
    private setAttribute;
    private createId;
    private flat;
}
export declare class _GeoJsonHitTest {
    static hitTest(geoJson: GeoJSON.GeoJSON, x: number, y: number): boolean;
    static hitTestPolygon(poly: GeoJSON.Polygon, x: number, y: number): boolean;
    static hitTestMultiPolygon(mpoly: GeoJSON.MultiPolygon, x: number, y: number): boolean;
    static hitTestGeometry(g: GeoJSON.Geometry, x: number, y: number): boolean;
    static contains(pts: number[][], x: number, y: number): boolean;
    static west(x1: number, y1: number, x2: number, y2: number, x: number, y: number): boolean;
}
/**
 * Represents a map layer with geographical data.
 */
export declare class GeoMapLayer extends MapLayerBase {
    private _render;
    private _g;
    private _ifmt;
    private _symbolSize;
    /**
     * Initializes a new instance of the {@link GeoMapLayer} class.
     *
     * @param options A JavaScript object containing initialization data
     * for the layer.
     */
    constructor(options?: any);
    /** Gets or sets a item formatter for GeoJSON feature. */
    itemFormatter: (e: IRenderEngine, f: GeoJSON.Feature) => void;
    /**
     * Gets all GeoJSON features on the layer.
     */
    getAllFeatures(): any[];
    /**
     * Renders the layer.
     *
     * @param e Render engine.
     * @param t Svg transformation.
     * @param group SVG group element for the layer.
     */
    render(e: IRenderEngine, t: SVGTransform, group: SVGGElement): any;
    /**
     * Gets the layer bounds in geo coordinates.
     */
    getGeoBBox(f?: GeoJSON.GeoJSON): Rect;
    /**
     * Gets or sets the symbol size for rendering GeoJSON points/multi-points.
     */
    symbolSize: number;
    _clearCache(): void;
    _getFeatureById(id: string): GeoJSON.Feature;
    _hitTest(x: number, y: number): any;
}
export declare class GeoGridLayer extends MapLayerBase {
    constructor();
    render(e: IRenderEngine, t: SVGTransform, group: SVGGElement): any;
    private isValid;
}
export {};
