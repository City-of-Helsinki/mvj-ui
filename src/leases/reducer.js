// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  Attributes,
  Invoices,
  Lease,
  LeasesList,
  ReceiveAttributesAction,
  ReceiveInvoicesAction,
  ReceiveLeasesAction,
  ReceiveSingleLeaseAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  // 'mvj/leases/FETCH_IDENTIFIERS': () => true,
  // 'mvj/leases/RECEIVE_ATTRIBUTES': () => false,
  'mvj/leases/CREATE': () => true,
  'mvj/leases/EDIT': () => true,
  'mvj/leases/FETCH_ALL': () => true,
  'mvj/leases/FETCH_SINGLE': () => true,
  'mvj/leases/NOT_FOUND': () => false,
  'mvj/leases/RECEIVE_ALL': () => false,
  'mvj/leases/RECEIVE_SINGLE': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/leases/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, {});

const invoicesReducer: Reducer<Invoices> = handleActions({
  ['mvj/leases/RECEIVE_INVOICES']: (state: Invoices, {payload: invoices}: ReceiveInvoicesAction) => {
    return invoices;
  },
}, []);

const leasesListReducer: Reducer<LeasesList> = handleActions({
  ['mvj/leases/RECEIVE_ALL']: (state: LeasesList, {payload: leases}: ReceiveLeasesAction) => {
    return leases;
  },
}, []);

const currentLeaseReducer: Reducer<Lease> = handleActions({
  ['mvj/leases/RECEIVE_SINGLE']: (state: Lease, {payload: lease}: ReceiveSingleLeaseAction) => {
    return lease;
  },
}, {});

export default combineReducers({
  attributes: attributesReducer,
  current: currentLeaseReducer,
  invoices: invoicesReducer,
  isFetching: isFetchingReducer,
  list: leasesListReducer,
});
