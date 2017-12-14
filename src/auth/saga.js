// @flow

import {takeLatest} from 'redux-saga';
import {call, fork, put} from 'redux-saga/effects';

import {tokenNotFound, receiveApiToken} from './actions';
import {receiveError} from '../api/actions';

function* fetchApiTokenSaga({payload: token}): Generator<> {
  try {
    const request = new Request('https://api.hel.fi/sso/api-tokens/', {
      headers: {'Authorization': `Bearer ${token}`},
    });
    const response = yield call(fetch, request);
    const {status: statusCode, statusText} = response;

    switch (statusCode) {
      case 200: {
        const bodyAsJson = yield call([response, response.json]);
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


export default function*(): Generator<> {
  yield [
    fork(function*(): Generator<> {
      yield takeLatest('mvj/auth/FETCH_API_TOKEN', fetchApiTokenSaga);
    }),
  ];
}
