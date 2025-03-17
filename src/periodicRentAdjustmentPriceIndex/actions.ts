import { createAction } from "redux-actions";
import {
  FETCH_ACTION_STRING,
  NOT_FOUND_ACTION_STRING,
  RECEIVE_ACTION_STRING,
} from "./constants";
import {
  FetchPeriodicRentAdjustmentPriceIndexAction,
  PeriodicRentAdjustmentPriceIndex,
  PeriodicRentAdjustmentPriceIndexNotFoundAction,
  ReceivePeriodicRentAdjustmentPriceIndexAction,
} from "./types";

export const fetchPeriodicRentAdjustmentPriceIndex =
  (): FetchPeriodicRentAdjustmentPriceIndexAction =>
    createAction(FETCH_ACTION_STRING)();

export const receivePeriodicRentAdjustmentPriceIndex = (
  payload: PeriodicRentAdjustmentPriceIndex,
): ReceivePeriodicRentAdjustmentPriceIndexAction =>
  createAction(RECEIVE_ACTION_STRING)(payload);

export const notFound = (): PeriodicRentAdjustmentPriceIndexNotFoundAction =>
  createAction(NOT_FOUND_ACTION_STRING)();
