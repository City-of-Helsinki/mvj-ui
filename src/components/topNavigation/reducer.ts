import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Reducer } from "types";
import type { ReceiveTopNavigationSettingsAction, TopNavigationSettings, TopNavigationState } from "./types";

// @ts-ignore: Type 'ReduxCompatibleReducer<TopNavigationState, TopNavigationSettings>' is not assignable to type 'Reducer<TopNavigationSettings>'.
const setSettingsReducer: Reducer<TopNavigationSettings> = handleActions({
  ['mvj/topnavigation/RECEIVE']: (state: TopNavigationState, {
    payload: options
  }: ReceiveTopNavigationSettingsAction) => {
    return options;
  }
}, {
  linkUrl: '',
  pageTitle: '',
  showSearch: false
});
export default combineReducers<Record<string, any>, any>({
  settings: setSettingsReducer
});