import type { Action, Attributes, Methods } from "src/types";
export type InvoiceNoteState = {
  attributes: Attributes;
  isCreateModalOpen: boolean;
  isFetching: boolean;
  isFetchingAttributes: boolean;
  list: Record<string, any>;
  methods: Methods;
};
export type InvoiceNoteList = Record<string, any>;
export type CreateInvoiceNoteAndFetchListPayload = {
  data: Record<string, any>;
  query: Record<string, any>;
};
export type FetchAttributesAction = Action<"mvj/invoiceNote/FETCH_ATTRIBUTES", void>;
export type ReceiveAttributesAction = Action<"mvj/invoiceNote/RECEIVE_ATTRIBUTES", Attributes>;
export type ReceiveMethodsAction = Action<"mvj/invoiceNote/RECEIVE_METHODS", Methods>;
export type AttributesNotFoundAction = Action<"mvj/invoiceNote/ATTRIBUTES_NOT_FOUND", void>;
export type FetchInvoiceNoteListAction = Action<"mvj/invoiceNote/FETCH_ALL", Record<string, any>>;
export type ReceiveInvoiceNoteListAction = Action<"mvj/invoiceNote/RECEIVE_ALL", InvoiceNoteList>;
export type CreateInvoiceNoteAndFetchListAction = Action<"mvj/invoiceNote/CREATE_AND_FETCH", CreateInvoiceNoteAndFetchListPayload>;
export type NotFoundAction = Action<"mvj/invoiceNote/NOT_FOUND", void>;
export type HideCreateInvoiceNoteModalAction = Action<"mvj/invoiceNote/HIDE_CREATE_MODAL", void>;
export type ShowCreateInvoiceNoteModalAction = Action<"mvj/invoiceNote/SHOW_CREATE_MODAL", void>;