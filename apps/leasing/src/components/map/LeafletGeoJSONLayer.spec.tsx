import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import L from "leaflet";
import React from "react";
import LeafletGeoJSONLayer from "@/components/map/LeafletGeoJSONLayer";
import { LeafletMapContext } from "@/components/map/LeafletMapContext";

const createData = (): GeoJSON.FeatureCollection => ({
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
});

const renderLayer = (
  group: L.LayerGroup,
  props: React.ComponentProps<typeof LeafletGeoJSONLayer>,
) => (
  <LeafletMapContext.Provider value={group}>
    <LeafletGeoJSONLayer {...props} />
  </LeafletMapContext.Provider>
);

describe("LeafletGeoJSONLayer", () => {
  it("keeps the layer when an equal inline style is passed again", () => {
    const group = L.layerGroup();
    const data = createData();
    const { rerender } = render(
      renderLayer(group, { data, style: { color: "red" } }),
    );
    const [firstLayer] = group.getLayers();

    rerender(renderLayer(group, { data, style: { color: "red" } }));

    expect(group.getLayers()).toHaveLength(1);
    expect(group.getLayers()[0]).toBe(firstLayer);
  });

  it("rebuilds the layer when the style value changes", () => {
    const group = L.layerGroup();
    const data = createData();
    const { rerender } = render(
      renderLayer(group, { data, style: { color: "red" } }),
    );
    const [firstLayer] = group.getLayers();

    rerender(renderLayer(group, { data, style: { color: "blue" } }));

    expect(group.getLayers()).toHaveLength(1);
    expect(group.getLayers()[0]).not.toBe(firstLayer);
  });

  it("rebuilds the layer when the data changes", () => {
    const group = L.layerGroup();
    const { rerender } = render(renderLayer(group, { data: createData() }));
    const [firstLayer] = group.getLayers();

    rerender(renderLayer(group, { data: createData() }));

    expect(group.getLayers()).toHaveLength(1);
    expect(group.getLayers()[0]).not.toBe(firstLayer);
  });

  it("rebuilds the layer when onEachFeature changes", () => {
    const group = L.layerGroup();
    const data = createData();
    const { rerender } = render(
      renderLayer(group, { data, onEachFeature: () => undefined }),
    );
    const [firstLayer] = group.getLayers();

    rerender(renderLayer(group, { data, onEachFeature: () => undefined }));

    expect(group.getLayers()[0]).not.toBe(firstLayer);
  });

  it("removes the layer on unmount", () => {
    const group = L.layerGroup();
    const { unmount } = render(renderLayer(group, { data: createData() }));

    unmount();

    expect(group.getLayers()).toHaveLength(0);
  });
});
