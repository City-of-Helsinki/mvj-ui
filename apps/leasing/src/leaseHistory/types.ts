import type { Lease } from "@/leases/types";
import type {
  LeaseHistoryItemTypes,
  LeaseHistoryStates,
} from "@/leaseHistory/enums";

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

export type HistoryLeaseNode = {
  key: string;
  lease: Partial<Lease>;
  relatedLeaseId?: number;
  serviceUnitId: number | null;
  serviceUnitName: string;
  startDate: string | null;
  endDate: string | null;
  active: boolean;
  state: HistoryState;
  successorIds: number[];
  predecessorIds: number[];
  attachments: HistoryAttachment[];
};

export type HistoryChain = {
  key: string;
  nodes: HistoryLeaseNode[];
};

export type HistoryServiceUnitGroup = {
  serviceUnitId: number | null;
  serviceUnitName: string;
  chains: HistoryChain[];
};

export type HistoryState =
  (typeof LeaseHistoryStates)[keyof typeof LeaseHistoryStates];
