import { useCallback, useRef } from "react";
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
  // Read when events fire, so changing these doesn't rebuild the layer.
  const latest = useRef({ getPopupContent, isHoverEnabled, onClick });
  latest.current = { getPopupContent, isHoverEnabled, onClick };

  return useCallback(
    (feature: GeoJSON.Feature, layer: L.Layer) => {
      const defaultFillOpacity =
        layer instanceof L.Path ? layer.options.fillOpacity : undefined;

      if (latest.current.getPopupContent?.(feature)) {
        layer.bindPopup(() => latest.current.getPopupContent?.(feature) ?? "");
      }

      if (isHighlighted?.(feature) && layer instanceof L.Path) {
        layer.setStyle({ fillOpacity: FEATURE_HIGHLIGHT_FILL_OPACITY });
        if (openHighlightedPopup) {
          const timer = window.setTimeout(() => layer.openPopup(), 100);
          layer.once("remove", () => window.clearTimeout(timer));
        }
      }

      layer.on({
        click: (event: L.LeafletMouseEvent) =>
          latest.current.onClick?.(feature, event),
        mouseover: () => {
          if (
            latest.current.isHoverEnabled(feature) &&
            layer instanceof L.Path
          ) {
            layer.setStyle({ fillOpacity: FEATURE_HOVER_FILL_OPACITY });
          }
        },
        mouseout: () => {
          if (
            latest.current.isHoverEnabled(feature) &&
            layer instanceof L.Path
          ) {
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
    [isHighlighted, openHighlightedPopup],
  );
};

export default useGeoJsonFeatureInteractions;
