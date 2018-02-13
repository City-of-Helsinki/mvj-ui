// @flow

import type {Selector} from '../types';
import get from 'lodash/get';
import type {Attributes, Lease, LeaseState} from './types';

export const getIsFetching: Selector<Lease, void> = (state: Object): LeaseState =>
  state.leasebeta.isFetching;

export const getAttributes: Selector<Attributes, void> = (state: Object): LeaseState =>
  state.leasebeta.attributes;

export const getLeasesList: Selector<Lease, void> = (state: Object): LeaseState =>
  state.leasebeta.list;

export const getLeaseInfoErrors: Selector<any, void> = (state: Object): Object =>
  get(state, 'form.lease-info-edit-form.syncErrors');

export const getBillingAddBillErrors: Selector<any, void> = (state: Object): Object =>
  get(state, 'form.billing-edit-form.syncErrors.billing.new_bill');

export const getBillingBillModalErrors: Selector<any, void> = (state: Object): Object =>
  get(state, 'form.billing-edit-form.syncErrors.billing.bill');

export const getCurrentLease: Selector<Lease, void> = (state: Object): LeaseState =>
  state.leasebeta.current;

export const getInvoices: Selector<Object, void> = (state: Object): LeaseState =>
  state.leasebeta.invoices;

export const getAreas: Selector<Object, void> = (state: Object): LeaseState =>
  state.leasebeta.areas;
