// @flow

import {takeLatest} from 'redux-saga';
import {call, fork, put} from 'redux-saga/effects';
import {receiveUsers, notFound} from './actions';
import {fetchUsers} from './requests';

import type {FetchUsersAction} from './types';
import {receiveError} from '../api/actions';

function* fetchUsersSaga({payload: path}: FetchUsersAction): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchUsers);

    switch (statusCode) {
      case 200:
        const users = bodyAsJson.map(user => ({
          ...user,
          id: user.username,
          label: `${user.first_name} ${user.last_name}`,
        }));
        yield put(receiveUsers(users));
        break;
      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch users with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<> {
  yield [
    fork(function*(): Generator<> {
      yield takeLatest('mvj/user/FETCH', fetchUsersSaga);
    }),
  ];
}
