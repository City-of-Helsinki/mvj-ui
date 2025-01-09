import type { Action, Attributes, Methods } from "types";
import type { LeaseId } from "@/leases/types";
export type CollectionCourtDecisionState = {
  attributes: Attributes;
  byLease: Record<string, any>;
  isFetchingAttributes: boolean;
  isFetchingByLease: Record<string, any>;
  isPanelOpen: boolean;
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
export type FetchAttributesAction = Action<string, void>;
export type ReceiveAttributesAction = Action<string, Attributes>;
export type ReceiveMethodsAction = Action<string, Methods>;
export type CollectionCourtDecisionAttributesNotFoundAction = Action<
  string,
  void
>;
export type FetchCollectionCourtDecisionsByLeaseAction = Action<
  string,
  LeaseId
>;
export type ReceiveCollectionCourtDecisionsByLeaseAction = Action<
  string,
  Record<string, any>
>;
export type CollectionCourtDecisionsNotFoundByLeaseAction = Action<
  string,
  LeaseId
>;
export type UploadCollectionCourtDecisionAction = Action<
  string,
  UploadCollectionCourtDecisionPayload
>;
export type DeleteCollectionCourtDecisionAction = Action<
  string,
  DeleteCollectionCourtDecisionPayload
>;
export type HideCollectionCourtDecisionPanelAction = Action<string, void>;
export type ShowCollectionCourtDecisionPanelAction = Action<string, void>;
