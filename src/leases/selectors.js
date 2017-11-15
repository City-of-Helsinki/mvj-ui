// @flow

import type {Selector} from '../types';
import type {Attributes, Lease, LeaseState} from './types';

export const getIsFetching: Selector<Lease, void> = (state: Object): LeaseState =>
  state.leasebeta.isFetching;

export const getAttributes: Selector<Attributes, void> = (state: Object): LeaseState =>
  state.leasebeta.attributes;

export const getLeasesList: Selector<Lease, void> = (state: Object): LeaseState =>
  state.leasebeta.list;

export const getCurrentLease: Selector<Lease, void> = (state: Object): LeaseState =>
  state.leasebeta.current;

export const getInvoices: Selector<Object, void> = (state: Object): LeaseState =>
  state.leasebeta.invoices;

export const getAreas: Selector<Object, void> = (state: Object): LeaseState =>
  state.leasebeta.areas;
