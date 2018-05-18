// @flow

import {call, put} from 'redux-saga/effects';
import {receiveError} from '$src/api/actions';

function* callMapDataApi(request: Request): Generator<any, any, any> {
  const response = yield call(fetch, request);
  const bodyAsJson = yield call([response, response.json]);
  if (status === 500) {
    yield put(receiveError(bodyAsJson));
  }

  return {response, bodyAsJson};
}

export default callMapDataApi;
