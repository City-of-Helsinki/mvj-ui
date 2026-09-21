import type { Attributes, Methods } from "types";
import type { LeaseId } from "@/leases/types";
export type CollectionCourtDecisionState = {
  attributes: Attributes;
  byLease: Record<string, any>;
  isFetchingAttributes: boolean;
  isFetchingByLease: Record<string, any>;
  isPanelOpen: boolean;
  isSaveClicked: boolean;
  methods: Methods;
};
export type CollectionCourtDecisionId = number;
export type UploadCollectionCourtDecisionPayload = {
  data: {
    decision_date: string | null | undefined;
    note: string | null | undefined;
    lease: LeaseId;
  };
  file: any;
};
export type DeleteCollectionCourtDecisionPayload = {
  id: CollectionCourtDecisionId;
  lease: LeaseId;
};
export type ReceiveCollectionCourtDecisionsByLeasePayload = {
  lease: LeaseId;
  collectionCourtDecisions: Array<Record<string, any>>;
};
