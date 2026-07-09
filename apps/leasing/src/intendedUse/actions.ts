import { createAction } from "redux-actions";
import type {
  FetchIntendedUseAction,
  ReceiveIntendedUseAction,
  IntendedUseNotFoundAction,
  IntendedUseList,
} from "@/intendedUse/types";

export const fetchIntendedUse = (): FetchIntendedUseAction =>
  createAction("mvj/intendedUse/FETCH_ALL")();

export const receiveIntendedUse = (
  intendedUse: IntendedUseList,
): ReceiveIntendedUseAction =>
  createAction("mvj/intendedUse/RECEIVE_ALL")(intendedUse);

export const intendedUseNotFound = (): IntendedUseNotFoundAction =>
  createAction("mvj/intendedUse/NOT_FOUND")();
