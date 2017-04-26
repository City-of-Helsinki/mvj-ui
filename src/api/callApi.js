// @flow

import {call, put} from 'redux-saga/effects';
import {receiveError} from './actions';
import {getStorageItem} from '../util/storage';

const accessToken = getStorageItem('TOKEN');

function* callApi(request: Request): Generator<> {

  if (accessToken) {
    request.headers.set('Authorization', `Token ${accessToken}`);
  }

  const response = yield call(fetch, request);
  const bodyAsJson = yield call([response, response.json]);

  if (status === 500) {
    yield put(receiveError(bodyAsJson));
  }

  return {response, bodyAsJson};
}

export default callApi;
