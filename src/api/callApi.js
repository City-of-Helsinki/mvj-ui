// @flow

import {call, put} from 'redux-saga/effects';
import {receiveError} from './actions';
import {getStorageItem} from '../util/storage';

function* callApi(request: Request): Generator<> {
  const accessToken = getStorageItem('TOKEN');

  if (accessToken) {
    request.headers.set('Authorization', `Token ${accessToken}`);
  }

  if (request.method === 'POST') {
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
