import { useCallback } from "react";
import L from "leaflet";
import type { EscapedHtml } from "@/util/html";
import {
  DEFAULT_LEAFLET_PATH_OPTIONS,
  FEATURE_HIGHLIGHT_FILL_OPACITY,
  FEATURE_HOVER_FILL_OPACITY,
} from "@/components/map/mapStyles";

type Options = {
  isHoverEnabled?: (feature: GeoJSON.Feature) => boolean;
  getPopupContent?: (feature: GeoJSON.Feature) => EscapedHtml | undefined;
  isHighlighted?: (feature: GeoJSON.Feature) => boolean;
  onClick?: (feature: GeoJSON.Feature, event: L.LeafletMouseEvent) => void;
  openHighlightedPopup?: boolean;
};

const isHoverEnabledByDefault: NonNullable<Options["isHoverEnabled"]> = () =>
  true;

const useGeoJsonFeatureInteractions = ({
  isHoverEnabled = isHoverEnabledByDefault,
  getPopupContent,
  isHighlighted,
  onClick,
  openHighlightedPopup = true,
}: Options) => {
  return useCallback(
    (feature: GeoJSON.Feature, layer: L.Layer) => {
      const popupContent = getPopupContent?.(feature);
      const defaultFillOpacity =
        layer instanceof L.Path ? layer.options.fillOpacity : undefined;

      if (popupContent) {
        layer.bindPopup(popupContent);
      }

      if (isHighlighted?.(feature) && layer instanceof L.Path) {
        layer.setStyle({ fillOpacity: FEATURE_HIGHLIGHT_FILL_OPACITY });
        if (openHighlightedPopup) {
          window.setTimeout(() => layer.openPopup(), 100);
        }
      }

      layer.on({
        click: (event: L.LeafletMouseEvent) => onClick?.(feature, event),
        mouseover: () => {
          if (isHoverEnabled(feature) && layer instanceof L.Path) {
            layer.setStyle({ fillOpacity: FEATURE_HOVER_FILL_OPACITY });
          }
        },
        mouseout: () => {
          if (isHoverEnabled(feature) && layer instanceof L.Path) {
            layer.setStyle({
              fillOpacity: isHighlighted?.(feature)
                ? FEATURE_HIGHLIGHT_FILL_OPACITY
                : (defaultFillOpacity ??
                  DEFAULT_LEAFLET_PATH_OPTIONS.fillOpacity),
            });
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
