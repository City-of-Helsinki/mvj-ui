import type { Action, Attributes, Methods } from "src/types";
import type { LeaseId } from "src/leases/types";
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
  file: Record<string, any>;
};
export type DeleteCollectionCourtDecisionPayload = {
  id: CollectionCourtDecisionId;
  lease: LeaseId;
};
export type FetchAttributesAction = Action<"mvj/collectionCourtDecision/FETCH_ATTRIBUTES", void>;
export type ReceiveAttributesAction = Action<"mvj/collectionCourtDecision/RECEIVE_ATTRIBUTES", Attributes>;
export type ReceiveMethodsAction = Action<"mvj/collectionCourtDecision/RECEIVE_METHODS", Methods>;
export type CollectionCourtDecisionAttributesNotFoundAction = Action<"mvj/collectionCourtDecision/ATTRIBUTES_NOT_FOUND", void>;
export type FetchCollectionCourtDecisionsByLeaseAction = Action<"mvj/collectionCourtDecision/FETCH_BY_LEASE", LeaseId>;
export type ReceiveCollectionCourtDecisionsByLeaseAction = Action<"mvj/collectionCourtDecision/RECEIVE_BY_LEASE", Record<string, any>>;
export type CollectionCourtDecisionsNotFoundByLeaseAction = Action<"mvj/collectionCourtDecision/NOT_FOUND_BY_LEASE", LeaseId>;
export type UploadCollectionCourtDecisionAction = Action<"mvj/collectionCourtDecision/UPLOAD", UploadCollectionCourtDecisionPayload>;
export type DeleteCollectionCourtDecisionAction = Action<"mvj/collectionCourtDecision/DELETE", DeleteCollectionCourtDecisionPayload>;
export type HideCollectionCourtDecisionPanelAction = Action<"mvj/collectionCourtDecision/HIDE_PANEL", void>;
export type ShowCollectionCourtDecisionPanelAction = Action<"mvj/collectionCourtDecision/SHOW_PANEL", void>;