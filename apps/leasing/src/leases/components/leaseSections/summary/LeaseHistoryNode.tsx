import React from "react";
import LeaseHistoryItem from "./LeaseHistoryItem";
import { sortRelatedHistoryItems } from "@/leases/helpers";
import type { HistoryLeaseNode } from "@/leases/leaseHistory";

type Props = {
  node: HistoryLeaseNode;
  stateOptions: Array<Record<string, any>>;
  onDeleteRelatedLease?: (id: number) => void;
  isFirstNode?: boolean;
  isLastNode?: boolean;
};

/**
 * Renders a single lease history node: its attachments (plot searches,
 * applications, area searches) and the lease row itself, sorted together by
 * date. Shared by both the read-only and edit views.
 *
 * `isFirstNode` / `isLastNode` mark the group's first/last node so the connector
 * line can be masked at the top of the first item and bottom of the last item.
 */
const LeaseHistoryNode = ({
  node,
  stateOptions,
  onDeleteRelatedLease,
  isFirstNode = false,
  isLastNode = false,
}: Props) => {
  const items: Array<Record<string, any>> = [
    ...node.attachments.map((attachment) => ({ ...attachment })),
    {
      key: node.key,
      id: node.lease.id,
      deleteId: node.relatedLeaseId,
      lease: node.lease,
      startDate: node.startDate,
      endDate: node.endDate,
      visual: node.visual,
      active: node.visual === "current",
      onDelete: node.relatedLeaseId ? onDeleteRelatedLease : undefined,
    },
  ];

  items.sort(sortRelatedHistoryItems);

  return (
    <>
      {items.map((item, index) => (
        <LeaseHistoryItem
          {...item}
          key={item.key}
          stateOptions={stateOptions}
          isFirst={isFirstNode && index === 0}
          isLast={isLastNode && index === items.length - 1}
        />
      ))}
    </>
  );
};

export default LeaseHistoryNode;
