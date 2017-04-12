// @flow

import {takeLatest} from 'redux-saga';
import {call, fork, put} from 'redux-saga/effects';
import {receiveError} from '../api/actions';
import {receiveLogin, fetchUser, receiveUser} from './actions';
import {loginRequest, fetchUserRequest} from './requests';

import type {PerformLoginAction} from './types';

function* performLoginSaga({payload: {username, password}}: PerformLoginAction): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(loginRequest, username, password);

    if (statusCode === 200) {
      yield put(receiveLogin(bodyAsJson));
      yield put(fetchUser());
    } else {
      yield put(receiveError(bodyAsJson));
    }
  } catch (error) {
    console.error('Failed to login with error: "%s"', error);
  }
}

function* fetchUserSaga(): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchUserRequest);

    if (statusCode === 200) {
      yield put(receiveUser(bodyAsJson.data));
    } else {
      yield put(receiveError(bodyAsJson));
    }
  } catch (error) {
    console.error('Failed to fetch user with error "%s"', error);
  }
}

export default function* (): Generator<> {
  yield [
    fork(function* () {
      yield takeLatest('mvj/auth/PERFORM_LOGIN', performLoginSaga);
    }),
    fork(function* () {
      yield takeLatest('mvj/auth/FETCH_USER', fetchUserSaga);
    }),
  ];
}
