import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Reducer } from "@/types";
import {
  FETCH_ACTION_STRING,
  NOT_FOUND_ACTION_STRING,
  RECEIVE_ACTION_STRING,
} from "./constants";
import {
  OldDwellingsInHousingCompaniesPriceIndex,
  ReceiveOldDwellingsInHousingCompaniesPriceIndexAction,
} from "./types";

const isFetchingReducer: Reducer<boolean> = handleActions(
  {
    [FETCH_ACTION_STRING]: () => true,
    [NOT_FOUND_ACTION_STRING]: () => false,
    [RECEIVE_ACTION_STRING]: () => false,
  },
  false,
);
const latestReducer: Reducer<OldDwellingsInHousingCompaniesPriceIndex> = handleActions(
  {
    [RECEIVE_ACTION_STRING]: (
      state: OldDwellingsInHousingCompaniesPriceIndex,
      { payload }: ReceiveOldDwellingsInHousingCompaniesPriceIndexAction,
    ) => {
      return payload;
    },
  },
  null,
);
export default combineReducers<Record<string, any>, any>({
  isFetching: isFetchingReducer,
  latest: latestReducer,
});
