import type { Action, Attributes, Methods } from "types";
import type { LeaseId } from "@/leases/types";
import type { InvoiceId } from "@/invoices/types";
import { CollectionStageOptions } from "./enums";
export type CollectionNoteId = number;
export type CollectionNoteState = {
  attributes: Attributes;
  byLease: Record<string, any>;
  isFetchingAttributes: boolean;
  isFetchingByLease: Record<string, any>;
  methods: Methods;
};
export type CollectionNote = {
  id: CollectionNoteId;
  lease: LeaseId;
  note?: string;
  user: Record<string, any>;
  created_at: string;
  modified_at: string;
  collection_stage?: string;
  invoices?: Array<InvoiceId>;
  sent_date?: string;
  inspection_date?: string;
  postpone_date?: string;
  entire_lease?: boolean;
};
export type CollectionNotePayload = {
  id?: CollectionNoteId;
  lease: LeaseId;
  note?: string;
  collection_stage?: string;
  invoices?: Array<InvoiceId>;
  sent_date?: string;
  inspection_date?: string;
  postpone_date?: string;
  entire_lease?: boolean;
};
export type DeleteCollectionNotePayload = {
  id: CollectionNoteId;
  lease: LeaseId;
};
export type CollectionStageOption =
  (typeof CollectionStageOptions)[keyof typeof CollectionStageOptions];
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
export type CreateCollectionNoteAction = Action<string, CollectionNotePayload>;
export type DeleteCollectionNoteAction = Action<
  string,
  DeleteCollectionNotePayload
>;
export type EditCollectionNoteAction = Action<string, CollectionNotePayload>;
