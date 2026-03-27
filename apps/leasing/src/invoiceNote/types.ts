import type { Action, Attributes, Methods } from "types";
export type InvoiceNoteState = {
  attributes: Attributes;
  isCreateModalOpen: boolean;
  isFetching: boolean;
  isFetchingAttributes: boolean;
  list: Record<string, any>;
  methods: Methods;
};
export type InvoiceNoteList = any;
export type CreateInvoiceNoteAndFetchListPayload = {
  data: Record<string, any>;
  query: Record<string, any>;
};
export type FetchAttributesAction = Action<string, void>;
export type ReceiveAttributesAction = Action<string, Attributes>;
export type ReceiveMethodsAction = Action<string, Methods>;
export type AttributesNotFoundAction = Action<string, void>;
export type FetchInvoiceNoteListAction = Action<string, Record<string, any>>;
export type ReceiveInvoiceNoteListAction = Action<string, InvoiceNoteList>;
export type CreateInvoiceNoteAndFetchListAction = Action<
  string,
  CreateInvoiceNoteAndFetchListPayload
>;
export type NotFoundAction = Action<string, void>;
export type HideCreateInvoiceNoteModalAction = Action<string, void>;
export type ShowCreateInvoiceNoteModalAction = Action<string, void>;
