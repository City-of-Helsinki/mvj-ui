// @flow
import {call, select} from 'redux-saga/effects';

import {getApiToken} from '$src/auth/selectors';
import userManager from '$src/auth/util/user-manager';
import {displayUIMessage} from '$util/helpers';

function* callApi(request: Request): Generator<any, any, any> {
  const apiToken = yield select(getApiToken);
  if (apiToken) {
    request.headers.set('Authorization', `Bearer ${apiToken}`);
  }

  if (request.method === 'PATCH' || request.method === 'POST' || request.method === 'PUT') {
    request.headers.set('Content-Type', 'application/json');
  }

  const response = yield call(fetch, request);
  const status = response.status;

  switch(status) {
    case 204:
      return {response};
    case 403:
      displayUIMessage({title: '', body: 'Sinulla ei ole oikeuksia järjestelmän käyttöön.'}, {type: 'error'});
      userManager.removeUser();
      sessionStorage.clear();
      return {response};
    case 500:
      return {response, bodyAsJson: {exception: response.status, message: response.statusText}};
  }

  const bodyAsJson = yield call([response, response.json]);
  return {response, bodyAsJson};
}

export default callApi;
