// @flow
import type {Action} from '$src/types';
import type {LeaseId} from '$src/leases/types';

export type PreviewInvoicesState = {
  isFetching: boolean,
  list: PreviewInvoices,
}

export type FetchPreviewInvoicesPayload = {
  lease: LeaseId,
  year?: number,
};

export type PreviewInvoices = Array<BillingPeriod> | null;
export type BillingPeriod = Array<BillingPeriodInvoice>;
export type BillingPeriodInvoice = Object;

export type FetchPreviewInvoicesAction = Action<'mvj/previewInvoices/FETCH_ALL', FetchPreviewInvoicesPayload>;
export type ReceivePreviewInvoicesAction = Action<'mvj/previewInvoices/RECEIVE_ALL', PreviewInvoices>;
export type ClearPreviewInvoicesAction = Action<'mvj/previewInvoices/CLEAR', void>;
export type PreviewInvoicesNotFoundAction = Action<'mvj/previewInvoices/NOT_FOUND', void>;
