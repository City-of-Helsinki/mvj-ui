export type ApiError = Record<string, any> | null;
export type ApiState = {
  error: ApiError;
};
export type ApiSyncResponse<T> = {
  response: Response;
  bodyAsJson: T;
};
