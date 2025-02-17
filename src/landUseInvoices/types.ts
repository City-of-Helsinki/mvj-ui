import type { Action, Attributes, Methods } from "types";
export type LandUseInvoicesState = {
  attributes: Attributes;
  byLandUseContract: InvoiceListMap;
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
  collapseStates: Record<string, any>;
};
export type Invoice = Record<string, any>;
export type InvoiceId = number;
export type InvoiceList = Array<Record<string, any>>;
export type InvoiceListMap = Record<string, any>;
export type LandUseContract = Record<string, any>;
export type LandUseContractId = number;
export type ExportInvoiceToLaskeAndUpdateListPayload = {
  id: InvoiceId;
  lease: LandUseContractId;
};
export type CreateChargePayload = {
  landUseContractId: number;
  data: Record<string, any>;
};
export type FetchAttributesAction = Action<string, void>;
export type ReceiveAttributesAction = Action<string, Attributes>;
export type ReceiveMethodsAction = Action<string, Methods>;
export type InvoiceAttributesNotFoundAction = Action<string, void>;
export type FetchInvoicesByLandUseContractAction = Action<
  string,
  LandUseContractId
>;
export type ReceiveInvoicesByLandUseContractAction = Action<
  string,
  InvoiceListMap
>;
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
export type ReceiveCollapseStatesAction = Action<string, Record<string, any>>;
export type StartInvoicingAction = Action<string, number>;
export type StopInvoicingAction = Action<string, number>;
export type CreateChargeAction = Action<string, CreateChargePayload>;
