// @flow
import type {Selector} from '../types';
import type {InvoiceSetListMap, InvoiceSetsState} from './types';
import type {LeaseId} from '$src/leases/types';

export const getIsFetching: Selector<boolean, void> = (state: InvoiceSetsState): boolean =>
  state.invoiceSet.isFetching;

export const getInvoiceSetsByLease: Selector<InvoiceSetListMap, LeaseId> = (state: InvoiceSetsState, leaseId: LeaseId): InvoiceSetListMap => {
  return state.invoiceSet.byLease[leaseId];
};
