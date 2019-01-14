// @flow
import type {Attributes, Methods, Selector} from '$src/types';
import type {RootState} from '$src/root/types';
import type {InvoiceId} from '$src/invoices/types';

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.penaltyInterest.isFetchingAttributes;

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.penaltyInterest.attributes;

export const getMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.penaltyInterest.methods;

export const getPenaltyInterestByInvoice: Selector<boolean, InvoiceId> = (state: RootState, id: InvoiceId): boolean =>
  state.penaltyInterest.byInvoice[id];

export const getIsFetchingByInvoice: Selector<boolean, InvoiceId> = (state: RootState, id: InvoiceId): boolean =>
  state.penaltyInterest.isFetchingByInvoice[id];
