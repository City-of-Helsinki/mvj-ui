// @flow
import {store} from '$src/root/startApp';
import {getApiToken} from '$src/auth/selectors';

const callApiAsync = async(request: Request) => {
  const apiToken = await getApiToken(store.getState());

  if (apiToken) {
    request.headers.set('Authorization', `Bearer ${apiToken}`);
  }

  if (request.method === 'PATCH' || request.method === 'POST' || request.method === 'PUT') {
    request.headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(request);
  const bodyAsJson = await response.json();
  return {response, bodyAsJson};
};

export default callApiAsync;
