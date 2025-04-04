import { createAction } from "redux-actions";
import type { Attributes, Methods } from "types";
import type {
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  CollectionNoteAttributesNotFoundAction,
  CreateCollectionNotePayload,
  DeleteCollectionNotePayload,
  FetchCollectionNotesByLeaseAction,
  ReceiveCollectionNotesByLeaseAction,
  CollectionNotesNotFoundByLeaseAction,
  CreateCollectionNoteAction,
  DeleteCollectionNoteAction,
} from "./types";
import type { LeaseId } from "@/leases/types";
export const fetchAttributes = (): FetchAttributesAction =>
  createAction("mvj/collectionNote/FETCH_ATTRIBUTES")();
export const receiveAttributes = (
  attributes: Attributes,
): ReceiveAttributesAction =>
  createAction("mvj/collectionNote/RECEIVE_ATTRIBUTES")(attributes);
export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction("mvj/collectionNote/RECEIVE_METHODS")(methods);
export const attributesNotFound = (): CollectionNoteAttributesNotFoundAction =>
  createAction("mvj/collectionNote/ATTRIBUTES_NOT_FOUND")();
export const fetchCollectionNotesByLease = (
  lease: LeaseId,
): FetchCollectionNotesByLeaseAction =>
  createAction("mvj/collectionNote/FETCH_BY_LEASE")(lease);
export const receiveCollectionNotesByLease = (
  payload: Record<string, any>,
): ReceiveCollectionNotesByLeaseAction =>
  createAction("mvj/collectionNote/RECEIVE_BY_LEASE")(payload);
export const notFoundByLease = (
  lease: LeaseId,
): CollectionNotesNotFoundByLeaseAction =>
  createAction("mvj/collectionNote/NOT_FOUND_BY_LEASE")(lease);
export const createCollectionNote = (
  payload: CreateCollectionNotePayload,
): CreateCollectionNoteAction =>
  createAction("mvj/collectionNote/CREATE")(payload);
export const deleteCollectionNote = (
  payload: DeleteCollectionNotePayload,
): DeleteCollectionNoteAction =>
  createAction("mvj/collectionNote/DELETE")(payload);
