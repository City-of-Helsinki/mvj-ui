import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Reducer } from "@/types";
import type { InvoiceSetListMap, ReceiveInvoiceSetsByLeaseAction } from "./types";
const isFetchingReducer: Reducer<boolean> = handleActions({
  ['mvj/invoiceSets/FETCH_BY_LEASE']: () => true,
  ['mvj/invoiceSets/NOT_FOUND']: () => false,
  ['mvj/invoiceSets/RECEIVE_BY_LEASE']: () => false
}, false);
const byLeaseReducer: Reducer<InvoiceSetListMap> = handleActions({
  ['mvj/invoiceSets/RECEIVE_BY_LEASE']: (state: InvoiceSetListMap, {
    payload
  }: ReceiveInvoiceSetsByLeaseAction) => {
    return { ...state,
      [payload.leaseId]: payload.invoiceSets
    };
  }
}, {});
export default combineReducers<Record<string, any>, any>({
  byLease: byLeaseReducer,
  isFetching: isFetchingReducer
});