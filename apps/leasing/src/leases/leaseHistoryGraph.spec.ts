import { describe, expect, it } from "vitest";
import { buildLeaseHistoryGraph } from "./leaseHistoryGraph";
import type { Lease } from "./types";

const make = { id: 1, name: "MAKE" } as any;
const kuva = { id: 2, name: "KUVA" } as any;

const lease = (overrides: Partial<Lease> = {}): Partial<Lease> => ({
  id: 1,
  start_date: "2020-01-01",
  end_date: null,
  service_unit: make,
  identifier: { identifier: "Y3112-4" } as any,
  ...overrides,
});

describe("buildLeaseHistoryGraph", () => {
  it("returns an empty graph for no lease", () => {
    expect(buildLeaseHistoryGraph(null)).toEqual({
      nodes: [],
      edges: [],
      currentId: null,
    });
  });

  it("collects every lease across the full relation closure (Y3 + 3x S1)", () => {
    // current: Y3112-4; Y3112-3 --transfer--> current; S1-1, S1-2 linked to
    // current; S1-3 linked only to S1-1 (the previously-missing indirect lease).
    const current = {
      ...lease({ id: 35112, identifier: { identifier: "Y3112-4" } as any }),
      related_leases: {
        related_to: [],
        related_from: [
          {
            id: 4946,
            type: "transfer",
            from_lease: lease({
              id: 35111,
              identifier: { identifier: "Y3112-3" } as any,
              end_date: "2021-12-31",
            }),
            to_lease: 35112,
          },
          {
            id: 4947,
            type: null,
            from_lease: lease({
              id: 35113,
              identifier: { identifier: "S1112-1" } as any,
              service_unit: kuva,
            }),
            to_lease: 35112,
          },
          {
            id: 4948,
            type: null,
            from_lease: lease({
              id: 35114,
              identifier: { identifier: "S1112-2" } as any,
              service_unit: kuva,
            }),
            to_lease: 35112,
          },
          {
            id: 4949,
            type: null,
            from_lease: lease({
              id: 35115,
              identifier: { identifier: "S1112-3" } as any,
              service_unit: kuva,
            }),
            to_lease: 35113, // linked to S1112-1, NOT the current lease
          },
        ],
      },
    } as unknown as Lease;

    const graph = buildLeaseHistoryGraph(current);

    expect(graph.currentId).toBe(35112);
    // All 5 leases present, including the indirectly-linked S1112-3.
    expect(graph.nodes.map((n) => n.identifier).sort()).toEqual([
      "S1112-1",
      "S1112-2",
      "S1112-3",
      "Y3112-3",
      "Y3112-4",
    ]);
    expect(graph.edges).toHaveLength(4);
  });

  it("derives visual state per node", () => {
    const current = {
      ...lease({ id: 35112 }),
      related_leases: {
        related_to: [],
        related_from: [
          {
            id: 1,
            type: "transfer",
            from_lease: lease({ id: 35111, end_date: "2021-12-31" }),
            to_lease: 35112,
          },
        ],
      },
    } as unknown as Lease;

    const graph = buildLeaseHistoryGraph(current);
    const byId = (id: number) => graph.nodes.find((n) => n.id === id)!;
    expect(byId(35112).visual).toBe("current");
    expect(byId(35111).visual).toBe("ended-continued");
  });
});
