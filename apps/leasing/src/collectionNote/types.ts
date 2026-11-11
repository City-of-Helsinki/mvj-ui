import type { Attributes, Methods } from "types";
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
