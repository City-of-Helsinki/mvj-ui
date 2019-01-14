// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Methods, Reducer} from '../types';
import type {
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  ReceiveBillingPeriodsAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/billingperiods/FETCH_ALL': () => true,
  'mvj/billingperiods/NOT_FOUND': () => false,
  'mvj/billingperiods/RECEIVE_ALL': () => false,
}, false);

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/billingperiods/FETCH_ATTRIBUTES': () => true,
  'mvj/billingperiods/RECEIVE_ATTRIBUTES': () => false,
  'mvj/billingperiods/RECEIVE_METHODS': () => false,
  'mvj/billingperiods/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/billingperiods/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes || {};
  },
}, {});

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/billingperiods/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods || {};
  },
}, {});

const byLeaseReducer: Reducer<Object> = handleActions({
  ['mvj/billingperiods/RECEIVE_ALL']: (state: Object, {payload}: ReceiveBillingPeriodsAction) => {
    return {
      ...state,
      [payload.leaseId]: payload.billingPeriods,
    };
  },
}, {});

export default combineReducers({
  attributes: attributesReducer,
  byLease: byLeaseReducer,
  isFetching: isFetchingReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  methods: methodsReducer,
});
