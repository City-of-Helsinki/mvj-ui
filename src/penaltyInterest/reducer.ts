import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Reducer } from "src/types";
import type { FetchPenaltyInterestByInvoiceAction, ReceivePenaltyInterestByInvoiceAction, PenaltyInterestNotFoundByInvoiceAction } from "src/penaltyInterest/types";
const isFetchingByInvoiceReducer: Reducer<Record<string, any>> = handleActions({
  ['mvj/penaltyInterest/FETCH_BY_INVOICE']: (state: Record<string, any>, {
    payload: invoice
  }: FetchPenaltyInterestByInvoiceAction) => {
    return { ...state,
      [invoice]: true
    };
  },
  ['mvj/penaltyInterest/RECEIVE_BY_INVOICE']: (state: Record<string, any>, {
    payload
  }: ReceivePenaltyInterestByInvoiceAction) => {
    return { ...state,
      [payload.invoiceId]: false
    };
  },
  ['mvj/penaltyInterest/NOT_FOUND_BY_INVOICE']: (state: Record<string, any>, {
    payload: invoice
  }: PenaltyInterestNotFoundByInvoiceAction) => {
    return { ...state,
      [invoice]: false
    };
  }
}, {});
const byInvoiceReducer: Reducer<Record<string, any>> = handleActions({
  ['mvj/penaltyInterest/RECEIVE_BY_INVOICE']: (state: Record<string, any>, {
    payload
  }: ReceivePenaltyInterestByInvoiceAction) => {
    return { ...state,
      [payload.invoiceId]: payload.penaltyInterest
    };
  }
}, {});
export default combineReducers<Record<string, any>, any>({
  byInvoice: byInvoiceReducer,
  isFetchingByInvoice: isFetchingByInvoiceReducer
});