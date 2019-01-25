// @flow
import type {Selector} from '$src/types';
import type {RootState} from '$src/root/types';
import type {InvoiceId} from '$src/invoices/types';

export const getPenaltyInterestByInvoice: Selector<boolean, InvoiceId> = (state: RootState, id: InvoiceId): boolean =>
  state.penaltyInterest.byInvoice[id];

export const getIsFetchingByInvoice: Selector<boolean, InvoiceId> = (state: RootState, id: InvoiceId): boolean =>
  state.penaltyInterest.isFetchingByInvoice[id];
