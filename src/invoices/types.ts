import type { Action, Attributes, Methods } from "types";
import type { LeaseId } from "@/leases/types";
export type InvoiceState = {
  attributes: Attributes;
  byLease: InvoiceListMap;
  invoiceToCredit: string | null | undefined;
  isCreateClicked: boolean;
  isCreatePanelOpen: boolean;
  isCreditClicked: boolean;
  isCreditPanelOpen: boolean;
  isEditClicked: boolean;
  isFetching: boolean;
  isFetchingAttributes: boolean;
  isSaving: boolean;
  methods: Methods;
  patchedInvoice: Invoice | null | undefined;
};
export type Invoice = Record<string, any>;
export type InvoiceId = number;
export type InvoiceList = Array<Record<string, any>>;
export type InvoiceListMap = Record<string, any>;
export type ExportInvoiceToLaskeAndUpdateListPayload = {
  id: InvoiceId;
  lease: LeaseId;
};
export type FetchAttributesAction = Action<string, void>;
export type ReceiveAttributesAction = Action<string, Attributes>;
export type ReceiveMethodsAction = Action<string, Methods>;
export type InvoiceAttributesNotFoundAction = Action<string, void>;
export type FetchInvoicesByLeaseAction = Action<string, LeaseId>;
export type ReceiveInvoicesByLeaseAction = Action<string, InvoiceListMap>;
export type CreateInvoiceAction = Action<string, Invoice>;
export type CreditInvoiceAction = Action<string, Record<string, any>>;
export type PatchInvoiceAction = Action<string, Invoice>;
export type ExportInvoiceToLaskeAndUpdateListAction = Action<
  string,
  ExportInvoiceToLaskeAndUpdateListPayload
>;
export type ReceivePatchedInvoiceAction = Action<string, Invoice>;
export type ClearPatchedInvoiceAction = Action<string, void>;
export type DeleteInvoiceAction = Action<string, Invoice>;
export type InvoiceNotFoundAction = Action<string, void>;
export type ReceiveIsCreateInvoicePanelOpenAction = Action<string, boolean>;
export type ReceiveIsCreditInvoicePanelOpenAction = Action<string, boolean>;
export type ReceiveInvoiceToCreditAction = Action<
  string,
  string | null | undefined
>;
export type ReceiveIsCreateClickedAction = Action<string, boolean>;
export type ReceiveIsCreditClickedAction = Action<string, boolean>;
export type ReceiveIsEditClickedAction = Action<string, boolean>;
