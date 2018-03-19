// @flow

import type {Selector} from '../types';
import get from 'lodash/get';
import type {Attributes, Lease, LeaseState} from './types';

export const getIsEditMode: Selector<boolean, void> = (state: LeaseState): boolean =>
  state.lease.isEditMode;

export const getIsFetching: Selector<Lease, void> = (state: Object): LeaseState =>
  state.lease.isFetching;

export const getAttributes: Selector<Attributes, void> = (state: Object): LeaseState =>
  state.lease.attributes;

export const getLeasesList: Selector<Lease, void> = (state: Object): LeaseState =>
  state.lease.list;

export const getCurrentLease: Selector<Lease, void> = (state: Object): LeaseState =>
  state.lease.current;

export const getComments: Selector<Lease, void> = (state: Object): LeaseState =>
  state.lease.current.comments;

export const getInvoices: Selector<Object, void> = (state: Object): LeaseState =>
  state.lease.invoices;

export const getLessors: Selector<Object, void> = (state: Object): LeaseState =>
  state.lease.lessors;

export const getAreas: Selector<Object, void> = (state: Object): LeaseState =>
  state.lease.areas;

export const getLeaseInfoErrors: Selector<any, void> = (state: Object): Object =>
  get(state, 'form.lease-info-edit-form.syncErrors');

export const getSummaryFormValues: Selector<any, void> = (state: Object): Object =>
  get(state, 'form.summary-edit-form.values');
