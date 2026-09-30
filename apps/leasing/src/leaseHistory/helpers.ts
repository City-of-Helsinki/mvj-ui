import { get } from "lodash-es";
import { isArchived } from "@/util/helpers";
import {
  LeaseHistoryStates,
  LeaseHistoryContentTypes,
  LeaseHistoryItemTypes,
} from "@/leaseHistory/enums";
import type {
  HistoryAttachment,
  HistoryChain,
  HistoryLeaseNode,
  HistoryState,
  HistoryServiceUnitGroup,
} from "@/leaseHistory/types";
import type { Lease, RelatedLeaseEdge } from "@/leases/types";

export const getHistoryNodeState = (
  lease: Partial<Lease>,
  continues: boolean,
): HistoryState => {
  if (!isArchived(lease)) return LeaseHistoryStates.ACTIVE;
  return continues ? LeaseHistoryStates.CONTINUED : LeaseHistoryStates.TERMINAL;
};

/** Build the attachment list (plot searches / applications / area searches). */
const buildAttachments = (
  lease: Partial<Lease>,
  onDeleteRelatedPlotApplication: (id: number) => void,
): HistoryAttachment[] => {
  const attachments: HistoryAttachment[] = [];
  const leaseId = lease.id;

  (lease.plot_searches ?? []).forEach((plotSearch: any) => {
    attachments.push({
      key: `plot-search_lease${leaseId}-plotsearch${plotSearch.id}`,
      id: plotSearch.id,
      itemTitle: plotSearch.name,
      startDate: plotSearch.begin_at,
      endDate: plotSearch.end_at,
      plotSearchType: plotSearch.type,
      plotSearchSubtype: plotSearch.subtype,
      itemType: LeaseHistoryItemTypes.PLOTSEARCH,
    });
  });

  (lease.target_statuses ?? []).forEach((plotApplication: any) => {
    attachments.push({
      key: `plot-application_lease${leaseId}-plotapplication${plotApplication.id}`,
      id: plotApplication.id,
      itemTitle: plotApplication.application_identifier,
      receivedAt: plotApplication.received_at,
      itemType: LeaseHistoryItemTypes.PLOT_APPLICATION,
    });
  });

  (lease.area_searches ?? []).forEach((areaSearch: any) => {
    attachments.push({
      key: `area-search_lease${leaseId}-areasearch${areaSearch.id}`,
      id: areaSearch.id,
      itemTitle: areaSearch.identifier,
      receivedAt: areaSearch.received_date,
      applicantName: `${(areaSearch.applicant_names ?? []).join(" ")}`,
      itemType: LeaseHistoryItemTypes.AREA_SEARCH,
    });
  });

  (lease.related_plot_applications ?? []).forEach((related: any) => {
    const model = related.content_type?.model;
    const contentObject = related.content_object;
    if (!contentObject) return;

    if (model === LeaseHistoryContentTypes.PLOTSEARCH) {
      attachments.push({
        key: `related-plot-application-plotsearch_lease${leaseId}-contentobject${contentObject.id}`,
        id: contentObject.id,
        deleteId: related.id,
        itemTitle: contentObject.name,
        startDate: contentObject.begin_at,
        endDate: contentObject.end_at,
        plotSearchType: contentObject.type,
        plotSearchSubtype: contentObject.subtype,
        itemType: LeaseHistoryItemTypes.PLOTSEARCH,
        onDelete: onDeleteRelatedPlotApplication,
      });
    } else if (model === LeaseHistoryContentTypes.TARGET_STATUS) {
      attachments.push({
        key: `related-plot-application-targetstatus-${leaseId}-${contentObject.id}`,
        id: contentObject.id,
        deleteId: related.id,
        itemTitle: contentObject.application_identifier,
        receivedAt: contentObject.received_at,
        itemType: LeaseHistoryItemTypes.PLOT_APPLICATION,
        onDelete: onDeleteRelatedPlotApplication,
      });
    } else if (model === LeaseHistoryContentTypes.AREA_SEARCH) {
      attachments.push({
        key: `related-plot-application-areasearch-${leaseId}-${contentObject.id}`,
        id: contentObject.id,
        deleteId: related.id,
        itemTitle: contentObject.identifier,
        applicantName: `${(contentObject.applicant_names ?? []).join(" ")}`,
        receivedAt: contentObject.received_date,
        itemType: LeaseHistoryItemTypes.AREA_SEARCH,
        onDelete: onDeleteRelatedPlotApplication,
      });
    }
  });

  return attachments;
};

/** Compare two nodes for descending chronological order (newest first). */
const compareNodesDesc = (a: HistoryLeaseNode, b: HistoryLeaseNode): number => {
  const aTime = a.startDate ?? "0000-01-01";
  const bTime = b.startDate ?? "0000-01-01";
  if (aTime === bTime) {
    return (b.lease.id ?? 0) - (a.lease.id ?? 0);
  }
  return aTime < bTime ? 1 : -1;
};

type LeaseRelations = { successorIds: number[]; predecessorIds: number[] };

const buildNode = (
  lease: Partial<Lease>,
  active: boolean,
  relatedLeaseId: number | undefined,
  onDeleteRelatedPlotApplication: (id: number) => void,
  relations: LeaseRelations,
): HistoryLeaseNode => ({
  key: `lease-${lease.id}`,
  lease,
  relatedLeaseId,
  serviceUnitId: get(lease, "service_unit.id", null),
  serviceUnitName:
    get(lease, "service_unit.name") ?? get(lease, "type.name", null),
  startDate: lease.start_date ?? null,
  endDate: lease.end_date ?? null,
  active,
  state: getHistoryNodeState(lease, relations.successorIds.length > 0),
  successorIds: relations.successorIds,
  predecessorIds: relations.predecessorIds,
  attachments: buildAttachments(lease, onDeleteRelatedPlotApplication),
});

/** Group edges into per-lease lists */
const indexEdges = (
  edges: Array<RelatedLeaseEdge>,
  currentId: number,
): {
  relationsOf: (id: number) => LeaseRelations;
  relatedLeaseIdOf: (id: number) => number | undefined;
} => {
  const relations = new Map<number, LeaseRelations>();
  const relatedLeaseIdById = new Map<number, number>();
  const relationsFor = (id: number): LeaseRelations => {
    if (!relations.has(id))
      relations.set(id, {
        successorIds: [],
        predecessorIds: [],
      });
    return relations.get(id)!;
  };

  edges.forEach(({ predecessor, successor, related_lease_id }) => {
    relationsFor(predecessor).successorIds.push(successor);
    relationsFor(successor).predecessorIds.push(predecessor);
    if (predecessor === currentId)
      relatedLeaseIdById.set(successor, related_lease_id);
    else if (successor === currentId)
      relatedLeaseIdById.set(predecessor, related_lease_id);
  });

  return {
    relationsOf: (id) =>
      relations.get(id) ?? {
        successorIds: [],
        predecessorIds: [],
      },
    relatedLeaseIdOf: (id) => relatedLeaseIdById.get(id),
  };
};

/* Build a flat list of lease nodes from the history graph */
export const buildLeaseHistoryNodes = (
  currentLease: Lease | null | undefined,
  onDeleteRelatedPlotApplication?: (id: number) => void,
): HistoryLeaseNode[] => {
  const graph = currentLease?.related_leases;
  if (!currentLease || !graph) return [];

  const { relationsOf, relatedLeaseIdOf } = indexEdges(
    graph.edges ?? [],
    currentLease.id,
  );

  return Object.values(graph.leases ?? {})
    .map((lease) => {
      const active = lease.id === currentLease.id;
      return buildNode(
        lease,
        active,
        active ? undefined : relatedLeaseIdOf(lease.id),
        onDeleteRelatedPlotApplication,
        relationsOf(lease.id),
      );
    })
    .sort(compareNodesDesc);
};

/** Index nodes by lease id for quick lookup within a group. */
const indexNodesById = (
  nodes: HistoryLeaseNode[],
): Map<number, HistoryLeaseNode> => {
  const byId = new Map<number, HistoryLeaseNode>();
  nodes.forEach((n) => {
    if (n.lease.id != null) byId.set(n.lease.id, n);
  });
  return byId;
};

/** A node's predecessors that also live in this group */
const predecessorsInGroup = (
  node: HistoryLeaseNode,
  byId: Map<number, HistoryLeaseNode>,
): HistoryLeaseNode[] =>
  node.predecessorIds
    .filter((id) => byId.has(id))
    .map((id) => byId.get(id)!)
    .sort(compareNodesDesc);

/* Heads are nodes without a successor in the group (top of a chain), */
const findChainHeads = (
  nodes: HistoryLeaseNode[],
  byId: Map<number, HistoryLeaseNode>,
): HistoryLeaseNode[] =>
  nodes
    .filter((n) => !n.successorIds.some((id) => byId.has(id)))
    .sort(compareNodesDesc);

/* Walk a chain head down through its predecessors, collecting one full chain. */
const collectChainFrom = (
  head: HistoryLeaseNode,
  byId: Map<number, HistoryLeaseNode>,
  seen: Set<number>,
): HistoryLeaseNode[] => {
  const chain: HistoryLeaseNode[] = [];
  const visit = (node: HistoryLeaseNode) => {
    const id = node.lease.id;
    if (id == null || seen.has(id)) return;
    seen.add(id);
    chain.push(node);
    predecessorsInGroup(node, byId).forEach(visit);
  };
  visit(head);
  return chain;
};

/* Partition a service unit's nodes into connected chains. */
const partitionIntoChains = (nodes: HistoryLeaseNode[]): HistoryChain[] => {
  const byId = indexNodesById(nodes);
  const heads = findChainHeads(nodes, byId);

  const chains: HistoryChain[] = [];
  const seen = new Set<number>();

  heads.forEach((head) => {
    const chain = collectChainFrom(head, byId, seen);
    if (chain.length) {
      chains.push({ key: `chain-${chain[0].lease.id}`, nodes: chain });
    }
  });

  // Anything unreached is set as its own chain
  nodes.forEach((node) => {
    if (node.lease.id != null && !seen.has(node.lease.id)) {
      seen.add(node.lease.id);
      chains.push({ key: `chain-${node.lease.id}`, nodes: [node] });
    }
  });

  return chains;
};

export const groupHistoryNodesByServiceUnit = (
  nodes: HistoryLeaseNode[],
): HistoryServiceUnitGroup[] => {
  const order: Array<number | null> = [];
  const nodesByUnit = new Map<number | null, HistoryLeaseNode[]>();
  const nameByUnit = new Map<number | null, string>();

  nodes.forEach((node) => {
    if (!nodesByUnit.has(node.serviceUnitId)) {
      nodesByUnit.set(node.serviceUnitId, []);
      nameByUnit.set(node.serviceUnitId, node.serviceUnitName);
      order.push(node.serviceUnitId);
    }
    nodesByUnit.get(node.serviceUnitId)!.push(node);
  });

  return order.map((serviceUnitId) => ({
    serviceUnitId,
    serviceUnitName: nameByUnit.get(serviceUnitId) ?? "",
    chains: partitionIntoChains(nodesByUnit.get(serviceUnitId)!),
  }));
};

export const buildLeaseHistory = (
  currentLease: Lease | null | undefined,
  onDeleteRelatedPlotApplication?: (id: number) => void,
): HistoryServiceUnitGroup[] =>
  groupHistoryNodesByServiceUnit(
    buildLeaseHistoryNodes(currentLease, onDeleteRelatedPlotApplication),
  );
