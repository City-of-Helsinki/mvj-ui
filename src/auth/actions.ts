import { createAction } from "redux-actions";
import type { ClearApiTokenAction, FetchApiTokenAction, ReceiveApiTokenAction, TokenNotFoundAction } from "./types";
export const clearApiToken = (): ClearApiTokenAction => createAction('mvj/auth/CLEAR_API_TOKEN')();
export const fetchApiToken = (accessToken: string): FetchApiTokenAction => createAction('mvj/auth/FETCH_API_TOKEN')(accessToken);
export const receiveApiToken = (token: Record<string, any>): ReceiveApiTokenAction => createAction('mvj/auth/RECEIVE_API_TOKEN')(token);
export const tokenNotFound = (): TokenNotFoundAction => createAction('mvj/auth/TOKEN_NOT_FOUND')();