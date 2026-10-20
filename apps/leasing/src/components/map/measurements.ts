import L from "leaflet";
import { getPolygonArea } from "@/util/map";

const MIN_SEGMENT_PIXEL_DISTANCE = 30;

type MeasurableLayer = L.Polyline | L.Circle;

const measurementLayers = new WeakMap<MeasurableLayer, L.LayerGroup>();
const zoomHandlers = new WeakMap<MeasurableLayer, () => void>();
const removeHandlers = new WeakMap<MeasurableLayer, L.LeafletEventHandlerFn>();

const formatDistance = (meters: number): string => {
  const value = meters > 1000 ? meters / 1000 : meters;
  const unit = meters > 1000 ? "km" : "m";

  return value < 100
    ? `${value.toFixed(1)} ${unit}`
    : `${Math.round(value)} ${unit}`;
};

const formatArea = (squareMeters: number): string => {
  const value = squareMeters > 1000000 ? squareMeters / 1000000 : squareMeters;
  const unit = squareMeters > 1000000 ? "km²" : "m²";

  return value < 100
    ? `${value.toFixed(1)} ${unit}`
    : `${Math.round(value)} ${unit}`;
};

const getLatLngRings = (layer: L.Polyline): L.LatLng[][] => {
  const latLngs = layer.getLatLngs() as L.LatLng[] | L.LatLng[][];
  return Array.isArray(latLngs[0])
    ? (latLngs as L.LatLng[][])
    : [latLngs as L.LatLng[]];
};

const createMeasurementMarker = (
  latLng: L.LatLng,
  measurement: string,
  rotation = 0,
): L.Marker =>
  L.marker(latLng, {
    icon: L.divIcon({
      className: "map-measurement",
      html: `<div style="transform: translate(-50%, -50%) rotate(${rotation}rad)">${measurement}</div>`,
      iconSize: [0, 0],
    }),
    interactive: false,
    keyboard: false,
    pmIgnore: true,
    snapIgnore: true,
  });

const getMap = (layer: MeasurableLayer): L.Map | undefined =>
  (layer as MeasurableLayer & { _map?: L.Map })._map;

const hideMeasurements = (layer: MeasurableLayer): void => {
  const map = getMap(layer);
  const layerGroup = measurementLayers.get(layer);
  const handleZoom = zoomHandlers.get(layer);
  const handleRemove = removeHandlers.get(layer);

  if (map && handleZoom) {
    map.off("zoomend", handleZoom);
  }
  if (map && layerGroup) {
    map.removeLayer(layerGroup);
  }

  measurementLayers.delete(layer);
  zoomHandlers.delete(layer);
  removeHandlers.delete(layer);
  if (handleRemove) {
    layer.off("remove", handleRemove);
  }
};

const addSegmentMeasurements = (
  layerGroup: L.LayerGroup,
  map: L.Map,
  latLngs: L.LatLng[],
  isPolygon: boolean,
): void => {
  const segmentCount = isPolygon ? latLngs.length : latLngs.length - 1;

  for (let index = 0; index < segmentCount; index += 1) {
    const start = latLngs[index];
    const end = latLngs[(index + 1) % latLngs.length];
    const startPoint = map.latLngToLayerPoint(start);
    const endPoint = map.latLngToLayerPoint(end);

    if (startPoint.distanceTo(endPoint) < MIN_SEGMENT_PIXEL_DISTANCE) {
      continue;
    }

    const midpoint = map.layerPointToLatLng(
      L.point((startPoint.x + endPoint.x) / 2, (startPoint.y + endPoint.y) / 2),
    );
    const rotation = Math.atan(
      (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x),
    );
    layerGroup.addLayer(
      createMeasurementMarker(
        midpoint,
        formatDistance(start.distanceTo(end)),
        rotation,
      ),
    );
  }
};

export const showMeasurements = (layer: L.Layer): void => {
  if (!(layer instanceof L.Polyline) && !(layer instanceof L.Circle)) {
    return;
  }

  const map = getMap(layer);
  if (!map || measurementLayers.has(layer)) {
    return;
  }

  const layerGroup = L.layerGroup().addTo(map);
  const handleZoom = () => updateMeasurements(layer);
  const handleRemove = () => hideMeasurements(layer);
  measurementLayers.set(layer, layerGroup);
  zoomHandlers.set(layer, handleZoom);
  removeHandlers.set(layer, handleRemove);
  map.on("zoomend", handleZoom);
  layer.on("remove", handleRemove);
  updateMeasurements(layer);
};

export const updateMeasurements = (layer: L.Layer): void => {
  if (!(layer instanceof L.Polyline) && !(layer instanceof L.Circle)) {
    return;
  }

  const map = getMap(layer);
  const layerGroup = measurementLayers.get(layer);
  if (!map || !layerGroup) {
    return;
  }

  layerGroup.clearLayers();

  if (layer instanceof L.Circle) {
    layerGroup.addLayer(
      createMeasurementMarker(
        layer.getLatLng(),
        formatArea(Math.PI * layer.getRadius() ** 2),
      ),
    );
    return;
  }

  const latLngRings = getLatLngRings(layer);
  const outerRing = latLngRings[0];
  if (!outerRing || outerRing.length < 2) {
    return;
  }

  const isPolygon = layer instanceof L.Polygon;
  addSegmentMeasurements(layerGroup, map, outerRing, isPolygon);

  if (isPolygon && outerRing.length > 2) {
    layerGroup.addLayer(
      createMeasurementMarker(
        layer.getBounds().getCenter(),
        formatArea(getPolygonArea(latLngRings)),
      ),
    );
  }
};
