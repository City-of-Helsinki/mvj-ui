import { useEffect, useRef } from "react";
import L from "leaflet";
import { useLeafletMap } from "./LeafletMapContext";
import { DEFAULT_LEAFLET_PATH_OPTIONS } from "./mapStyles";

type Props = {
  data: GeoJSON.GeoJsonObject;
  style?: L.PathOptions;
  onEachFeature?: (feature: GeoJSON.Feature, layer: L.Layer) => void;
};

const LeafletGeoJSONLayer = ({ data, style, onEachFeature }: Props) => {
  const layerContainer = useLeafletMap();
  const onEachFeatureRef = useRef(onEachFeature);

  onEachFeatureRef.current = onEachFeature;

  useEffect(() => {
    if (!layerContainer) {
      return;
    }

    const layer = L.geoJSON(data, {
      style: { ...DEFAULT_LEAFLET_PATH_OPTIONS, ...style },
      onEachFeature: (feature, featureLayer) => {
        onEachFeatureRef.current?.(feature, featureLayer);
      },
    });

    layerContainer.addLayer(layer);

    return () => {
      layerContainer.removeLayer(layer);
    };
  }, [data, layerContainer, style]);

  return null;
};

export default LeafletGeoJSONLayer;
