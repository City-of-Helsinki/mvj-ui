import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import isArray from "lodash/isArray";
import type { Reducer } from "@/types";
import type { RentForPeriod, ReceiveRentForPeriodByLeaseAction, DeleteRentForPeriodByLeaseAction, ReceiveIsSaveClickedAction } from "./types";
const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/rentforperiod/FETCH_ALL': () => true,
  'mvj/rentforperiod/RECEIVE_BY_LEASE': () => false,
  'mvj/rentforperiod/NOT_FOUND': () => false
}, false);
const isSaveClickedReducer: Reducer<boolean> = handleActions({
  ['mvj/rentforperiod/RECEIVE_SAVE_CLICKED']: (state: boolean, {
    payload: isClicked
  }: ReceiveIsSaveClickedAction) => {
    return isClicked;
  }
}, false);
const byLeaseReducer: Reducer<RentForPeriod> = handleActions({
  ['mvj/rentforperiod/RECEIVE_BY_LEASE']: (state: RentForPeriod, {
    payload
  }: ReceiveRentForPeriodByLeaseAction) => {
    const rents = isArray(state[payload.leaseId]) ? [...state[payload.leaseId], payload.rent] : [payload.rent];
    return { ...state,
      [payload.leaseId]: rents
    };
  },
  ['mvj/rentforperiod/DELETE_BY_LEASE']: (state: RentForPeriod, {
    payload
  }: DeleteRentForPeriodByLeaseAction) => {
    const rents = isArray(state[payload.leaseId]) ? state[payload.leaseId].filter(rent => rent.id !== payload.id) : [];
    return { ...state,
      [payload.leaseId]: rents
    };
  }
}, {});
export default combineReducers<Record<string, any>, any>({
  byLease: byLeaseReducer,
  isFetching: isFetchingReducer,
  isSaveClicked: isSaveClickedReducer
});