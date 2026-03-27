import { createAction } from "redux-actions";
import type { Action } from "redux";
import type { User } from "hds-react";
import type { ClearApiTokenAction, ReceiveApiTokenAction } from "./types";
export const clearApiToken = (): ClearApiTokenAction =>
  createAction("mvj/auth/CLEAR_API_TOKEN")();
export const receiveApiToken = (
  token: Record<string, any>,
): ReceiveApiTokenAction => createAction("mvj/auth/RECEIVE_API_TOKEN")(token);
export const userFound = (user: User): Action<string> =>
  createAction("mvj/auth/USER_FOUND")(user);
export const clearUser = (): Action<string> =>
  createAction("mvj/auth/CLEAR_USER")();
