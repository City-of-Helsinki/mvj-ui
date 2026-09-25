import { get } from "lodash/object";
import { isArchived } from "@/util/helpers";
import type { Lease } from "@/leases/types";
import type { HistoryNodeVisual } from "@/leases/leaseHistory";

/**
 * PROTOTYPE — graph model for the lease history.
 *
 * The API now returns the full connected relation graph (transitive closure) as
 * a set of `related_lease` links. Each link connects two leases (`from_lease` →
 * `to_lease`) and carries a `type` ("transfer" vs other). This builder collapses
 * all links into a node/edge graph so a layout engine (dagre) can position it.
 *
 * Pure and Redux-free so it can be unit-tested against fixtures.
 */

export type LeaseGraphNode = {
  id: number;
  identifier: string;
  leaseState: string;
  serviceUnitId: number | null;
  serviceUnitName: string;
  startDate: string | null;
  endDate: string | null;
  visual: HistoryNodeVisual;
};

export type LeaseGraphEdge = {
  id: number;
  from: number;
  to: number;
  /** "transfer" = bloodline continuation, otherwise a plain relation. */
  type: string | null;
};

export type LeaseGraph = {
  nodes: LeaseGraphNode[];
  edges: LeaseGraphEdge[];
  currentId: number | null;
};

const getIdentifier = (lease: Partial<Lease>): string =>
  get(lease, "identifier.identifier", "") || `#${get(lease, "id", "?")}`;

const getServiceUnitId = (lease: Partial<Lease>): number | null =>
  get(lease, "service_unit.id", null) ?? get(lease, "type.id", null);

const getServiceUnitName = (lease: Partial<Lease>): string =>
  get(lease, "service_unit.name", "") ||
  get(lease, "type.name", "") ||
  get(lease, "type.identifier", "");

const visualFor = (
  lease: Partial<Lease>,
  isCurrent: boolean,
  hasTransferOut: boolean,
): HistoryNodeVisual => {
  if (isCurrent) return "current";
  if (!isArchived(lease)) return "active";
  return hasTransferOut ? "ended-continued" : "ended-terminal";
};

/**
 * Build a node/edge graph from a lease and its full relation closure.
 *
 * Collects every lease that appears on either end of any link (plus the current
 * lease), de-duplicated by id, and one edge per link.
 */
export const buildLeaseHistoryGraph = (
  currentLease: Lease | null | undefined,
): LeaseGraph => {
  if (!currentLease) return { nodes: [], edges: [], currentId: null };

  const links: Array<Record<string, any>> = [
    ...get(currentLease, "related_leases.related_from", []),
    ...get(currentLease, "related_leases.related_to", []),
  ];

  // Collect lease objects by id from the current lease and both link endpoints.
  const leasesById = new Map<number, Partial<Lease>>();
  const remember = (lease: Partial<Lease> | undefined) => {
    const id = lease?.id;
    if (id != null && !leasesById.has(id)) leasesById.set(id, lease as Lease);
  };
  remember(currentLease);

  const edges: LeaseGraphEdge[] = [];
  const seenEdge = new Set<string>();

  links.forEach((link) => {
    const fromLease: Partial<Lease> | undefined =
      typeof link.from_lease === "object" ? link.from_lease : undefined;
    const toLease: Partial<Lease> | undefined =
      typeof link.to_lease === "object" ? link.to_lease : undefined;

    remember(fromLease);
    remember(toLease);

    const fromId =
      typeof link.from_lease === "object"
        ? link.from_lease?.id
        : link.from_lease;
    const toId =
      typeof link.to_lease === "object" ? link.to_lease?.id : link.to_lease;

    if (fromId == null || toId == null) return;

    const dedupeKey = `${fromId}->${toId}`;
    if (seenEdge.has(dedupeKey)) return;
    seenEdge.add(dedupeKey);

    edges.push({
      id: link.id,
      from: fromId,
      to: toId,
      type: link.type ?? null,
    });
  });

  // A lease "continues" if it is the source of a transfer edge.
  const transferSources = new Set(
    edges.filter((e) => e.type === "transfer").map((e) => e.from),
  );

  const nodes: LeaseGraphNode[] = Array.from(leasesById.entries()).map(
    ([id, lease]) => ({
      id,
      identifier: getIdentifier(lease),
      leaseState: lease.state ?? "",
      serviceUnitId: getServiceUnitId(lease),
      serviceUnitName: getServiceUnitName(lease),
      startDate: lease.start_date ?? null,
      endDate: lease.end_date ?? null,
      visual: visualFor(lease, id === currentLease.id, transferSources.has(id)),
    }),
  );

  return { nodes, edges, currentId: currentLease.id };
};
