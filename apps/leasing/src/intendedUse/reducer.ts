import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Reducer } from "@/types";
import type {
  IntendedUseList,
  ReceiveIntendedUseAction,
} from "@/intendedUse/types";

const isFetchingReducer: Reducer<boolean> = handleActions(
  {
    "mvj/intendedUse/FETCH_ALL": () => true,
    "mvj/intendedUse/RECEIVE_ALL": () => false,
    "mvj/intendedUse/NOT_FOUND": () => false,
  },
  false,
);

const listReducer: Reducer<IntendedUseList> = handleActions(
  {
    ["mvj/intendedUse/RECEIVE_ALL"]: (
      state: IntendedUseList,
      { payload }: ReceiveIntendedUseAction,
    ) => {
      return payload;
    },
  },
  [],
);

export default combineReducers<Record<string, any>, any>({
  isFetching: isFetchingReducer,
  list: listReducer,
});
