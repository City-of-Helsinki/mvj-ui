// @flow

/* global OPENID_CONNECT_API_TOKEN_URL */

import {takeLatest} from 'redux-saga';
import {call, fork, put} from 'redux-saga/effects';

import {tokenNotFound, receiveApiToken} from './actions';
import {receiveError} from '../api/actions';
import {getEpochTime} from '$util/helpers';

function* fetchApiTokenSaga({payload: token}): Generator<any, any, any> {
  try {
    // $FlowFixMe
    const request = new Request(OPENID_CONNECT_API_TOKEN_URL || 'https://api.hel.fi/sso/api-tokens/', {
      headers: {'Authorization': `Bearer ${token}`},
    });
    const response = yield call(fetch, request);
    const {status: statusCode, statusText} = response;

    switch (statusCode) {
      case 200: {
        const bodyAsJson = yield call([response, response.json]);
        // Add expires_at time to fetch new api token after 9 minutes
        bodyAsJson.expires_at = getEpochTime() + 9*60;
        yield put(receiveApiToken(bodyAsJson));
        break;
      }
      case 401: {
        yield put(tokenNotFound());
        yield put(receiveError({errors: {error: '401: Luvaton käyttö'}}));
        break;
      }
      default: {
        yield put(tokenNotFound());
        yield put(receiveError({errors: {error: `${statusCode}: ${statusText}`}}));
        break;
      }
    }
  } catch (error) {
    yield put(tokenNotFound());
    yield put(receiveError(error));
  }
}

function* clearApiTokenSaga(): Generator<any, any, any> {
  try {
    yield put(receiveApiToken({}));
  } catch (error) {
    console.log('Clearing API token failed');
  }
}

export default function*(): Generator<any, any, any> {
  yield [
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/auth/FETCH_API_TOKEN', fetchApiTokenSaga);
      yield takeLatest('mvj/auth/CLEAR_API_TOKEN', clearApiTokenSaga);
    }),
  ];
}
