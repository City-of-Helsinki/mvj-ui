import { handleActions } from "redux-actions";
import { combineReducers } from "redux";
import type { Reducer } from "@/types";
import type { ReceiveApiTokenAction, ReceiveUserAction } from "./types";

const apiTokenReducer: Reducer<any> = handleActions({
  ['mvj/auth/CLEAR_API_TOKEN']: () => null,
  ['mvj/auth/RECEIVE_API_TOKEN']: (state: any, {
    payload
  }: ReceiveApiTokenAction) => payload
}, null);

const userReducer: Reducer<any> = handleActions({
    ['mvj/auth/USER_FOUND']: (state: any, {
      payload 
    }: ReceiveUserAction) => payload,
    ['mvj/auth/CLEAR_USER']: () => null,
}, null);

export const authReducer = combineReducers<Record<string, any>, any>({
  apiToken: apiTokenReducer,
  user: userReducer,
});
