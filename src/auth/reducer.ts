import { handleActions } from "redux-actions";
import { combineReducers } from "redux";
import type { Reducer } from "../types";
import type { ReceiveApiTokenAction } from "./types";
const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/auth/FETCH_API_TOKEN': () => true,
  'mvj/auth/TOKEN_NOT_FOUND': () => false,
  'mvj/auth/RECEIVE_API_TOKEN': () => false
}, false);
const apiTokenReducer: Reducer<any> = handleActions({
  ['mvj/auth/CLEAR_API_TOKEN']: () => {},
  ['mvj/auth/RECEIVE_API_TOKEN']: (state: any, {
    payload
  }: ReceiveApiTokenAction) => payload
}, {});
export default combineReducers<Record<string, any>, any>({
  apiToken: apiTokenReducer,
  isFetching: isFetchingReducer
});