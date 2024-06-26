import { store } from "root/startApp";
import { getApiToken } from "/src/auth/selectors";
import { UI_ACCEPT_LANGUAGE_VALUE } from "/src/api/constants";
import type { ApiSyncResponse } from "./types";
import type { ApiResponse } from "types";

const callApiAsync = async <T = ApiResponse>(request: Request): Promise<ApiSyncResponse<T>> => {
  const apiToken = getApiToken(store.getState());

  if (apiToken) {
    request.headers.set('Authorization', `Bearer ${apiToken}`);
  }

  request.headers.set('Accept-Language', UI_ACCEPT_LANGUAGE_VALUE);

  if (request.method === 'PATCH' || request.method === 'POST' || request.method === 'PUT') {
    request.headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(request);
  const bodyAsJson = await response.json();
  return {
    response,
    bodyAsJson
  };
};

export default callApiAsync;