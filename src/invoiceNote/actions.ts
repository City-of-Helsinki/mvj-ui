import { createAction } from "redux-actions";
import type { Attributes, Methods } from "types";
import type {
  CreateInvoiceNoteAndFetchListPayload,
  InvoiceNoteList,
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  AttributesNotFoundAction,
  FetchInvoiceNoteListAction,
  ReceiveInvoiceNoteListAction,
  CreateInvoiceNoteAndFetchListAction,
  NotFoundAction,
  HideCreateInvoiceNoteModalAction,
  ShowCreateInvoiceNoteModalAction,
} from "./types";
export const fetchAttributes = (): FetchAttributesAction =>
  createAction("mvj/invoiceNote/FETCH_ATTRIBUTES")();
export const receiveAttributes = (
  attributes: Attributes,
): ReceiveAttributesAction =>
  createAction("mvj/invoiceNote/RECEIVE_ATTRIBUTES")(attributes);
export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction("mvj/invoiceNote/RECEIVE_METHODS")(methods);
export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction("mvj/invoiceNote/ATTRIBUTES_NOT_FOUND")();
export const fetchInvoiceNoteList = (
  params: Record<string, any>,
): FetchInvoiceNoteListAction =>
  createAction("mvj/invoiceNote/FETCH_ALL")(params);
export const receiveInvoiceNoteList = (
  invoiceNotes: InvoiceNoteList,
): ReceiveInvoiceNoteListAction =>
  createAction("mvj/invoiceNote/RECEIVE_ALL")(invoiceNotes);
export const createInvoiceNoteAndFetchList = (
  payload: CreateInvoiceNoteAndFetchListPayload,
): CreateInvoiceNoteAndFetchListAction =>
  createAction("mvj/invoiceNote/CREATE_AND_FETCH")(payload);
export const notFound = (): NotFoundAction =>
  createAction("mvj/invoiceNote/NOT_FOUND")();
export const hideCreateInvoiceNoteModal =
  (): HideCreateInvoiceNoteModalAction =>
    createAction("mvj/invoiceNote/HIDE_CREATE_MODAL")();
export const showCreateInvoiceNoteModal =
  (): ShowCreateInvoiceNoteModalAction =>
    createAction("mvj/invoiceNote/SHOW_CREATE_MODAL")();
