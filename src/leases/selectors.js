// @flow

import type {Selector} from '../types';
import type {Attributes, Lease, LeaseState} from './types';

export const getIsFetching: Selector<Lease, void> = (state: Object): LeaseState =>
  state.lease.isFetching;

export const getAttributes: Selector<Attributes, void> = (state: Object): LeaseState =>
  state.lease.attributes;

export const getLeasesList: Selector<Lease, void> = (state: Object): LeaseState =>
  state.lease.list;

export const getCurrentLease: Selector<Lease, void> = (state: Object): LeaseState =>
  state.lease.current;

export const getInvoices: Selector<Object, void> = (state: Object): LeaseState =>
  state.lease.invoices;
