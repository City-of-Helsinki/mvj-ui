import type { Action, Attributes, Methods } from "src/types";
import type { LeaseId } from "src/leases/types";
export type CollectionNoteId = number;
export type CollectionNoteState = {
  attributes: Attributes;
  byLease: Record<string, any>;
  isFetchingAttributes: boolean;
  isFetchingByLease: Record<string, any>;
  methods: Methods;
};
export type CreateCollectionNotePayload = {
  lease: LeaseId;
  note: string;
};
export type DeleteCollectionNotePayload = {
  id: CollectionNoteId;
  lease: LeaseId;
};
export type FetchAttributesAction = Action<"mvj/collectionNote/FETCH_ATTRIBUTES", void>;
export type ReceiveAttributesAction = Action<"mvj/collectionNote/RECEIVE_ATTRIBUTES", Attributes>;
export type ReceiveMethodsAction = Action<"mvj/collectionNote/RECEIVE_METHODS", Methods>;
export type CollectionNoteAttributesNotFoundAction = Action<"mvj/collectionNote/ATTRIBUTES_NOT_FOUND", void>;
export type FetchCollectionNotesByLeaseAction = Action<"mvj/collectionNote/FETCH_BY_LEASE", LeaseId>;
export type ReceiveCollectionNotesByLeaseAction = Action<"mvj/collectionNote/RECEIVE_BY_LEASE", Record<string, any>>;
export type CollectionNotesNotFoundByLeaseAction = Action<"mvj/collectionNote/NOT_FOUND_BY_LEASE", LeaseId>;
export type CreateCollectionNoteAction = Action<"mvj/collectionNote/CREATE", CreateCollectionNotePayload>;
export type DeleteCollectionNoteAction = Action<"mvj/collectionNote/DELETE", DeleteCollectionNotePayload>;