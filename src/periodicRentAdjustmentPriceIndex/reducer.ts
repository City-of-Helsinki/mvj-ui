import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Reducer } from "@/types";
import {
  FETCH_ACTION_STRING,
  NOT_FOUND_ACTION_STRING,
  RECEIVE_ACTION_STRING,
} from "./constants";
import {
  PeriodicRentAdjustmentPriceIndex,
  ReceivePeriodicRentAdjustmentPriceIndexAction,
} from "./types";

const isFetchingReducer: Reducer<boolean> = handleActions(
  {
    [FETCH_ACTION_STRING]: () => true,
    [NOT_FOUND_ACTION_STRING]: () => false,
    [RECEIVE_ACTION_STRING]: () => false,
  },
  false,
);
const latestReducer: Reducer<PeriodicRentAdjustmentPriceIndex> = handleActions(
  {
    [RECEIVE_ACTION_STRING]: (
      state: PeriodicRentAdjustmentPriceIndex,
      { payload }: ReceivePeriodicRentAdjustmentPriceIndexAction,
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
