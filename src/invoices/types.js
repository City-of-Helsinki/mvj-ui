// @flow
import type {Action, Attributes, Methods} from '$src/types';
import type {LeaseId} from '$src/leases/types';

export type InvoiceState = {
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
  methods: Methods,
  patchedInvoice: ?Invoice,
};
export type Invoice = Object;
export type InvoiceId = number;
export type InvoiceList = Array<Object>;
export type InvoiceListMap = Object;

export type FetchAttributesAction = Action<'mvj/invoices/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/invoices/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/invoices/RECEIVE_METHODS', Methods>;
export type InvoiceAttributesNotFoundAction = Action<'mvj/invoices/ATTRIBUTES_NOT_FOUND', void>;

export type FetchInvoicesByLeaseAction = Action<'mvj/invoices/FETCH_BY_LEASE', LeaseId>;
export type ReceiveInvoicesByLeaseAction = Action<'mvj/invoices/RECEIVE_BY_LEASE', InvoiceListMap>;
export type CreateInvoiceAction = Action<'mvj/invoices/CREATE', Invoice>;
export type CreditInvoiceAction = Action<'mvj/invoices/CREDIT_INVOICE', Object>;
export type PatchInvoiceAction = Action<'mvj/invoices/PATCH', Invoice>;
export type ReceivePatchedInvoiceAction = Action<'mvj/invoices/RECEIVE_PATCHED', Invoice>;
export type ClearPatchedInvoiceAction = Action<'mvj/invoices/CLEAR_PATCHED', void>;

export type InvoiceNotFoundAction = Action<'mvj/invoices/NOT_FOUND', void>;

export type ReceiveIsCreateInvoicePanelOpenAction = Action<'mvj/invoices/RECEIVE_IS_CREATE_PANEL_OPEN', boolean>;
export type ReceiveIsCreditInvoicePanelOpenAction = Action<'mvj/invoices/RECEIVE_IS_CREDIT_PANEL_OPEN', boolean>;
export type ReceiveInvoiceToCreditAction = Action<'mvj/invoices/RECEIVE_INVOICE_TO_CREDIT', ?string>;

export type ReceiveIsCreateClickedAction = Action<'mvj/invoices/RECEIVE_CREATE_CLICKED', boolean>;
export type ReceiveIsCreditClickedAction = Action<'mvj/invoices/RECEIVE_CREDIT_CLICKED', boolean>;
export type ReceiveIsEditClickedAction = Action<'mvj/invoices/RECEIVE_EDIT_CLICKED', boolean>;
