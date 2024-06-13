import type { Action } from "../types";
export type ApiError = Record<string, any> | null;
export type ReceiveErrorAction = Action<string, ApiError>;
export type ClearErrorAction = Action<string, void>;
export type ApiState = {
  error: ApiError;
};
export type ApiSyncResponse<T> = {
  response: Response,
  bodyAsJson: T
};