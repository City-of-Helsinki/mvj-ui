// @flow

import {call, put, select} from 'redux-saga/effects';

import {receiveError} from '$src/api/actions';
import {getApiToken} from '$src/auth/selectors';
import {UI_ACCEPT_LANGUAGE_VALUE} from '$src/api/constants';

function* callUploadRequest(request: Request): Generator<any, any, any> {
  const apiToken = yield select(getApiToken);
  if (apiToken) {
    request.headers.set('Authorization', `Bearer ${apiToken}`);
  }

  request.headers.set(
    'Accept-Language',
    UI_ACCEPT_LANGUAGE_VALUE
  );

  const response = yield call(fetch, request);
  const status = response.status;
  const bodyAsJson = yield call([response, response.json]);

  if (status === 500) {
    yield put(receiveError(bodyAsJson));
  }

  return {response, bodyAsJson};
}

export default callUploadRequest;
