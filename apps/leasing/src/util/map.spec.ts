import { describe, expect, it } from "vitest";
import {
  getBoundsFromBBox,
  getBoundsFromCoordinates,
  getBoundsFromFeatures,
  getCenterFromCoordinates,
  getCoordinatesOfGeometry,
} from "./map";

// GeoJSON positions are [longitude, latitude].
const ring: Array<[number, number]> = [
  [24.945222, 60.176976],
  [24.945222, 60.179629],
  [24.957479, 60.179629],
  [24.957479, 60.176976],
  [24.945222, 60.176976],
];
const polygon = { type: "Polygon", coordinates: [ring] };
const multiPolygon = { type: "MultiPolygon", coordinates: [[ring]] };

const manyPositions = (count: number): Array<[number, number]> =>
  Array.from({ length: count }, (_, index) => [
    24 + (index % 1000) / 1000,
    60 + (index % 777) / 777,
  ]);

describe("getCoordinatesOfGeometry", () => {
  it("returns no coordinates for missing or empty geometry", () => {
    expect(getCoordinatesOfGeometry(null)).toEqual([]);
    expect(getCoordinatesOfGeometry(undefined)).toEqual([]);
    expect(
      getCoordinatesOfGeometry({ type: "Polygon", coordinates: [] }),
    ).toEqual([]);
    expect(getCoordinatesOfGeometry({ type: "GeometryCollection" })).toEqual(
      [],
    );
  });

  it("flattens a point, polygon and multipolygon to positions", () => {
    expect(
      getCoordinatesOfGeometry({ type: "Point", coordinates: [24.9, 60.1] }),
    ).toEqual([[24.9, 60.1]]);
    expect(getCoordinatesOfGeometry(polygon)).toEqual(ring);
    expect(getCoordinatesOfGeometry(multiPolygon)).toEqual(ring);
  });

  it("keeps the order of positions across several polygons", () => {
    const geometry = {
      type: "MultiPolygon",
      coordinates: [[[[1, 2]], [[3, 4]]], [[[5, 6]]]],
    };

    expect(getCoordinatesOfGeometry(geometry)).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  it("accepts coordinates given as a flat list of positions", () => {
    expect(
      getCoordinatesOfGeometry({ type: "MultiPolygon", coordinates: ring }),
    ).toEqual(ring);
  });

  it("drops the altitude of a position", () => {
    expect(
      getCoordinatesOfGeometry({
        type: "Point",
        coordinates: [24.9, 60.1, 12],
      }),
    ).toEqual([[24.9, 60.1]]);
  });

  it("handles a very large ring in linear time", { timeout: 1000 }, () => {
    const positions = manyPositions(40_000);

    expect(
      getCoordinatesOfGeometry({ type: "Polygon", coordinates: [positions] }),
    ).toHaveLength(40_000);
  });
});

describe("getBoundsFromCoordinates", () => {
  it("returns the box around the coordinates", () => {
    const bounds = getBoundsFromCoordinates(ring);

    expect(bounds.getWest()).toBe(24.945222);
    expect(bounds.getEast()).toBe(24.957479);
    expect(bounds.getSouth()).toBe(60.176976);
    expect(bounds.getNorth()).toBe(60.179629);
  });

  it("returns null when there are no coordinates", () => {
    expect(getBoundsFromCoordinates([])).toBeNull();
  });

  it("handles more coordinates than fit in a function call", () => {
    const bounds = getBoundsFromCoordinates(manyPositions(300_000));

    expect(bounds.getWest()).toBe(24);
    expect(bounds.getEast()).toBeCloseTo(24.999, 6);
  });
});

describe("getCenterFromCoordinates", () => {
  it("returns the center as [latitude, longitude]", () => {
    expect(getCenterFromCoordinates(ring)).toEqual([60.1783025, 24.9513505]);
  });

  it("returns the position itself for a single coordinate", () => {
    expect(getCenterFromCoordinates([[24.9, 60.1]])).toEqual([60.1, 24.9]);
  });

  it("returns null when there are no coordinates", () => {
    expect(getCenterFromCoordinates([])).toBeNull();
  });

  it("handles more coordinates than fit in a function call", () => {
    const [lat, lng] = getCenterFromCoordinates(manyPositions(300_000));

    expect(lat).toBeCloseTo(60 + 388 / 777, 6);
    expect(lng).toBeCloseTo(24.4995, 6);
  });
});

describe("getBoundsFromFeatures", () => {
  const featuresOf = (...geometries: Array<unknown>) => ({
    features: geometries.map((geometry) => ({ geometry })),
  });

  it("returns the box around a multipolygon feature", () => {
    const bounds = getBoundsFromFeatures(featuresOf(multiPolygon));

    expect(bounds.toBBoxString()).toBe(
      "24.945222,60.176976,24.957479,60.179629",
    );
  });

  it("supports polygon and point geometries", () => {
    expect(getBoundsFromFeatures(featuresOf(polygon)).toBBoxString()).toBe(
      "24.945222,60.176976,24.957479,60.179629",
    );
    expect(
      getBoundsFromFeatures(
        featuresOf({ type: "Point", coordinates: [24.9, 60.1] }),
      ).toBBoxString(),
    ).toBe("24.9,60.1,24.9,60.1");
  });

  it("combines the geometries of all features", () => {
    const bounds = getBoundsFromFeatures(
      featuresOf(
        { type: "Point", coordinates: [24, 60] },
        { type: "Point", coordinates: [25, 61] },
      ),
    );

    expect(bounds.toBBoxString()).toBe("24,60,25,61");
  });

  it("ignores features without coordinates", () => {
    const bounds = getBoundsFromFeatures({
      features: [
        { geometry: null },
        { geometry: { type: "Polygon", coordinates: [] } },
        { geometry: { type: "Point", coordinates: [24.9, 60.1] } },
      ],
    });

    expect(bounds.toBBoxString()).toBe("24.9,60.1,24.9,60.1");
  });

  it("returns null when there is nothing to fit", () => {
    expect(getBoundsFromFeatures(null)).toBeNull();
    expect(getBoundsFromFeatures({})).toBeNull();
    expect(getBoundsFromFeatures({ features: [] })).toBeNull();
    expect(getBoundsFromFeatures(featuresOf(null))).toBeNull();
  });

  it("handles more coordinates than fit in a function call", () => {
    const bounds = getBoundsFromFeatures(
      featuresOf({
        type: "MultiPolygon",
        coordinates: [[manyPositions(300_000)]],
      }),
    );

    expect(bounds.getWest()).toBe(24);
    expect(bounds.getEast()).toBeCloseTo(24.999, 6);
  });
});

describe("getBoundsFromBBox", () => {
  it("builds bounds from [west, south, east, north]", () => {
    const bounds = getBoundsFromBBox([24.9, 60.1, 25, 60.2]);

    expect(bounds.getWest()).toBe(24.9);
    expect(bounds.getSouth()).toBe(60.1);
    expect(bounds.getEast()).toBe(25);
    expect(bounds.getNorth()).toBe(60.2);
  });

  it("accepts the strings that come out of the URL", () => {
    expect(
      getBoundsFromBBox(["24.9", "60.1", "25", "60.2"]).toBBoxString(),
    ).toBe("24.9,60.1,25,60.2");
  });

  it("round-trips Leaflet's own bbox string", () => {
    const bbox = "24.9,60.1,25,60.2";

    expect(getBoundsFromBBox(bbox.split(",")).toBBoxString()).toBe(bbox);
  });

  it("returns null instead of throwing on input that is not a bbox", () => {
    expect(getBoundsFromBBox(undefined)).toBeNull();
    expect(getBoundsFromBBox(null)).toBeNull();
    expect(getBoundsFromBBox("24.9,60.1,25,60.2")).toBeNull();
    expect(getBoundsFromBBox(["24.9", "60.1", "25"])).toBeNull();
    expect(getBoundsFromBBox(["a", "b", "c", "d"])).toBeNull();
    expect(getBoundsFromBBox([24.9, 60.1, 25, NaN])).toBeNull();
    expect(getBoundsFromBBox([24.9, 60.1, 25, Infinity])).toBeNull();
  });
});
