// @flow
import {call, select} from 'redux-saga/effects';

import {getApiToken} from '$src/auth/selectors';
import {UI_ACCEPT_LANGUAGE_VALUE} from '$src/api/constants';

function* callApi(request: Request): Generator<any, any, any> {
  const apiToken = yield select(getApiToken);

  if (apiToken) {
    request.headers.set('Authorization', `Bearer ${apiToken}`);
  }

  request.headers.set(
    'Accept-Language',
    UI_ACCEPT_LANGUAGE_VALUE
  );

  if (request.method === 'PATCH' || request.method === 'POST' || request.method === 'PUT') {
    request.headers.set('Content-Type', 'application/json');
  }

  const response = yield call(fetch, request);
  const status = response.status;

  switch(status) {
    case 204:
      return {response};
    case 500:
      return {response, bodyAsJson: {exception: response.status, message: response.statusText}};
  }

  const bodyAsJson = yield call([response, response.json]);
  return {response, bodyAsJson};
}

export default callApi;
