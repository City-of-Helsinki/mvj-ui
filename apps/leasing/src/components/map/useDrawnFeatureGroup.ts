import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { throttle } from "lodash-es";
import type {
  DrawnPolygonFeature,
  GeoJsonPolygonLayer,
} from "@/components/map/geojson";
import {
  showMeasurements,
  updateMeasurements,
} from "@/components/map/measurements";
import { localizeMap } from "@/util/map";

/** Shared state for maps where the user draws polygons into a feature group. */
const useDrawnFeatureGroup = () => {
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [featureGroup, setFeatureGroup] = useState<L.FeatureGroup | null>(null);

  const handleMapReady = useCallback((leafletMap: L.Map) => {
    const group = L.featureGroup().addTo(leafletMap);
    localizeMap(leafletMap);
    featureGroupRef.current = group;
    mapRef.current = leafletMap;
    setMap(leafletMap);
    setFeatureGroup(group);
  }, []);

  const handleNonCommittedChange = useMemo(
    () =>
      throttle(
        () => {
          featureGroupRef.current?.eachLayer((layer: any) => {
            showMeasurements(layer, mapRef.current);
            updateMeasurements(layer);
          });
        },
        1000 / 60,
        { leading: true, trailing: true },
      ),
    [],
  );

  useEffect(
    () => () => handleNonCommittedChange.cancel(),
    [handleNonCommittedChange],
  );

  const getDrawnFeatures = useCallback(() => {
    const features: Array<DrawnPolygonFeature> = [];
    featureGroupRef.current?.eachLayer((layer: GeoJsonPolygonLayer) =>
      features.push(layer.toGeoJSON()),
    );
    return features;
  }, []);

  return {
    featureGroup,
    featureGroupRef,
    getDrawnFeatures,
    handleMapReady,
    handleNonCommittedChange,
    map,
  };
};

export default useDrawnFeatureGroup;
