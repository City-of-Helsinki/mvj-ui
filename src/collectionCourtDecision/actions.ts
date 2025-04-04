import { createAction } from "redux-actions";
import type { Attributes, Methods } from "types";
import type { LeaseId } from "@/leases/types";
import type {
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  CollectionCourtDecisionAttributesNotFoundAction,
  UploadCollectionCourtDecisionPayload,
  DeleteCollectionCourtDecisionPayload,
  FetchCollectionCourtDecisionsByLeaseAction,
  ReceiveCollectionCourtDecisionsByLeaseAction,
  CollectionCourtDecisionsNotFoundByLeaseAction,
  UploadCollectionCourtDecisionAction,
  DeleteCollectionCourtDecisionAction,
  HideCollectionCourtDecisionPanelAction,
  ShowCollectionCourtDecisionPanelAction,
} from "./types";
export const fetchAttributes = (): FetchAttributesAction =>
  createAction("mvj/collectionCourtDecision/FETCH_ATTRIBUTES")();
export const receiveAttributes = (
  attributes: Attributes,
): ReceiveAttributesAction =>
  createAction("mvj/collectionCourtDecision/RECEIVE_ATTRIBUTES")(attributes);
export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction("mvj/collectionCourtDecision/RECEIVE_METHODS")(methods);
export const attributesNotFound =
  (): CollectionCourtDecisionAttributesNotFoundAction =>
    createAction("mvj/collectionCourtDecision/ATTRIBUTES_NOT_FOUND")();
export const fetchCollectionCourtDecisionsByLease = (
  lease: LeaseId,
): FetchCollectionCourtDecisionsByLeaseAction =>
  createAction("mvj/collectionCourtDecision/FETCH_BY_LEASE")(lease);
export const receiveCollectionCourtDecisionsByLease = (
  payload: Record<string, any>,
): ReceiveCollectionCourtDecisionsByLeaseAction =>
  createAction("mvj/collectionCourtDecision/RECEIVE_BY_LEASE")(payload);
export const notFoundByLease = (
  lease: LeaseId,
): CollectionCourtDecisionsNotFoundByLeaseAction =>
  createAction("mvj/collectionCourtDecision/NOT_FOUND_BY_LEASE")(lease);
export const uploadCollectionCourtDecision = (
  payload: UploadCollectionCourtDecisionPayload,
): UploadCollectionCourtDecisionAction =>
  createAction("mvj/collectionCourtDecision/UPLOAD")(payload);
export const deleteCollectionCourtDecision = (
  payload: DeleteCollectionCourtDecisionPayload,
): DeleteCollectionCourtDecisionAction =>
  createAction("mvj/collectionCourtDecision/DELETE")(payload);
export const hideCollectionCourtDecisionPanel =
  (): HideCollectionCourtDecisionPanelAction =>
    createAction("mvj/collectionCourtDecision/HIDE_PANEL")();
export const showCollectionCourtDecisionPanel =
  (): ShowCollectionCourtDecisionPanelAction =>
    createAction("mvj/collectionCourtDecision/SHOW_PANEL")();
