import React, { useCallback, useEffect, useRef } from "react";
import L from "leaflet";
import classNames from "classnames";
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/util/constants";
import MapContainer from "@/areaNote/components/MapContainer";
import {
  getBoundsFromFeatures,
  getCenterFromCoordinates,
  getCoordinatesOfGeometry,
} from "@/util/map";
import type { LeafletFeatureGeometry } from "types";
import { getAreaSearchFeatures } from "@/areaSearch/helpers";
type Props = {
  geometry: LeafletFeatureGeometry;
  minimap?: boolean;
};

const SingleAreaSearchMap = ({ geometry, minimap = false }: Props) => {
  const mapRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const getMapBounds = useCallback(() => {
    return getBoundsFromFeatures({
      features: getAreaSearchFeatures([
        {
          geometry,
        },
      ]),
    });
  }, [geometry]);
  const getMapCenter = useCallback(() => {
    return getCenterFromCoordinates(getCoordinatesOfGeometry(geometry));
  }, [geometry]);
  const handleMapReady = useCallback(
    (map: L.Map) => {
      mapRef.current = map;
      geoJsonLayerRef.current = L.geoJSON(
        geometry as GeoJSON.GeoJsonObject,
      ).addTo(map);
      map.fitBounds(getMapBounds() as L.LatLngBoundsExpression);
    },
    [geometry, getMapBounds],
  );

  useEffect(() => {
    if (!geoJsonLayerRef.current) return;

    geoJsonLayerRef.current.clearLayers();
    geoJsonLayerRef.current.addData(geometry as GeoJSON.GeoJsonObject);
    mapRef.current?.fitBounds(getMapBounds() as L.LatLngBoundsExpression);
  }, [geometry, getMapBounds]);

  if (!geometry) {
    return <p>{"Ei geometriaa."}</p>;
  }

  const center = getMapCenter() as L.LatLngExpression;
  const bounds = getMapBounds() as L.LatLngBoundsExpression;
  return (
    <div
      className={classNames("SingleAreaSearchMap", {
        map: !minimap,
        "SingleAreaSearchMap--minimap": minimap,
      })}
    >
      <MapContainer
        bounds={bounds}
        center={center ?? DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        enableSearch={false}
        onMapReady={handleMapReady}
      />
    </div>
  );
};

export default SingleAreaSearchMap;
