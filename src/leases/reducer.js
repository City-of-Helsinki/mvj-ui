// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  Identifiers,
  ReceiveIdentifiersAction,
  Lease,
  LeasesList,
  ReceiveLeasesAction,
  ReceiveSingleLeaseAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/leases/FETCH_IDENTIFIERS': () => true,
  'mvj/leases/RECEIVE_IDENTIFIERS': () => false,
  'mvj/leases/FETCH_ALL': () => true,
  'mvj/leases/RECEIVE_ALL': () => false,
  'mvj/leases/FETCH_SINGLE': () => true,
  'mvj/leases/RECEIVE_SINGLE': () => false,
  'mvj/leases/NOT_FOUND': () => false,
  'mvj/leases/CREATE': () => true,
  'mvj/leases/EDIT': () => true,
}, false);

const identifiersReducer: Reducer<Identifiers> = handleActions({
  ['mvj/leases/RECEIVE_IDENTIFIERS']: (state: Identifiers, {payload: identifiers}: ReceiveIdentifiersAction) => {
    return identifiers;
  },
}, {});

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
  identifiers: identifiersReducer,
  current: currentLeaseReducer,
  list: leasesListReducer,
  isFetching: isFetchingReducer,
});
