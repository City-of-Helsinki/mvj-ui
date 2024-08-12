import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Reducer } from "@/types";
import type { ReceiveBillingPeriodsAction } from "./types";
const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/billingperiods/FETCH_ALL': () => true,
  'mvj/billingperiods/RECEIVE_ALL': () => false,
  'mvj/billingperiods/NOT_FOUND': () => false
}, false);
const byLeaseReducer: Reducer<Record<string, any>> = handleActions({
  ['mvj/billingperiods/RECEIVE_ALL']: (state: Record<string, any>, {
    payload
  }: ReceiveBillingPeriodsAction) => {
    return { ...state,
      [payload.leaseId]: payload.billingPeriods
    };
  }
}, {});
export default combineReducers<Record<string, any>, any>({
  byLease: byLeaseReducer,
  isFetching: isFetchingReducer
});