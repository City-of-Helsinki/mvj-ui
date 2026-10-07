import { useEffect, useRef } from "react";
import L from "leaflet";
import { useLeafletMap } from "./LeafletMapContext";

type Props = {
  map?: L.Map | null;
  data: GeoJSON.GeoJsonObject;
  style?: L.PathOptions;
  onEachFeature?: (feature: GeoJSON.Feature, layer: L.Layer) => void;
};

const LeafletGeoJSONLayer = ({
  map: mapProp,
  data,
  style,
  onEachFeature,
}: Props) => {
  const contextMap = useLeafletMap();
  const map = mapProp === undefined ? contextMap : mapProp;
  const onEachFeatureRef = useRef(onEachFeature);

  onEachFeatureRef.current = onEachFeature;

  useEffect(() => {
    if (!map) {
      return;
    }

    const layer = L.geoJSON(data, {
      style,
      onEachFeature: (feature, featureLayer) => {
        onEachFeatureRef.current?.(feature, featureLayer);
      },
    }).addTo(map);

    return () => {
      layer.removeFrom(map);
    };
  }, [data, map, style]);

  return null;
};

export default LeafletGeoJSONLayer;
