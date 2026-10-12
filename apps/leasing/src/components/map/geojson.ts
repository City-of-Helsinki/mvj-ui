import type L from "leaflet";

export type DrawnPolygonFeature = GeoJSON.Feature<
  GeoJSON.Polygon | GeoJSON.MultiPolygon
>;

export type GeoJsonPolygonLayer = L.Polygon & {
  toGeoJSON: () => DrawnPolygonFeature;
};

export const mergePolygonFeaturesToMultiPolygon = (
  features: Array<DrawnPolygonFeature>,
): GeoJSON.MultiPolygon => ({
  coordinates: features.flatMap((feature) =>
    feature.geometry.type === "Polygon"
      ? [feature.geometry.coordinates]
      : feature.geometry.coordinates,
  ),
  type: "MultiPolygon",
});
