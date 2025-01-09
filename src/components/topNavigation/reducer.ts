import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Reducer } from "types";
import type {
  ReceiveTopNavigationSettingsAction,
  TopNavigationState,
} from "./types";

const setSettingsReducer: Reducer<TopNavigationState> = handleActions(
  {
    ["mvj/topnavigation/RECEIVE"]: (
      state: TopNavigationState,
      { payload: options }: ReceiveTopNavigationSettingsAction,
    ) => {
      return options;
    },
  },
  {
    linkUrl: "",
    pageTitle: "",
    showSearch: false,
  },
);
export default combineReducers<Record<string, any>, any>({
  settings: setSettingsReducer,
});
