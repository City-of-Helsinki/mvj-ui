import { createAction } from "redux-actions";
import type { Attributes, Methods } from "types";
import type {
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  InvoiceAttributesNotFoundAction,
  Invoice,
  InvoiceListMap,
  FetchInvoicesByLeaseAction,
  ReceiveInvoicesByLeaseAction,
  CreateInvoiceAction,
  CreditInvoiceAction,
  PatchInvoiceAction,
  ExportInvoiceToLaskeAndUpdateListAction,
  ExportInvoiceToLaskeAndUpdateListPayload,
  ReceivePatchedInvoiceAction,
  ClearPatchedInvoiceAction,
  InvoiceNotFoundAction,
  ReceiveInvoiceToCreditAction,
  ReceiveIsCreateInvoicePanelOpenAction,
  ReceiveIsCreditInvoicePanelOpenAction,
  ReceiveIsCreateClickedAction,
  ReceiveIsCreditClickedAction,
  ReceiveIsEditClickedAction,
  DeleteInvoiceAction,
} from "./types";
import type { LeaseId } from "@/leases/types";
export const fetchAttributes = (): FetchAttributesAction =>
  createAction("mvj/invoices/FETCH_ATTRIBUTES")();
export const receiveAttributes = (
  attributes: Attributes,
): ReceiveAttributesAction =>
  createAction("mvj/invoices/RECEIVE_ATTRIBUTES")(attributes);
export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction("mvj/invoices/RECEIVE_METHODS")(methods);
export const attributesNotFound = (): InvoiceAttributesNotFoundAction =>
  createAction("mvj/invoices/ATTRIBUTES_NOT_FOUND")();
export const fetchInvoicesByLease = (
  leaseId: LeaseId,
): FetchInvoicesByLeaseAction =>
  createAction("mvj/invoices/FETCH_BY_LEASE")(leaseId);
export const receiveInvoicesByLease = (
  invoices: InvoiceListMap,
): ReceiveInvoicesByLeaseAction =>
  createAction("mvj/invoices/RECEIVE_BY_LEASE")(invoices);
export const createInvoice = (invoice: Invoice): CreateInvoiceAction =>
  createAction("mvj/invoices/CREATE")(invoice);
export const creditInvoice = (
  invoice: Record<string, any>,
): CreditInvoiceAction => createAction("mvj/invoices/CREDIT_INVOICE")(invoice);
export const patchInvoice = (invoice: Invoice): PatchInvoiceAction =>
  createAction("mvj/invoices/PATCH")(invoice);
export const deleteInvoice = (invoice: Invoice): DeleteInvoiceAction =>
  createAction("mvj/invoices/DELETE")(invoice);
export const exportInvoiceToLaskeAndUpdateList = (
  payload: ExportInvoiceToLaskeAndUpdateListPayload,
): ExportInvoiceToLaskeAndUpdateListAction =>
  createAction("mvj/invoices/EXPORT_TO_LASKE_AND_UPDATE")(payload);
export const receivePatchedInvoice = (
  invoice: Invoice,
): ReceivePatchedInvoiceAction =>
  createAction("mvj/invoices/RECEIVE_PATCHED")(invoice);
export const clearPatchedInvoice = (): ClearPatchedInvoiceAction =>
  createAction("mvj/invoices/CLEAR_PATCHED")();
export const receiveIsCreateInvoicePanelOpen = (
  isOpen: boolean,
): ReceiveIsCreateInvoicePanelOpenAction =>
  createAction("mvj/invoices/RECEIVE_IS_CREATE_PANEL_OPEN")(isOpen);
export const receiveIsCreditInvoicePanelOpen = (
  isOpen: boolean,
): ReceiveIsCreditInvoicePanelOpenAction =>
  createAction("mvj/invoices/RECEIVE_IS_CREDIT_PANEL_OPEN")(isOpen);
export const receiveIsCreateClicked = (
  isClicked: boolean,
): ReceiveIsCreateClickedAction =>
  createAction("mvj/invoices/RECEIVE_CREATE_CLICKED")(isClicked);
export const receiveIsCreditClicked = (
  isClicked: boolean,
): ReceiveIsCreditClickedAction =>
  createAction("mvj/invoices/RECEIVE_CREDIT_CLICKED")(isClicked);
export const receiveIsEditClicked = (
  isClicked: boolean,
): ReceiveIsEditClickedAction =>
  createAction("mvj/invoices/RECEIVE_EDIT_CLICKED")(isClicked);
export const receiveInvoiceToCredit = (
  invoiceId: string | null | undefined,
): ReceiveInvoiceToCreditAction =>
  createAction("mvj/invoices/RECEIVE_INVOICE_TO_CREDIT")(invoiceId);
export const notFound = (): InvoiceNotFoundAction =>
  createAction("mvj/invoices/NOT_FOUND")();
