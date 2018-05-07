// @flow

import {call, put, select} from 'redux-saga/effects';
import {receiveError} from './actions';

import {getApiToken} from '../auth/selectors';

function* callApi(request: Request): Generator<any, any, any> {
  const apiToken = yield select(getApiToken);
  if (apiToken) {
    request.headers.set('Authorization', `Bearer ${apiToken}`);
  }

  if (request.method === 'PATCH' || request.method === 'POST' || request.method === 'PUT') {
    request.headers.set('Content-Type', 'application/json');
  }

  const response = yield call(fetch, request);
  const bodyAsJson = yield call([response, response.json]);

  if (status === 500) {
    yield put(receiveError(bodyAsJson));
  }

  return {response, bodyAsJson};
}

export default callApi;
