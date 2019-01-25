// @flow
import type {Action} from '$src/types';
import type {InvoiceId} from '$src/invoices/types';

export type PenaltyInterestState = {
  byInvoice: Object,
  isFetchingByInvoice: Object,
};

export type FetchPenaltyInterestByInvoiceAction = Action<'mvj/penaltyInterest/FETCH_BY_INVOICE', InvoiceId>;
export type ReceivePenaltyInterestByInvoiceAction = Action<'mvj/penaltyInterest/RECEIVE_BY_INVOICE', Object>;
export type PenaltyInterestNotFoundByInvoiceAction = Action<'mvj/penaltyInterest/NOT_FOUND_BY_INVOICE', InvoiceId>;
