import React from "react";
import LeaseHistoryItem from "@/leaseHistory/components/LeaseHistoryItem";
import type { HistoryLeaseNode } from "@/leaseHistory/types";

type Props = {
  node: HistoryLeaseNode;
  stateOptions: Array<Record<string, any>>;
  onDeleteRelatedLease?: (id: number) => void;
};

const LeaseHistoryNode = ({
  node,
  stateOptions,
  onDeleteRelatedLease,
}: Props) => {
  const leaseItem = {
    key: node.key,
    id: node.lease.id,
    deleteId: node.relatedLeaseId,
    lease: node.lease,
    startDate: node.startDate,
    endDate: node.endDate,
    active: node.active,
    state: node.state,
    onDelete: onDeleteRelatedLease,
  };

  const items: Array<Record<string, any>> = [
    leaseItem,
    ...node.attachments.map((attachment) => ({ ...attachment })),
  ];

  return (
    <>
      {items.map((item) => (
        <LeaseHistoryItem
          {...item}
          indented={item.lease == null}
          key={item.key}
          stateOptions={stateOptions}
        />
      ))}
    </>
  );
};

export default LeaseHistoryNode;
