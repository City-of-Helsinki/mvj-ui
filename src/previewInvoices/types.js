// @flow
import type {Action, Attributes, Methods} from '$src/types';
import type {LeaseId} from '$src/leases/types';

export type PreviewInvoicesState = {
  attributes: Attributes,
  isFetching: boolean,
  isFetchingAttributes: boolean,
  list: PreviewInvoices,
  methods: Methods,
}

export type PreviewInvoicesFetchPayload = {
  lease: LeaseId,
  year?: number,
};

export type PreviewInvoices = Array<BillingPeriod> | null;
export type BillingPeriod = Array<BillingPeriodInvoice>;
export type BillingPeriodInvoice = Object;

export type FetchAttributesAction = Action<'mvj/previewInvoices/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/previewInvoices/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/previewInvoices/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/previewInvoices/ATTRIBUTES_NOT_FOUND', void>;

export type FetchPreviewInvoicesAction = Action<'mvj/previewInvoices/FETCH_ALL', PreviewInvoicesFetchPayload>;
export type ReceivePreviewInvoicesAction = Action<'mvj/previewInvoices/RECEIVE_ALL', PreviewInvoices>;
export type ClearPreviewInvoicesAction = Action<'mvj/previewInvoices/CLEAR', void>;
export type PreviewInvoicesNotFoundAction = Action<'mvj/previewInvoices/NOT_FOUND', void>;
