import type { Action, Attributes, Methods } from "types";
import type { LeaseId } from "@/leases/types";
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
  collection_stage: string;
};
export type DeleteCollectionNotePayload = {
  id: CollectionNoteId;
  lease: LeaseId;
};
export type FetchAttributesAction = Action<string, void>;
export type ReceiveAttributesAction = Action<string, Attributes>;
export type ReceiveMethodsAction = Action<string, Methods>;
export type CollectionNoteAttributesNotFoundAction = Action<string, void>;
export type FetchCollectionNotesByLeaseAction = Action<string, LeaseId>;
export type ReceiveCollectionNotesByLeaseAction = Action<
  string,
  Record<string, any>
>;
export type CollectionNotesNotFoundByLeaseAction = Action<string, LeaseId>;
export type CreateCollectionNoteAction = Action<
  string,
  CreateCollectionNotePayload
>;
export type DeleteCollectionNoteAction = Action<
  string,
  DeleteCollectionNotePayload
>;
