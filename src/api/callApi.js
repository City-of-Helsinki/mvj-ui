// @flow

import {call, put, select} from 'redux-saga/effects';
import {getAccessToken, getRefreshToken} from '../auth/selectors';
import {performLogout, receiveLogin} from '../auth/actions';
import {refreshRequest} from '../auth/requests';
import {receiveError} from './actions';

function* callApi(request: Request, tryRefreshToken: boolean = true): Generator<> {
  const accessToken = yield select(getAccessToken);

  if (accessToken) {
    request.headers.set('authorization', `Bearer ${accessToken}`);
  }

  const response = yield call(fetch, request);
  const bodyAsJson = yield call([response, response.json]);

  if (response.status === 401 && accessToken && tryRefreshToken) {
    const {response: {status: statusCode}} = yield call(refresh);

    if (statusCode === 200) {
      return yield call(callApi, request, false);
    }
  }

  if (status === 500) {
    yield put(receiveError(bodyAsJson));
  }

  return {response, bodyAsJson};
}

export function* refresh(): Generator<> {
  const refreshToken = yield select(getRefreshToken);

  const {response, bodyAsJson} = yield call(refreshRequest, refreshToken);

  if (response.status === 200) {
    yield put(receiveLogin(bodyAsJson));
  } else if (response.status === 403) {
    yield put(performLogout());
  }

  return {response, bodyAsJson};
}

export default callApi;
