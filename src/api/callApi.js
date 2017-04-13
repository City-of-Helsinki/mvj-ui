// @flow

import {call, put} from 'redux-saga/effects';
import {receiveError} from './actions';

const accessToken = 'DUMMY';

function* callApi(request: Request): Generator<> {

  if (accessToken) {
    request.headers.set('authorization', `Bearer ${accessToken}`);
  }

  const response = yield call(fetch, request);
  const bodyAsJson = yield call([response, response.json]);

  if (status === 500) {
    yield put(receiveError(bodyAsJson));
  }

  return {response, bodyAsJson};
}

export default callApi;
