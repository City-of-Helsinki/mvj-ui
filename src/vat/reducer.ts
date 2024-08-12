import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Reducer } from "@/types";
import type { VatList, ReceiveVatsAction } from "./types";
const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/vat/FETCH_ALL': () => true,
  'mvj/vat/NOT_FOUND': () => false,
  'mvj/vat/RECEIVE_ALL': () => false
}, false);
const listReducer: Reducer<VatList> = handleActions({
  ['mvj/vat/RECEIVE_ALL']: (state: VatList, {
    payload
  }: ReceiveVatsAction) => {
    return payload;
  }
}, []);
export default combineReducers<Record<string, any>, any>({
  isFetching: isFetchingReducer,
  list: listReducer
});