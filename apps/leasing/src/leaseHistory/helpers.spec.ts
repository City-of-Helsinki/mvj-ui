import { describe, expect, it } from "vitest";
import {
  buildLeaseHistoryNodes,
  getHistoryNodeState,
  groupHistoryNodesByServiceUnit,
} from "./helpers";
import type { Lease, RelatedLeaseEdge } from "@/leases/types";
import { LeaseHistoryStates } from "./enums";

const makeLease = (overrides: Partial<Lease> = {}): Lease =>
  ({
    id: 1,
    start_date: "2020-01-01",
    type: { name: "lease type" },
    service_unit: { id: 1, name: "service unit" },
    ...overrides,
  }) as Lease;

type EdgeInput = {
  predecessor: number;
  successor: number;
  related_lease_id?: number;
};

const makeEdge = (edge: EdgeInput): RelatedLeaseEdge => ({
  predecessor: edge.predecessor,
  successor: edge.successor,
  related_lease_id: edge.related_lease_id ?? 0,
});

const withGraph = (
  current: Lease,
  { leases, edges = [] }: { leases: Lease[]; edges?: EdgeInput[] },
): Lease =>
  ({
    ...current,
    related_leases: {
      leases: Object.fromEntries(leases.map((l) => [String(l.id), l])),
      edges: edges.map(makeEdge),
    },
  }) as Lease;

// Flatten a service-unit group's chains back into a single node list.
const groupNodes = (group: { chains: Array<{ nodes: any[] }> }) =>
  group.chains.flatMap((c) => c.nodes);

describe("leaseHistory", () => {
  describe("getHistoryNodeState", () => {
    it("returns 'active' for a non-ended lease", () => {
      expect(getHistoryNodeState(makeLease(), false)).toBe(
        LeaseHistoryStates.ACTIVE,
      );
    });

    it("returns 'terminal' for an ended lease without a successor", () => {
      expect(
        getHistoryNodeState(makeLease({ end_date: "2000-01-01" }), false),
      ).toBe(LeaseHistoryStates.TERMINAL);
    });

    it("returns 'continued' for an ended lease with a successor", () => {
      expect(
        getHistoryNodeState(makeLease({ end_date: "2000-01-01" }), true),
      ).toBe(LeaseHistoryStates.CONTINUED);
    });
  });

  describe("buildLeaseHistoryNodes", () => {
    it("returns an empty array for no lease", () => {
      expect(buildLeaseHistoryNodes(null)).toEqual([]);
    });

    it("returns an empty array when the graph is missing", () => {
      expect(buildLeaseHistoryNodes(makeLease({ id: 100 }))).toEqual([]);
    });

    it("includes every lease in the graph, newest-first, highlighting current", () => {
      const current = makeLease({ id: 100, start_date: "2020-01-01" });
      const newer = makeLease({ id: 200, start_date: "2025-01-01" });
      const older = makeLease({ id: 50, start_date: "2010-01-01" });

      const nodes = buildLeaseHistoryNodes(
        withGraph(current, {
          leases: [current, newer, older],
          edges: [
            { predecessor: 100, successor: 200 },
            { predecessor: 50, successor: 100 },
          ],
        }),
      );

      expect(nodes.map((n) => n.lease.id)).toEqual([200, 100, 50]);
      expect(nodes.find((n) => n.lease.id === 100)!.active).toBe(true);
    });

    it("carries relatedLeaseId for delete on related nodes", () => {
      const current = makeLease({ id: 100 });
      const older = makeLease({ id: 50 });
      const nodes = buildLeaseHistoryNodes(
        withGraph(current, {
          leases: [current, older],
          edges: [{ predecessor: 50, successor: 100, related_lease_id: 77 }],
        }),
      );
      expect(nodes.find((n) => n.lease.id === 50)?.relatedLeaseId).toBe(77);
    });

    it("collects plot searches as attachments", () => {
      const current = makeLease({
        id: 100,
        plot_searches: [{ name: "Plot search" }],
      });
      const nodes = buildLeaseHistoryNodes(
        withGraph(current, { leases: [current] }),
      );
      expect(nodes[0].attachments).toHaveLength(1);
      expect(nodes[0].attachments[0].itemTitle).toBe("Plot search");
    });
  });

  describe("groupHistoryNodesByServiceUnit", () => {
    it("groups nodes by service unit", () => {
      const unit1 = { id: 1, name: "Unit 1" } as any;
      const unit2 = { id: 2, name: "Unit 2" } as any;
      const current = makeLease({
        id: 2,
        service_unit: unit1,
        start_date: "2024-01-01",
      });
      const other = makeLease({
        id: 1,
        service_unit: unit2,
        start_date: "2023-01-01",
      });

      const groups = groupHistoryNodesByServiceUnit(
        buildLeaseHistoryNodes(
          withGraph(current, {
            leases: [current, other],
            edges: [{ predecessor: 1, successor: 2 }],
          }),
        ),
      );
      const byUnit = (name: string) =>
        groups.find((g) => g.serviceUnitName === name)!;
      expect(groupNodes(byUnit("Unit 1")).map((n) => n.lease.id)).toEqual([2]);
      expect(groupNodes(byUnit("Unit 2")).map((n) => n.lease.id)).toEqual([1]);
    });
  });

  // One parent branching into three children, one child having its own successor.
  describe("branch with a nested successor", () => {
    const otherServiceUnit = { id: 2, name: "Unit 2" } as any;
    const withOtherServiceUnit = (
      id: number,
      start: string,
      end: string | null,
    ) =>
      makeLease({
        id,
        service_unit: otherServiceUnit,
        start_date: start,
        end_date: end,
      });

    // Parent branches into a, b, c. b then leads into d.
    const parent = makeLease({ id: 10, start_date: "2020-01-01" });
    const a = withOtherServiceUnit(1, "2021-01-01", "2021-12-31");
    const b = withOtherServiceUnit(2, "2021-01-01", "2021-12-31");
    const c = withOtherServiceUnit(3, "2021-01-01", "9999-12-31");
    const d = withOtherServiceUnit(4, "2022-01-01", "2022-06-30");

    const current = withGraph(parent, {
      leases: [parent, a, b, c, d],
      edges: [
        { predecessor: 10, successor: 1 },
        { predecessor: 10, successor: 2 },
        { predecessor: 10, successor: 3 },
        { predecessor: 2, successor: 4 },
      ],
    });

    it("puts b and its successor d in the same chain", () => {
      const groups = groupHistoryNodesByServiceUnit(
        buildLeaseHistoryNodes(current),
      );
      const group2 = groups.find((g) => g.serviceUnitId === 2)!;
      const nodes = groupNodes(group2);
      const bNode = nodes.find((n) => n.lease.id === 2);
      const dNode = nodes.find((n) => n.lease.id === 4);

      // b leads into d. d leads nowhere.
      expect(bNode.successorIds).toContain(4);
      expect(dNode.successorIds).toEqual([]);
      expect(dNode.state).toBe(LeaseHistoryStates.TERMINAL);

      // d and b share one chain, d first.
      const chain = group2.chains.find((c) =>
        c.nodes.some((n) => n.lease.id === 2),
      )!;
      expect(chain.nodes.map((n) => n.lease.id)).toEqual([4, 2]);
    });

    it("keeps the sibling leases as separate chains", () => {
      const groups = groupHistoryNodesByServiceUnit(
        buildLeaseHistoryNodes(current),
      );
      const group2 = groups.find((g) => g.serviceUnitId === 2)!;
      const byId = (id: number) =>
        groupNodes(group2).find((n) => n.lease.id === id)!;
      expect(byId(1).state).toBe(LeaseHistoryStates.TERMINAL);
      expect(byId(3).state).toBe(LeaseHistoryStates.ACTIVE);

      // a and c are unrelated leaves: each is its own single node chain.
      const chainOf = (id: number) =>
        group2.chains.find((c) => c.nodes.some((n) => n.lease.id === id))!;
      expect(chainOf(1).nodes).toHaveLength(1);
      expect(chainOf(3).nodes).toHaveLength(1);
    });
  });
});
