// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '$src/types';
import type {
  FetchPenaltyInterestByInvoiceAction,
  ReceivePenaltyInterestByInvoiceAction,
  PenaltyInterestNotFoundByInvoiceAction,
} from '$src/penaltyInterest/types';

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

export default combineReducers<Object, any>({
  byInvoice: byInvoiceReducer,
  isFetchingByInvoice: isFetchingByInvoiceReducer,
});
