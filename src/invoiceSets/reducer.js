// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Methods, Reducer} from '../types';
import type {
  InvoiceSetListMap,
  ReceiveAttributesAction,
  ReceiveInvoiceSetsByLeaseAction,
  ReceiveMethodsAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  ['mvj/invoiceSets/FETCH_BY_LEASE']: () => true,
  ['mvj/invoiceSets/NOT_FOUND']: () => false,
  ['mvj/invoiceSets/RECEIVE_BY_LEASE']: () => false,
}, false);

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/invoiceSets/FETCH_ATTRIBUTES': () => true,
  'mvj/invoiceSets/RECEIVE_ATTRIBUTES': () => false,
  'mvj/invoiceSets/RECEIVE_METHODS': () => false,
  'mvj/invoiceSets/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/invoiceSets/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, {});

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/invoiceSets/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods;
  },
}, {});

const byLeaseReducer: Reducer<InvoiceSetListMap> = handleActions({
  ['mvj/invoiceSets/RECEIVE_BY_LEASE']: (state: InvoiceSetListMap, {payload}: ReceiveInvoiceSetsByLeaseAction) => {
    return {
      ...state,
      [payload.leaseId]: payload.invoiceSets,
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
