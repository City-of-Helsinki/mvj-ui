import type { Action } from "../types";
export type ApiToken = Record<string, any> | null;
export type AuthState = Record<string, any> | null;
export type FetchApiTokenAction = Action<"mvj/auth/FETCH_API_TOKEN", string>;
export type ReceiveApiTokenAction = Action<"mvj/auth/RECEIVE_API_TOKEN", Record<string, any>>;
export type ClearApiTokenAction = Action<"mvj/auth/CLEAR_API_TOKEN", void>;
export type TokenNotFoundAction = Action<"mvj/auth/TOKEN_NOT_FOUND", void>;