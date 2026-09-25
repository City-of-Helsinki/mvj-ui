import { describe, expect, it } from "vitest";
import {
  buildLeaseHistory,
  buildLeaseHistoryNodes,
  getHistoryItemVisual,
  groupHistoryNodesByServiceUnit,
} from "./leaseHistory";
import type { Lease } from "./types";

// Minimal lease factory — only the fields the history transform reads.
// Grouping keys on `service_unit` (embedded on every lease), falling back to
// lease `type` if a service unit is ever missing.
const makeLease = (overrides: Partial<Lease> = {}): Lease =>
  ({
    id: 1,
    start_date: "2020-01-01",
    end_date: null,
    type: { id: 24, name: "Liikuntavirasto", identifier: "Y3" } as any,
    service_unit: { id: 1, name: "MAKE" } as any,
    plot_searches: [],
    target_statuses: [],
    area_searches: [],
    related_plot_applications: [],
    related_leases: [] as any,
    ...overrides,
  }) as Lease;

const withRelated = (
  lease: Lease,
  related: { related_from?: any[]; related_to?: any[] },
): Lease =>
  ({
    ...lease,
    related_leases: {
      related_from: related.related_from ?? [],
      related_to: related.related_to ?? [],
    } as any,
  }) as Lease;

describe("leaseHistory", () => {
  describe("getHistoryItemVisual", () => {
    it("returns 'current' for the current lease regardless of state", () => {
      const lease = makeLease({ end_date: "2000-01-01" });
      expect(getHistoryItemVisual(lease, true)).toBe("current");
    });

    it("returns 'active' for a non-ended lease", () => {
      const lease = makeLease({ end_date: null });
      expect(getHistoryItemVisual(lease, false)).toBe("active");
    });

    it("returns 'active' for a lease ending in the future", () => {
      const lease = makeLease({ end_date: "2099-12-31" });
      expect(getHistoryItemVisual(lease, false)).toBe("active");
    });

    it("returns 'ended-terminal' for an ended lease linked non-transfer", () => {
      const lease = makeLease({ end_date: "2000-01-01" });
      expect(getHistoryItemVisual(lease, false, null)).toBe("ended-terminal");
    });

    it("returns 'ended-continued' for an ended lease linked via transfer", () => {
      const lease = makeLease({ end_date: "2000-01-01" });
      expect(getHistoryItemVisual(lease, false, "transfer")).toBe(
        "ended-continued",
      );
    });
  });

  describe("buildLeaseHistoryNodes", () => {
    it("returns an empty array for no lease", () => {
      expect(buildLeaseHistoryNodes(null)).toEqual([]);
    });

    it("places the current lease between related_to and related_from", () => {
      const current = withRelated(makeLease({ id: 100 }), {
        related_to: [
          { id: 1, to_lease: makeLease({ id: 200, start_date: "2025-01-01" }) },
        ],
        related_from: [
          {
            id: 2,
            from_lease: makeLease({ id: 50, start_date: "2010-01-01" }),
          },
        ],
      });

      const nodes = buildLeaseHistoryNodes(current);
      expect(nodes.map((n) => n.lease.id)).toEqual([200, 100, 50]);
      expect(nodes[1].visual).toBe("current");
    });

    it("supports branching: many children leases from one target (Y3 -> many S1)", () => {
      const y3 = withRelated(makeLease({ id: 3000 }), {
        related_from: [
          {
            id: 1,
            from_lease: makeLease({ id: 1001, start_date: "2021-01-01" }),
          },
          {
            id: 2,
            from_lease: makeLease({ id: 1002, start_date: "2022-01-01" }),
          },
          {
            id: 3,
            from_lease: makeLease({ id: 1003, start_date: "2023-01-01" }),
          },
        ],
      });

      const nodes = buildLeaseHistoryNodes(y3);
      // current + 3 from-nodes, all present (not collapsed by a linear walker)
      expect(nodes).toHaveLength(4);
      const fromIds = nodes
        .filter((n) => n.visual !== "current")
        .map((n) => n.lease.id);
      expect(fromIds).toEqual([1003, 1002, 1001]); // newest first
    });

    it("carries relatedLeaseId for delete on related nodes", () => {
      const current = withRelated(makeLease({ id: 100 }), {
        related_from: [{ id: 77, from_lease: makeLease({ id: 50 }) }],
      });
      const nodes = buildLeaseHistoryNodes(current);
      const fromNode = nodes.find((n) => n.lease.id === 50);
      expect(fromNode?.relatedLeaseId).toBe(77);
    });

    it("collects plot searches as attachments", () => {
      const current = makeLease({
        id: 100,
        plot_searches: [
          {
            id: 5,
            name: "Haku 5",
            begin_at: "2024-01-01",
            end_at: "2024-06-01",
          },
        ] as any,
      });
      const nodes = buildLeaseHistoryNodes(current);
      expect(nodes[0].attachments).toHaveLength(1);
      expect(nodes[0].attachments[0].itemTitle).toBe("Haku 5");
    });
  });

  describe("continuation visual from link type", () => {
    it("marks a transfer-linked ended lease as continued, others terminal", () => {
      const y3 = { id: 24, name: "Liikuntavirasto", identifier: "Y3" } as any;
      const s1 = {
        id: 40,
        name: "Liikuntaviraston ulosvuokraus",
        identifier: "S1",
      } as any;
      const current = withRelated(makeLease({ id: 35112, type: y3 }), {
        related_from: [
          {
            id: 4946,
            type: "transfer",
            from_lease: makeLease({
              id: 35111,
              type: y3,
              start_date: "2020-01-01",
              end_date: "2021-12-31",
            }),
          },
          {
            id: 4947,
            type: null,
            from_lease: makeLease({
              id: 35113,
              type: s1,
              start_date: "2023-01-01",
              end_date: "2023-03-31",
            }),
          },
        ],
      });

      const nodes = buildLeaseHistoryNodes(current);
      const byId = (id: number) => nodes.find((n) => n.lease.id === id)!;
      expect(byId(35111).visual).toBe("ended-continued");
      expect(byId(35113).visual).toBe("ended-terminal");
    });
  });

  describe("groupHistoryNodesByServiceUnit", () => {
    it("groups nodes by service unit, preserving first-seen order", () => {
      const make = { id: 1, name: "MAKE" } as any;
      const kuva = { id: 2, name: "KUVA" } as any;
      const current = withRelated(makeLease({ id: 100, service_unit: make }), {
        related_from: [
          {
            id: 1,
            type: null,
            from_lease: makeLease({
              id: 200,
              service_unit: kuva,
              start_date: "2023-01-01",
            }),
          },
        ],
      });

      const groups = groupHistoryNodesByServiceUnit(
        buildLeaseHistoryNodes(current),
      );
      expect(groups.map((g) => g.serviceUnitName)).toEqual(["MAKE", "KUVA"]);
      expect(groups[0].nodes.map((n) => n.lease.id)).toEqual([100]);
      expect(groups[1].nodes.map((n) => n.lease.id)).toEqual([200]);
    });

    it("falls back to lease type when service unit is missing", () => {
      const lease = makeLease({ id: 5, service_unit: undefined as any });
      const groups = groupHistoryNodesByServiceUnit(
        buildLeaseHistoryNodes(lease),
      );
      expect(groups[0].serviceUnitName).toBe("Liikuntavirasto");
    });
  });

  describe("buildLeaseHistory", () => {
    it("returns grouped sections", () => {
      const groups = buildLeaseHistory(makeLease({ id: 1 }));
      expect(groups).toHaveLength(1);
      expect(groups[0].serviceUnitName).toBe("MAKE");
      // A lone lease is the current lease, so its visual is "current".
      expect(groups[0].nodes[0].visual).toBe("current");
    });
  });
});
