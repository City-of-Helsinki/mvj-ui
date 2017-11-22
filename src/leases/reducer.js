// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  Attributes,
  Lease,
  LeasesList,
  ReceiveAttributesAction,
  ReceiveLeasesAction,
  ReceiveSingleLeaseAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  // 'mvj/leases/FETCH_IDENTIFIERS': () => true,
  // 'mvj/leases/RECEIVE_ATTRIBUTES': () => false,
  'mvj/leasesbeta/CREATE': () => true,
  'mvj/leasesbeta/EDIT': () => true,
  'mvj/leasesbeta/FETCH_ALL': () => true,
  'mvj/leasesbeta/FETCH_SINGLE': () => true,
  'mvj/leasesbeta/NOT_FOUND': () => false,
  'mvj/leasesbeta/RECEIVE_ALL': () => false,
  'mvj/leasesbeta/RECEIVE_SINGLE': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/leasesbeta/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, {});

const leasesListReducer: Reducer<LeasesList> = handleActions({
  ['mvj/leasesbeta/RECEIVE_ALL']: (state: LeasesList, {payload: leases}: ReceiveLeasesAction) => {
    console.log(leases);
    return leases;
  },
}, []);

const currentLeaseReducer: Reducer<Lease> = handleActions({
  ['mvj/leasesbeta/RECEIVE_SINGLE']: (state: Lease, {payload: lease}: ReceiveSingleLeaseAction) => {
    return lease;
  },
}, {});

export default combineReducers({
  attributes: attributesReducer,
  current: currentLeaseReducer,
  isFetching: isFetchingReducer,
  list: leasesListReducer,
});
