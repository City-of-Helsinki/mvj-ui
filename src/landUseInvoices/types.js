// @flow
import type {Action, Attributes, Methods} from '$src/types';
import type {LeaseId} from '$src/landUseInvoices/types';

export type LandUseInvoicesState = {
  attributes: Attributes,
  byLease: InvoiceListMap,
  invoiceToCredit: ?string,
  isCreateClicked: boolean,
  isCreatePanelOpen: boolean,
  isCreditClicked: boolean,
  isCreditPanelOpen: boolean,
  isEditClicked: boolean,
  isFetching: boolean,
  isFetchingAttributes: boolean,
  isSaving: boolean,
  methods: Methods,
  patchedInvoice: ?Invoice,
};
export type Invoice = Object;
export type InvoiceId = number;
export type InvoiceList = Array<Object>;
export type InvoiceListMap = Object;
export type ExportInvoiceToLaskeAndUpdateListPayload = {
  id: InvoiceId,
  lease: LeaseId,
};

export type FetchAttributesAction = Action<'mvj/landUseInvoices/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/landUseInvoices/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/landUseInvoices/RECEIVE_METHODS', Methods>;
export type InvoiceAttributesNotFoundAction = Action<'mvj/landUseInvoices/ATTRIBUTES_NOT_FOUND', void>;

export type FetchInvoicesByLeaseAction = Action<'mvj/landUseInvoices/FETCH_BY_LEASE', LeaseId>;
export type ReceiveInvoicesByLeaseAction = Action<'mvj/landUseInvoices/RECEIVE_BY_LEASE', InvoiceListMap>;
export type CreateInvoiceAction = Action<'mvj/landUseInvoices/CREATE', Invoice>;
export type CreditInvoiceAction = Action<'mvj/landUseInvoices/CREDIT_INVOICE', Object>;
export type PatchInvoiceAction = Action<'mvj/landUseInvoices/PATCH', Invoice>;
export type ExportInvoiceToLaskeAndUpdateListAction = Action<'mvj/landUseInvoices/EXPORT_TO_LASKE_AND_UPDATE', ExportInvoiceToLaskeAndUpdateListPayload>;
export type ReceivePatchedInvoiceAction = Action<'mvj/landUseInvoices/RECEIVE_PATCHED', Invoice>;
export type ClearPatchedInvoiceAction = Action<'mvj/landUseInvoices/CLEAR_PATCHED', void>;
export type DeleteInvoiceAction = Action<'mvj/landUseInvoices/DELETE', Invoice>;

export type InvoiceNotFoundAction = Action<'mvj/landUseInvoices/NOT_FOUND', void>;

export type ReceiveIsCreateInvoicePanelOpenAction = Action<'mvj/landUseInvoices/RECEIVE_IS_CREATE_PANEL_OPEN', boolean>;
export type ReceiveIsCreditInvoicePanelOpenAction = Action<'mvj/landUseInvoices/RECEIVE_IS_CREDIT_PANEL_OPEN', boolean>;
export type ReceiveInvoiceToCreditAction = Action<'mvj/landUseInvoices/RECEIVE_INVOICE_TO_CREDIT', ?string>;

export type ReceiveIsCreateClickedAction = Action<'mvj/landUseInvoices/RECEIVE_CREATE_CLICKED', boolean>;
export type ReceiveIsCreditClickedAction = Action<'mvj/landUseInvoices/RECEIVE_CREDIT_CLICKED', boolean>;
export type ReceiveIsEditClickedAction = Action<'mvj/landUseInvoices/RECEIVE_EDIT_CLICKED', boolean>;
