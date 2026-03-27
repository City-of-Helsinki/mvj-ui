import { createAction } from "redux-actions";
import {
  FETCH_ACTION_STRING,
  NOT_FOUND_ACTION_STRING,
  RECEIVE_ACTION_STRING,
} from "./constants";
import {
  FetchOldDwellingsInHousingCompaniesPriceIndexAction,
  OldDwellingsInHousingCompaniesPriceIndex,
  OldDwellingsInHousingCompaniesPriceIndexNotFoundAction,
  ReceiveOldDwellingsInHousingCompaniesPriceIndexAction,
} from "./types";

export const fetchOldDwellingsInHousingCompaniesPriceIndex =
  (): FetchOldDwellingsInHousingCompaniesPriceIndexAction =>
    createAction(FETCH_ACTION_STRING)();

export const receiveOldDwellingsInHousingCompaniesPriceIndex = (
  payload: OldDwellingsInHousingCompaniesPriceIndex,
): ReceiveOldDwellingsInHousingCompaniesPriceIndexAction =>
  createAction(RECEIVE_ACTION_STRING)(payload);

export const notFound =
  (): OldDwellingsInHousingCompaniesPriceIndexNotFoundAction =>
    createAction(NOT_FOUND_ACTION_STRING)();
