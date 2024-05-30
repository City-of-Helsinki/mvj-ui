import { store } from "root/startApp";
import { getApiToken } from "auth/selectors";
import { UI_ACCEPT_LANGUAGE_VALUE } from "api/constants";

const callApiAsync = async (request: Request): Promise<Record<string, any>> => {
  const apiToken = await getApiToken(store.getState());

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