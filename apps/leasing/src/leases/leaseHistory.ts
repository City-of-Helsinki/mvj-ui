import { get } from "lodash/object";
import { isArchived } from "@/util/helpers";
import {
  LeaseHistoryContentTypes,
  LeaseHistoryItemTypes,
} from "@/leases/enums";
import type { Lease } from "@/leases/types";

/**
 * Prototype: branching-capable, service-unit-grouped intermediate model for the
 * lease history ("Historiapuu"). See LeaseHistory.PLAN.md (§2, §3).
 *
 * This is a pure transformation layer. It does not render anything and does not
 * depend on Redux — so it can be unit-tested against fixtures in isolation.
 */

/** Visual state of a lease node, drives the icon/colour in the UI (§3 legend). */
export type HistoryNodeVisual =
  | "current" // black dot — the lease of the current page
  | "active" // blue dot — in-force lease
  | "ended-continued" // grey arrow — ended, continues under a new identifier
  | "ended-terminal"; // grey square — ended, did not continue

/** A plot search / plot application / area search attached to a lease node. */
export type HistoryAttachment = {
  key: string;
  itemType: (typeof LeaseHistoryItemTypes)[keyof typeof LeaseHistoryItemTypes];
  id?: number;
  deleteId?: number;
  itemTitle?: string;
  startDate?: string | null;
  endDate?: string | null;
  receivedAt?: string | null;
  plotSearchType?: string;
  plotSearchSubtype?: string;
  applicantName?: string;
  onDelete?: (id: number) => void;
};

/** A single lease in the history, with its attachments and branching children. */
export type HistoryLeaseNode = {
  key: string;
  lease: Partial<Lease>;
  relatedLeaseId?: number;
  serviceUnitId: number | null;
  serviceUnitName: string;
  startDate: string | null;
  endDate: string | null;
  visual: HistoryNodeVisual;
  attachments: HistoryAttachment[];
  children: HistoryLeaseNode[];
};

/** Top-level grouping: one section per service unit (§3 subheadings). */
export type HistoryServiceUnitGroup = {
  serviceUnitId: number | null;
  serviceUnitName: string;
  nodes: HistoryLeaseNode[];
};

type BuildOptions = {
  /** Called to delete a related-lease link. Omitted in read-only mode. */
  onDeleteRelatedLease?: (id: number) => void;
  /** Called to delete a related plot application link. Omitted in read-only mode. */
  onDeleteRelatedPlotApplication?: (id: number) => void;
};

/**
 * Decide the visual state of a lease node from its state + how it is linked.
 *
 * - `current`: the lease currently open (highlighted).
 * - `active`: not ended.
 * - `ended-continued`: ended, reached through a `transfer` link (bloodline continues).
 * - `ended-terminal`: ended with a non-transfer link (merely linked, did not continue).
 *
 * The continuation signal comes from the *link* (`related_*[].type === "transfer"`),
 * not the embedded lease — the API embeds related leases only one level deep and does
 * not include their own `related_leases`.
 */
export const getHistoryItemVisual = (
  lease: Partial<Lease>,
  isCurrent: boolean,
  linkType?: string | null,
): HistoryNodeVisual => {
  if (isCurrent) return "current";
  if (!isArchived(lease)) return "active";
  return linkType === "transfer" ? "ended-continued" : "ended-terminal";
};

// Group by the lease's service unit, now embedded on related leases too.
// Falls back to lease `type` if a service unit is ever missing.
const getServiceUnitId = (lease: Partial<Lease>): number | null =>
  get(lease, "service_unit.id", null) ?? get(lease, "type.id", null);

const getServiceUnitName = (lease: Partial<Lease>): string =>
  get(lease, "service_unit.name", "") ||
  get(lease, "type.name", "") ||
  get(lease, "type.identifier", "");

/** Build the attachment list (plot searches / applications / area searches). */
const buildAttachments = (
  lease: Partial<Lease>,
  options: BuildOptions,
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
        onDelete: options.onDeleteRelatedPlotApplication,
      });
    } else if (model === LeaseHistoryContentTypes.TARGET_STATUS) {
      attachments.push({
        key: `related-plot-application-targetstatus-${leaseId}-${contentObject.id}`,
        id: contentObject.id,
        deleteId: related.id,
        itemTitle: contentObject.application_identifier,
        receivedAt: contentObject.received_at,
        itemType: LeaseHistoryItemTypes.PLOT_APPLICATION,
        onDelete: options.onDeleteRelatedPlotApplication,
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
        onDelete: options.onDeleteRelatedPlotApplication,
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
    // Overlapping start dates: fall back to end date, then id for stability.
    const aEnd = a.endDate ?? "9999-12-31";
    const bEnd = b.endDate ?? "9999-12-31";
    if (aEnd === bEnd) return (b.lease.id ?? 0) - (a.lease.id ?? 0);
    return aEnd < bEnd ? 1 : -1;
  }
  return aTime < bTime ? 1 : -1;
};

const buildNode = (
  lease: Partial<Lease>,
  isCurrent: boolean,
  relatedLeaseId: number | undefined,
  options: BuildOptions,
  linkType?: string | null,
): HistoryLeaseNode => ({
  key: `lease-${lease.id}`,
  lease,
  relatedLeaseId,
  serviceUnitId: getServiceUnitId(lease),
  serviceUnitName: getServiceUnitName(lease),
  startDate: lease.start_date ?? null,
  endDate: lease.end_date ?? null,
  visual: getHistoryItemVisual(lease, isCurrent, linkType),
  attachments: buildAttachments(lease, options),
  children: [],
});

/**
 * Build the flat, ordered list of lease nodes for the current lease's history.
 *
 * Order: `related_to` (newer, continues from current) → current → `related_from`
 * (older, current continues from these). Branching children live on each node's
 * `children` array so multiple leases can descend from one (e.g. Y3 → many S1).
 */
export const buildLeaseHistoryNodes = (
  currentLease: Lease | null | undefined,
  options: BuildOptions = {},
): HistoryLeaseNode[] => {
  if (!currentLease) return [];

  const toLinks: Array<Record<string, any>> = get(
    currentLease,
    "related_leases.related_to",
    [],
  );
  const fromLinks: Array<Record<string, any>> = get(
    currentLease,
    "related_leases.related_from",
    [],
  );

  const toNodes = toLinks
    .map((link) =>
      buildNode(link.to_lease ?? {}, false, link.id, options, link.type),
    )
    .sort(compareNodesDesc);

  const fromNodes = fromLinks
    .map((link) =>
      buildNode(link.from_lease ?? {}, false, link.id, options, link.type),
    )
    .sort(compareNodesDesc);

  const currentNode = buildNode(currentLease, true, undefined, options);

  return [...toNodes, currentNode, ...fromNodes];
};

/** Group top-level nodes by service unit for subheading rendering (§3). */
export const groupHistoryNodesByServiceUnit = (
  nodes: HistoryLeaseNode[],
): HistoryServiceUnitGroup[] => {
  const groups: HistoryServiceUnitGroup[] = [];
  const byId = new Map<number | null, HistoryServiceUnitGroup>();

  nodes.forEach((node) => {
    let group = byId.get(node.serviceUnitId);
    if (!group) {
      group = {
        serviceUnitId: node.serviceUnitId,
        serviceUnitName: node.serviceUnitName,
        nodes: [],
      };
      byId.set(node.serviceUnitId, group);
      groups.push(group);
    }
    group.nodes.push(node);
  });

  return groups;
};

/** Convenience: build nodes and group them in one call. */
export const buildLeaseHistory = (
  currentLease: Lease | null | undefined,
  options: BuildOptions = {},
): HistoryServiceUnitGroup[] =>
  groupHistoryNodesByServiceUnit(buildLeaseHistoryNodes(currentLease, options));
