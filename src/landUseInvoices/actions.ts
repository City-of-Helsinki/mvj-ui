import { createAction } from "redux-actions";
import type { Attributes, Methods } from "types";
import type {
  CreateChargePayload,
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  InvoiceAttributesNotFoundAction,
  Invoice,
  InvoiceListMap,
  FetchInvoicesByLandUseContractAction,
  ReceiveInvoicesByLandUseContractAction,
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
  ReceiveCollapseStatesAction,
  StartInvoicingAction,
  StopInvoicingAction,
  CreateChargeAction,
} from "./types";
import type { LandUseContractId } from "@/landUseInvoices/types";
export const fetchAttributes = (): FetchAttributesAction =>
  createAction("mvj/landUseInvoices/FETCH_ATTRIBUTES")();
export const receiveAttributes = (
  attributes: Attributes,
): ReceiveAttributesAction =>
  createAction("mvj/landUseInvoices/RECEIVE_ATTRIBUTES")(attributes);
export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction("mvj/landUseInvoices/RECEIVE_METHODS")(methods);
export const attributesNotFound = (): InvoiceAttributesNotFoundAction =>
  createAction("mvj/landUseInvoices/ATTRIBUTES_NOT_FOUND")();
export const fetchInvoicesByLandUseContract = (
  landUseContractId: LandUseContractId,
): FetchInvoicesByLandUseContractAction =>
  createAction("mvj/landUseInvoices/FETCH_BY_LAND_USE_CONTRACT")(
    landUseContractId,
  );
export const receiveInvoicesByLandUseContract = (
  invoices: InvoiceListMap,
): ReceiveInvoicesByLandUseContractAction =>
  createAction("mvj/landUseInvoices/RECEIVE_BY_LAND_USE_CONTRACT")(invoices);
export const createInvoice = (invoice: Invoice): CreateInvoiceAction =>
  createAction("mvj/landUseInvoices/CREATE")(invoice);
export const creditInvoice = (
  invoice: Record<string, any>,
): CreditInvoiceAction =>
  createAction("mvj/landUseInvoices/CREDIT_INVOICE")(invoice);
export const patchInvoice = (invoice: Invoice): PatchInvoiceAction =>
  createAction("mvj/landUseInvoices/PATCH")(invoice);
export const deleteInvoice = (invoice: Invoice): DeleteInvoiceAction =>
  createAction("mvj/landUseInvoices/DELETE")(invoice);
export const exportInvoiceToLaskeAndUpdateList = (
  payload: ExportInvoiceToLaskeAndUpdateListPayload,
): ExportInvoiceToLaskeAndUpdateListAction =>
  createAction("mvj/landUseInvoices/EXPORT_TO_LASKE_AND_UPDATE")(payload);
export const receivePatchedInvoice = (
  invoice: Invoice,
): ReceivePatchedInvoiceAction =>
  createAction("mvj/landUseInvoices/RECEIVE_PATCHED")(invoice);
export const clearPatchedInvoice = (): ClearPatchedInvoiceAction =>
  createAction("mvj/landUseInvoices/CLEAR_PATCHED")();
export const receiveIsCreateInvoicePanelOpen = (
  isOpen: boolean,
): ReceiveIsCreateInvoicePanelOpenAction =>
  createAction("mvj/landUseInvoices/RECEIVE_IS_CREATE_PANEL_OPEN")(isOpen);
export const receiveIsCreditInvoicePanelOpen = (
  isOpen: boolean,
): ReceiveIsCreditInvoicePanelOpenAction =>
  createAction("mvj/landUseInvoices/RECEIVE_IS_CREDIT_PANEL_OPEN")(isOpen);
export const receiveIsCreateClicked = (
  isClicked: boolean,
): ReceiveIsCreateClickedAction =>
  createAction("mvj/landUseInvoices/RECEIVE_CREATE_CLICKED")(isClicked);
export const receiveIsCreditClicked = (
  isClicked: boolean,
): ReceiveIsCreditClickedAction =>
  createAction("mvj/landUseInvoices/RECEIVE_CREDIT_CLICKED")(isClicked);
export const receiveIsEditClicked = (
  isClicked: boolean,
): ReceiveIsEditClickedAction =>
  createAction("mvj/landUseInvoices/RECEIVE_EDIT_CLICKED")(isClicked);
export const receiveInvoiceToCredit = (
  invoiceId: string | null | undefined,
): ReceiveInvoiceToCreditAction =>
  createAction("mvj/landUseInvoices/RECEIVE_INVOICE_TO_CREDIT")(invoiceId);
export const notFound = (): InvoiceNotFoundAction =>
  createAction("mvj/landUseInvoices/NOT_FOUND")();
export const receiveCollapseStates = (
  status: Record<string, any>,
): ReceiveCollapseStatesAction =>
  createAction("mvj/landUseInvoices/RECEIVE_COLLAPSE_STATES")(status);
export const startInvoicing = (id: number): StartInvoicingAction =>
  createAction("mvj/landUseInvoices/START_INVOICING")(id);
export const stopInvoicing = (id: number): StopInvoicingAction =>
  createAction("mvj/landUseInvoices/STOP_INVOICING")(id);
export const createCharge = (
  payload: CreateChargePayload,
): CreateChargeAction =>
  createAction("mvj/landUseInvoices/CREATE_CHARGE")(payload);
