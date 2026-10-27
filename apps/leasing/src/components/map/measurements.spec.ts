import { describe, expect, it } from "vitest";
import L from "leaflet";
import {
  showMeasurements,
  updateMeasurements,
} from "@/components/map/measurements";

const createMap = () => L.map(document.createElement("div")).setView([0, 0], 5);

const square = (side: number) =>
  L.polygon([
    [0, 0],
    [0, side],
    [side, side],
    [side, 0],
  ]);

const getLabels = (map: L.Map): string[] => {
  const labels: string[] = [];
  map.eachLayer((layer) => {
    const icon = layer instanceof L.Marker ? layer.options.icon : undefined;
    if (icon?.options.className === "map-measurement") {
      labels.push((icon as L.DivIcon).options.html as string);
    }
  });
  return labels;
};

describe("measurements", () => {
  it("labels each long segment and the area of a polygon", () => {
    const map = createMap();
    const polygon = square(10).addTo(map);

    showMeasurements(polygon, map);

    const labels = getLabels(map);
    expect(labels).toHaveLength(5);
    expect(labels.filter((label) => label.includes("km²"))).toHaveLength(1);
  });

  it("measures a layer that is shown through a feature group", () => {
    const map = createMap();
    const featureGroup = L.featureGroup().addTo(map);
    const polygon = square(10);
    featureGroup.addLayer(polygon);

    showMeasurements(polygon, map);

    expect(getLabels(map)).toHaveLength(5);
  });

  it("labels the area of a circle", () => {
    const map = createMap();
    const circle = L.circle([0, 0], { radius: 500 }).addTo(map);

    showMeasurements(circle, map);

    expect(getLabels(map)).toEqual([expect.stringContaining("m²")]);
  });

  it("skips segments that are too short to label on screen", () => {
    const map = createMap();
    const polygon = square(0.001).addTo(map);

    showMeasurements(polygon, map);

    expect(getLabels(map)).toEqual([expect.stringContaining("m²")]);
  });

  it("does nothing when the layer is not on the map", () => {
    const map = createMap();

    showMeasurements(square(10), map);

    expect(getLabels(map)).toEqual([]);
  });

  it("does nothing without a map", () => {
    expect(() =>
      showMeasurements(square(10).addTo(createMap()), null),
    ).not.toThrow();
  });

  it("ignores layers that cannot be measured", () => {
    const map = createMap();
    const marker = L.marker([0, 0]).addTo(map);

    showMeasurements(marker, map);

    expect(getLabels(map)).toEqual([]);
  });

  it("does not add the labels twice", () => {
    const map = createMap();
    const polygon = square(10).addTo(map);

    showMeasurements(polygon, map);
    showMeasurements(polygon, map);

    expect(getLabels(map)).toHaveLength(5);
  });

  it("recalculates the labels when asked to update", () => {
    const map = createMap();
    const polygon = square(0.001).addTo(map);
    showMeasurements(polygon, map);
    expect(getLabels(map)).toHaveLength(1);

    polygon.setLatLngs([
      [
        [0, 0],
        [0, 10],
        [10, 10],
        [10, 0],
      ],
    ]);
    updateMeasurements(polygon);

    expect(getLabels(map)).toHaveLength(5);
  });

  it("ignores an update for a layer that was never measured", () => {
    const map = createMap();
    const polygon = square(10).addTo(map);

    updateMeasurements(polygon);

    expect(getLabels(map)).toEqual([]);
  });

  it("recalculates the labels when the zoom changes", () => {
    const map = createMap();
    const polygon = square(2).addTo(map);
    showMeasurements(polygon, map);
    expect(getLabels(map)).toHaveLength(5);

    map.setZoom(3, { animate: false });

    expect(getLabels(map)).toHaveLength(1);
  });

  it("removes the labels and stops listening when the layer is removed", () => {
    const map = createMap();
    const polygon = square(10).addTo(map);
    showMeasurements(polygon, map);

    polygon.remove();
    map.fire("zoomend");

    expect(getLabels(map)).toEqual([]);
  });

  it("can measure the layer again after it was removed and re-added", () => {
    const map = createMap();
    const polygon = square(10).addTo(map);
    showMeasurements(polygon, map);
    polygon.remove();

    polygon.addTo(map);
    showMeasurements(polygon, map);

    expect(getLabels(map)).toHaveLength(5);
  });
});
