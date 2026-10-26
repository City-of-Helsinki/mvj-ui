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
      const bounds = getMapBounds();
      if (bounds) {
        map.fitBounds(bounds);
      }
    },
    [geometry, getMapBounds],
  );

  useEffect(() => {
    if (!geoJsonLayerRef.current) return;

    geoJsonLayerRef.current.clearLayers();
    if (!getCoordinatesOfGeometry(geometry).length) return;

    geoJsonLayerRef.current.addData(geometry as GeoJSON.GeoJsonObject);
    const bounds = getMapBounds();
    if (bounds) {
      mapRef.current?.fitBounds(bounds);
    }
  }, [geometry, getMapBounds]);

  if (!geometry || !getCoordinatesOfGeometry(geometry).length) {
    return <p>{"Ei geometriaa."}</p>;
  }

  const center = getMapCenter();
  const bounds = getMapBounds() ?? undefined;
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
