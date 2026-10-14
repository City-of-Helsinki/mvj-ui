import { useCallback } from "react";
import L from "leaflet";
import type { EscapedHtml } from "@/util/html";

type Options = {
  isHoverEnabled?: (feature: GeoJSON.Feature) => boolean;
  getPopupContent?: (feature: GeoJSON.Feature) => EscapedHtml | undefined;
  isHighlighted?: (feature: GeoJSON.Feature) => boolean;
  onClick?: (feature: GeoJSON.Feature, event: L.LeafletMouseEvent) => void;
  openHighlightedPopup?: boolean;
};

const useGeoJsonFeatureInteractions = ({
  isHoverEnabled = () => true,
  getPopupContent,
  isHighlighted,
  onClick,
  openHighlightedPopup = true,
}: Options) => {
  return useCallback(
    (feature: GeoJSON.Feature, layer: L.Layer) => {
      const popupContent = getPopupContent?.(feature);

      if (popupContent) {
        layer.bindPopup(popupContent);
      }

      if (isHighlighted?.(feature) && layer instanceof L.Path) {
        layer.setStyle({ fillOpacity: 0.9 });
        if (openHighlightedPopup) {
          window.setTimeout(() => layer.openPopup(), 100);
        }
      }

      layer.on({
        click: (event: L.LeafletMouseEvent) => onClick?.(feature, event),
        mouseover: () => {
          if (isHoverEnabled(feature) && layer instanceof L.Path) {
            layer.setStyle({ fillOpacity: 0.7 });
          }
        },
        mouseout: () => {
          if (isHoverEnabled(feature) && layer instanceof L.Path) {
            layer.setStyle({ fillOpacity: 0.2 });
          }
        },
      });
    },
    [
      getPopupContent,
      isHighlighted,
      isHoverEnabled,
      onClick,
      openHighlightedPopup,
    ],
  );
};

export default useGeoJsonFeatureInteractions;
