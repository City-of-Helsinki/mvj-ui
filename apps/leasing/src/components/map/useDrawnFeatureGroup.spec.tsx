import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import L from "leaflet";

vi.mock("@/util/map", () => ({ localizeMap: vi.fn() }));
vi.mock("@/components/map/measurements", () => ({
  showMeasurements: vi.fn(),
  updateMeasurements: vi.fn(),
}));

import useDrawnFeatureGroup from "@/components/map/useDrawnFeatureGroup";
import { localizeMap } from "@/util/map";
import {
  showMeasurements,
  updateMeasurements,
} from "@/components/map/measurements";

const createMap = () => L.map(document.createElement("div"));

const createPolygon = () =>
  L.polygon([
    [0, 0],
    [0, 1],
    [1, 1],
  ]);

describe("useDrawnFeatureGroup", () => {
  it("has no map or feature group before the map is ready", () => {
    const { result } = renderHook(() => useDrawnFeatureGroup());

    expect(result.current.map).toBeNull();
    expect(result.current.featureGroup).toBeNull();
    expect(result.current.getDrawnFeatures()).toEqual([]);
  });

  it("creates a feature group on the map and localizes it when the map is ready", () => {
    const { result } = renderHook(() => useDrawnFeatureGroup());
    const map = createMap();

    act(() => result.current.handleMapReady(map));

    expect(result.current.map).toBe(map);
    expect(result.current.featureGroup).toBeInstanceOf(L.FeatureGroup);
    expect(map.hasLayer(result.current.featureGroup!)).toBe(true);
    expect(localizeMap).toHaveBeenCalledWith(map);
  });

  it("returns the GeoJSON of every drawn layer", () => {
    const { result } = renderHook(() => useDrawnFeatureGroup());
    act(() => result.current.handleMapReady(createMap()));
    result.current.featureGroup!.addLayer(createPolygon());
    result.current.featureGroup!.addLayer(createPolygon());

    const features = result.current.getDrawnFeatures();

    expect(features).toHaveLength(2);
    expect(features[0].geometry.type).toBe("Polygon");
  });

  it("updates measurements of drawn layers when a change is not yet committed", () => {
    const { result } = renderHook(() => useDrawnFeatureGroup());
    const map = createMap();
    act(() => result.current.handleMapReady(map));
    const layer = createPolygon();
    result.current.featureGroup!.addLayer(layer);

    result.current.handleNonCommittedChange();

    expect(showMeasurements).toHaveBeenCalledWith(layer, map);
    expect(updateMeasurements).toHaveBeenCalledWith(layer);
  });

  it("keeps stable callbacks across re-renders", () => {
    const { result, rerender } = renderHook(() => useDrawnFeatureGroup());
    const { getDrawnFeatures, handleMapReady, handleNonCommittedChange } =
      result.current;

    rerender();

    expect(result.current.getDrawnFeatures).toBe(getDrawnFeatures);
    expect(result.current.handleMapReady).toBe(handleMapReady);
    expect(result.current.handleNonCommittedChange).toBe(
      handleNonCommittedChange,
    );
  });
});
