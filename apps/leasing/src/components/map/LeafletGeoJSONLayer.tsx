import { useEffect, useRef } from "react";
import L from "leaflet";
import { useLeafletMap, type LeafletLayerContainer } from "./LeafletMapContext";

type Props = {
  layerContainer?: LeafletLayerContainer | null;
  data: GeoJSON.GeoJsonObject;
  style?: L.PathOptions;
  onEachFeature?: (feature: GeoJSON.Feature, layer: L.Layer) => void;
};

const LeafletGeoJSONLayer = ({
  layerContainer: layerContainerProp,
  data,
  style,
  onEachFeature,
}: Props) => {
  const contextLayerContainer = useLeafletMap();
  const layerContainer =
    layerContainerProp === undefined
      ? contextLayerContainer
      : layerContainerProp;
  const onEachFeatureRef = useRef(onEachFeature);

  onEachFeatureRef.current = onEachFeature;

  useEffect(() => {
    if (!layerContainer) {
      return;
    }

    const layer = L.geoJSON(data, {
      style,
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
