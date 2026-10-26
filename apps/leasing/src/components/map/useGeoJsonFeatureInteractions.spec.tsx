import { describe, expect, it, vi } from "vitest";
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
});
