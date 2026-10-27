import { useEffect, useRef } from "react";
import L from "leaflet";
import { isEqual } from "lodash-es";
import { useLeafletMap } from "@/components/map/LeafletMapContext";
import { DEFAULT_LEAFLET_PATH_OPTIONS } from "@/components/map/mapStyles";

type Props = {
  data: GeoJSON.GeoJsonObject;
  style?: L.PathOptions;
  onEachFeature?: (feature: GeoJSON.Feature, layer: L.Layer) => void;
};

const LeafletGeoJSONLayer = ({ data, style, onEachFeature }: Props) => {
  const layerContainer = useLeafletMap();
  // Callers pass inline style objects; keep the previous one while the value is equal.
  const styleRef = useRef(style);
  if (!isEqual(styleRef.current, style)) {
    styleRef.current = style;
  }
  const stableStyle = styleRef.current;

  useEffect(() => {
    if (!layerContainer) {
      return;
    }

    const layer = L.geoJSON(data, {
      style: { ...DEFAULT_LEAFLET_PATH_OPTIONS, ...stableStyle },
      onEachFeature: (feature, featureLayer) => {
        onEachFeature?.(feature, featureLayer);
      },
    });

    layerContainer.addLayer(layer);

    return () => {
      layerContainer.removeLayer(layer);
    };
  }, [data, layerContainer, onEachFeature, stableStyle]);

  return null;
};

export default LeafletGeoJSONLayer;
