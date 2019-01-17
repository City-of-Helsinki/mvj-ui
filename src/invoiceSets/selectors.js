// @flow
import type {Attributes, Methods, Selector} from '$src/types';
import type {RootState} from '$src/root/types';
import type {InvoiceSetList} from './types';
import type {LeaseId} from '$src/leases/types';

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.invoiceSet.isFetchingAttributes;

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.invoiceSet.attributes;

export const getMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.invoiceSet.methods;

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.invoiceSet.isFetching;

export const getInvoiceSetsByLease: Selector<InvoiceSetList, LeaseId> = (state: RootState, leaseId: LeaseId): InvoiceSetList => {
  return state.invoiceSet.byLease[leaseId];
};
