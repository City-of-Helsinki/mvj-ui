import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import L from "leaflet";
import useGeoJsonFeatureInteractions from "./useGeoJsonFeatureInteractions";
import { html } from "@/util/html";

const feature: GeoJSON.Feature = {
  type: "Feature",
  properties: {},
  geometry: { type: "Point", coordinates: [0, 0] },
};

const createLayer = () =>
  L.polygon([
    [0, 0],
    [0, 1],
    [1, 1],
  ]);

describe("useGeoJsonFeatureInteractions", () => {
  it("returns the same callback when only popup, click and hover inputs change", () => {
    const { result, rerender } = renderHook(
      (props) => useGeoJsonFeatureInteractions(props),
      {
        initialProps: {
          getPopupContent: () => html`<p>old</p>`,
          isHoverEnabled: () => true,
          onClick: () => undefined,
        },
      },
    );
    const first = result.current;

    rerender({
      getPopupContent: () => html`<p>new</p>`,
      isHoverEnabled: () => false,
      onClick: () => undefined,
    });

    expect(result.current).toBe(first);
  });

  it("returns a new callback when isHighlighted changes", () => {
    const { result, rerender } = renderHook(
      (props) => useGeoJsonFeatureInteractions(props),
      { initialProps: { isHighlighted: () => false } },
    );
    const first = result.current;

    rerender({ isHighlighted: () => true });

    expect(result.current).not.toBe(first);
  });

  it("builds popup content from the latest getPopupContent when opened", () => {
    const { result, rerender } = renderHook(
      (props) => useGeoJsonFeatureInteractions(props),
      { initialProps: { getPopupContent: () => html`<p>old</p>` } },
    );
    const layer = createLayer();
    result.current(feature, layer);

    rerender({ getPopupContent: () => html`<p>new</p>` });

    const content = layer.getPopup()?.getContent() as () => string;
    expect(content()).toBe("<p>new</p>");
  });

  it("does not bind a popup when there is no popup content", () => {
    const { result } = renderHook(() =>
      useGeoJsonFeatureInteractions({ getPopupContent: () => undefined }),
    );
    const layer = createLayer();

    result.current(feature, layer);

    expect(layer.getPopup()).toBeUndefined();
  });

  it("calls the latest onClick", () => {
    const oldOnClick = vi.fn();
    const newOnClick = vi.fn();
    const { result, rerender } = renderHook(
      (props) => useGeoJsonFeatureInteractions(props),
      { initialProps: { onClick: oldOnClick } },
    );
    const layer = createLayer();
    result.current(feature, layer);

    rerender({ onClick: newOnClick });
    layer.fire("click");

    expect(oldOnClick).not.toHaveBeenCalled();
    expect(newOnClick).toHaveBeenCalledTimes(1);
  });

  it("uses the latest isHoverEnabled on mouseover", () => {
    const { result, rerender } = renderHook(
      (props) => useGeoJsonFeatureInteractions(props),
      { initialProps: { isHoverEnabled: () => true } },
    );
    const layer = createLayer();
    result.current(feature, layer);
    const initialOpacity = layer.options.fillOpacity;

    rerender({ isHoverEnabled: () => false });
    layer.fire("mouseover");

    expect(layer.options.fillOpacity).toBe(initialOpacity);
  });

  describe("highlighted popup", () => {
    const features: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [0, 0],
                [0, 1],
                [1, 1],
                [0, 0],
              ],
            ],
          },
        },
      ],
    };

    const buildLayer = (
      options: Parameters<typeof useGeoJsonFeatureInteractions>[0] = {},
    ) => {
      const { result } = renderHook(() =>
        useGeoJsonFeatureInteractions({
          getPopupContent: () => html`<p>popup</p>`,
          isHighlighted: () => true,
          ...options,
        }),
      );
      return L.geoJSON(features, { onEachFeature: result.current });
    };
    const createMap = () =>
      L.map(document.createElement("div")).setView([0, 0], 5);
    const isPopupOpen = (geoJson: L.GeoJSON) =>
      geoJson.getLayers()[0].isPopupOpen();

    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it("opens the popup of a highlighted feature shortly after the layer is shown", () => {
      const geoJson = buildLayer().addTo(createMap());

      expect(isPopupOpen(geoJson)).toBe(false);
      vi.advanceTimersByTime(100);

      expect(isPopupOpen(geoJson)).toBe(true);
    });

    it("does not open it when openHighlightedPopup is false", () => {
      const geoJson = buildLayer({ openHighlightedPopup: false }).addTo(
        createMap(),
      );

      vi.advanceTimersByTime(500);

      expect(isPopupOpen(geoJson)).toBe(false);
    });

    it("does not open it for a feature that is not highlighted", () => {
      const geoJson = buildLayer({ isHighlighted: () => false }).addTo(
        createMap(),
      );

      vi.advanceTimersByTime(500);

      expect(isPopupOpen(geoJson)).toBe(false);
    });

    it("does not try to open the popup of a layer removed before the timer fires", () => {
      const openPopup = vi.spyOn(L.Layer.prototype, "openPopup");
      const geoJson = buildLayer().addTo(createMap());

      geoJson.remove();
      vi.advanceTimersByTime(500);

      expect(openPopup).not.toHaveBeenCalled();
      expect(isPopupOpen(geoJson)).toBe(false);
      openPopup.mockRestore();
    });
  });
});
