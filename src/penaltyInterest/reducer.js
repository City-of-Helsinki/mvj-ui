// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Methods, Reducer} from '$src/types';
import type {
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  FetchPenaltyInterestByInvoiceAction,
  ReceivePenaltyInterestByInvoiceAction,
  PenaltyInterestNotFoundByInvoiceAction,
} from '$src/penaltyInterest/types';

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/penaltyInterest/FETCH_ATTRIBUTES': () => true,
  'mvj/penaltyInterest/RECEIVE_ATTRIBUTES': () => false,
  'mvj/penaltyInterest/RECEIVE_METHODS': () => false,
  'mvj/penaltyInterest/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/penaltyInterest/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes || {};
  },
}, {});

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/penaltyInterest/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods || {};
  },
}, {});

const isFetchingByInvoiceReducer: Reducer<Object> = handleActions({
  ['mvj/penaltyInterest/FETCH_BY_INVOICE']: (state: Object, {payload: invoice}: FetchPenaltyInterestByInvoiceAction) => {
    return {
      ...state,
      [invoice]: true,
    };
  },
  ['mvj/penaltyInterest/RECEIVE_BY_INVOICE']: (state: Object, {payload}: ReceivePenaltyInterestByInvoiceAction) => {
    return {
      ...state,
      [payload.invoiceId]: false,
    };
  },
  ['mvj/penaltyInterest/NOT_FOUND_BY_INVOICE']: (state: Object, {payload: invoice}: PenaltyInterestNotFoundByInvoiceAction) => {
    return {
      ...state,
      [invoice]: false,
    };
  },
}, {});

const byInvoiceReducer: Reducer<Object> = handleActions({
  ['mvj/penaltyInterest/RECEIVE_BY_INVOICE']: (state: Object, {payload}: ReceivePenaltyInterestByInvoiceAction) => {
    return {
      ...state,
      [payload.invoiceId]: payload.penaltyInterest,
    };
  },
}, {});

export default combineReducers({
  attributes: attributesReducer,
  byInvoice: byInvoiceReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  isFetchingByInvoice: isFetchingByInvoiceReducer,
  methods: methodsReducer,
});
